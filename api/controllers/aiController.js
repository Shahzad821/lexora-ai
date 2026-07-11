import OpenAI from "openai";
import { clerkClient } from "@clerk/express";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

import sql from "../configs/db.js";
import { v2 as cloudinary } from "cloudinary";
import enforceUsageLimit from "../utils/enforceUsageLimit.js";

const cleanEnv = (value) => value?.trim().replace(/^["']|["']$/g, "");

const openai = new OpenAI({
  apiKey: cleanEnv(process.env.LEXORA_API_KEY),
  baseURL:
    cleanEnv(process.env.LEXORA_BASE_URL) ||
    "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const textModel = cleanEnv(process.env.LEXORA_MODEL) || "gemini-3.5-flash";
const clipdropApiKey = cleanEnv(process.env.CLIP_DROP_API_KEY);
const clipdropApiRoot =
  cleanEnv(process.env.CLIP_DROP_API_ROOT) || "https://clipdrop-api.co";

const lengthConfig = {
  Short: { words: "500-700", maxTokens: 2000 },
  Medium: { words: "900-1200", maxTokens: 3000 },
  Long: { words: "1500-2000", maxTokens: 4500 },
};

const assertPrompt = (prompt, max = 2000) => {
  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
    return "Prompt must be at least 3 characters.";
  }

  if (prompt.length > max) {
    return `Prompt must be ${max} characters or fewer.`;
  }

  return null;
};

const chargeUsage = async (req) => {
  if (req.plan === "premium") return 0;

  const nextUsage = req.free_usage + 1;
  await clerkClient.users.updateUserMetadata(req.userId, {
    privateMetadata: { free_usage: nextUsage },
  });

  return nextUsage;
};

const saveCreation = async ({
  userId,
  prompt,
  content,
  type,
  publish = false,
}) => {
  const rows = await sql`
    INSERT INTO creations (user_id, prompt, content, type, publish)
    VALUES (${userId}, ${prompt}, ${content}, ${type}, ${publish})
    RETURNING *
  `;

  return rows[0];
};

const bufferToDataUrl = (buffer, mimeType = "image/png") =>
  `data:${mimeType};base64,${buffer.toString("base64")}`;

const uploadBase64Image = async (buffer, folder) => {
  const dataUrl = bufferToDataUrl(buffer);

  try {
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder,
      resource_type: "image",
    });

    return result.secure_url;
  } catch (error) {
    console.error(
      "Cloudinary upload failed:",
      error?.http_code,
      error?.message,
    );
    throw error;
  }
};

const createFileBlob = (file) =>
  new Blob([file.buffer], {
    type: file.mimetype || "application/octet-stream",
  });

const readProviderError = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json().catch(() => ({}));
    return data.error || data.message || JSON.stringify(data);
  }

  return response.text().catch(() => "Image provider request failed.");
};

// Matches Clipdrop's documented request pattern exactly: POST with just the
// x-api-key header and a multipart/form-data body, read back as an ArrayBuffer.
const postClipdropForm = async (path, form) => {
  if (!clipdropApiKey) {
    const error = new Error("Missing CLIP_DROP_API_KEY.");
    error.status = 500;
    throw error;
  }

  const response = await fetch(`${clipdropApiRoot}${path}`, {
    method: "POST",
    headers: {
      "x-api-key": clipdropApiKey,
    },
    body: form,
  });

  if (!response.ok) {
    const message = await readProviderError(response);
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return Buffer.from(await response.arrayBuffer());
};

const sendImageProviderError = (res, error, fallbackMessage) => {
  if (error?.status === 402) {
    return res.status(402).json({
      error:
        "Clipdrop has no remaining credits. Add credits or use another Clipdrop API key.",
    });
  }

  if (error?.status === 401 || error?.status === 403) {
    return res.status(error.status).json({
      error: "Clipdrop API key is missing, invalid, or not allowed.",
    });
  }

  if (error?.http_code === 403 || error?.name === "UnexpectedResponse") {
    return res.status(502).json({
      error:
        "Image upload to Cloudinary failed. Please verify your Cloudinary credentials and account permissions.",
    });
  }

  if (error?.status === 429) {
    return res.status(429).json({
      error: "Clipdrop rate limit reached. Please try again shortly.",
    });
  }

  return res.status(500).json({ error: fallbackMessage });
};

const generateImageWithClipdrop = async (prompt) => {
  const form = new FormData();
  form.append("prompt", prompt.slice(0, 1000));

  return postClipdropForm("/text-to-image/v1", form);
};

const removeBackgroundWithClipdrop = async (file) => {
  const form = new FormData();
  form.append(
    "image_file",
    createFileBlob(file),
    file.originalname || "image.png",
  );

  return postClipdropForm("/remove-background/v1", form);
};

const replaceBackgroundWithClipdrop = async (file, prompt) => {
  const form = new FormData();
  form.append(
    "image_file",
    createFileBlob(file),
    file.originalname || "image.png",
  );
  form.append("prompt", prompt.slice(0, 1000));

  return postClipdropForm("/replace-background/v1", form);
};

const cleanupWithClipdrop = async ({ imageFile, maskFile }) => {
  const form = new FormData();
  form.append(
    "image_file",
    createFileBlob(imageFile),
    imageFile.originalname || "image.png",
  );
  form.append(
    "mask_file",
    createFileBlob(maskFile),
    maskFile.originalname || "mask.png",
  );
  form.append("mode", "quality");

  return postClipdropForm("/cleanup/v1", form);
};

const getCompletionContent = async ({
  messages,
  max_tokens = 1000,
  temperature = 0.7,
  model = textModel,
}) => {
  const supportsReasoningToggle = /2\.5/.test(model);

  const completion = await openai.chat.completions.create({
    model,
    messages,
    max_tokens,
    temperature,
    ...(supportsReasoningToggle ? { reasoning_effort: "none" } : {}),
  });

  const choice = completion.choices?.[0];

  if (choice?.finish_reason === "length") {
    console.warn(
      `Completion truncated (finish_reason=length) for model ${model}. ` +
        `Consider raising max_tokens further (current: ${max_tokens}).`,
    );
  }

  return choice?.message?.content?.trim();
};

export const generateArticle = async (req, res) => {
  try {
    if (!enforceUsageLimit(req, res)) return;

    const userId = req.userId;
    const {
      prompt,
      length = "Medium",
      tone = "Professional",
      audience = "",
    } = req.body;
    const promptError = assertPrompt(prompt);

    if (promptError) return res.status(400).json({ error: promptError });
    if (!lengthConfig[length]) {
      return res
        .status(400)
        .json({ error: "Length must be Short, Medium, or Long." });
    }

    const selectedLength = lengthConfig[length];
    const targetAudience = audience?.trim() || "the intended readers";
    const fullPrompt = `Write a ${selectedLength.words} word ${tone.toLowerCase()} article for ${targetAudience} about: ${prompt.trim()}`;
    const content = await getCompletionContent({
      messages: [
        {
          role: "system",
          content:
            "You are Lexora AI, a careful writing assistant. Return polished markdown with useful headings, concrete examples, and no filler.",
        },
        { role: "user", content: fullPrompt },
      ],
      max_tokens: selectedLength.maxTokens,
    });

    if (!content) {
      return res
        .status(502)
        .json({ error: "AI provider returned an empty response." });
    }

    const creation = await saveCreation({
      userId,
      prompt: fullPrompt,
      content,
      type: "article",
    });
    const usage = await chargeUsage(req);

    res.status(200).json({
      content,
      creation,
      usage: { plan: req.plan, free_usage: usage },
    });
  } catch (error) {
    console.error("Generate article error:", error);
    res.status(500).json({ error: "Failed to generate article." });
  }
};

export const generateBlogTitles = async (req, res) => {
  try {
    if (!enforceUsageLimit(req, res)) return;

    const userId = req.userId;
    const {
      keyword,
      category = "General",
      angle = "Practical guide",
    } = req.body;
    const promptError = assertPrompt(keyword, 200);

    if (promptError) return res.status(400).json({ error: promptError });

    const fullPrompt = `Generate 8 blog title ideas for the keyword "${keyword.trim()}" in the ${category} category. Preferred angle: ${angle}. Return one title per line.`;
    const content = await getCompletionContent({
      messages: [
        {
          role: "system",
          content:
            "You create concise, specific blog titles. Return plain lines only, without numbering unless it improves readability.",
        },
        { role: "user", content: fullPrompt },
      ],
      max_tokens: 1000,
      temperature: 0.8,
    });

    if (!content) {
      return res
        .status(502)
        .json({ error: "AI provider returned an empty response." });
    }

    const titles = content
      .split("\n")
      .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
      .filter(Boolean);
    const creation = await saveCreation({
      userId,
      prompt: fullPrompt,
      content,
      type: "blog-title",
    });
    const usage = await chargeUsage(req);

    res.status(200).json({
      content,
      titles,
      creation,
      usage: { plan: req.plan, free_usage: usage },
    });
  } catch (error) {
    console.error("Generate blog titles error:", error);
    res.status(500).json({ error: "Failed to generate blog titles." });
  }
};

export const generateImage = async (req, res) => {
  try {
    if (!enforceUsageLimit(req, res)) return;

    const userId = req.userId;
    const { prompt, style = "Realistic", publish = false } = req.body;
    const promptError = assertPrompt(prompt);

    if (promptError) return res.status(400).json({ error: promptError });

    const fullPrompt = `${prompt.trim()} in ${style} style. High quality, detailed, production-ready.`;

    const imageBuffer = await generateImageWithClipdrop(fullPrompt);
    const content = await uploadBase64Image(imageBuffer, "lexora/creations");

    const creation = await saveCreation({
      userId,
      prompt: fullPrompt,
      content,
      type: "image",
      publish: Boolean(publish),
    });
    const usage = await chargeUsage(req);

    res.status(200).json({
      content,
      creation,
      usage: { plan: req.plan, free_usage: usage },
    });
  } catch (error) {
    console.error("Generate image error:", error);
    sendImageProviderError(res, error, "Failed to generate image.");
  }
};

export const removeBackground = async (req, res) => {
  try {
    if (!enforceUsageLimit(req, res)) return;
    if (!req.file)
      return res.status(400).json({ error: "Image file is required." });

    const userId = req.userId;
    const imageBuffer = await removeBackgroundWithClipdrop(req.file);
    const content = await uploadBase64Image(imageBuffer, "lexora/creations");
    const prompt = `Remove the background from ${req.file.originalname}`;
    const creation = await saveCreation({
      userId,
      prompt,
      content,
      type: "image",
    });
    const usage = await chargeUsage(req);

    res.status(200).json({
      content,
      creation,
      usage: { plan: req.plan, free_usage: usage },
    });
  } catch (error) {
    console.error("Remove background error:", error);
    sendImageProviderError(res, error, "Failed to remove background.");
  }
};

export const replaceBackground = async (req, res) => {
  try {
    if (!enforceUsageLimit(req, res)) return;
    if (!req.file)
      return res.status(400).json({ error: "Image file is required." });

    const userId = req.userId;
    const { prompt } = req.body;
    const promptError = assertPrompt(prompt);

    if (promptError) return res.status(400).json({ error: promptError });

    const imageBuffer = await replaceBackgroundWithClipdrop(
      req.file,
      prompt.trim(),
    );
    const content = await uploadBase64Image(imageBuffer, "lexora/creations");
    const fullPrompt = `Replace the background of ${req.file.originalname} with: ${prompt.trim()}`;
    const creation = await saveCreation({
      userId,
      prompt: fullPrompt,
      content,
      type: "image",
    });
    const usage = await chargeUsage(req);

    res.status(200).json({
      content,
      creation,
      usage: { plan: req.plan, free_usage: usage },
    });
  } catch (error) {
    console.error("Replace background error:", error);
    sendImageProviderError(res, error, "Failed to replace background.");
  }
};

export const removeObject = async (req, res) => {
  try {
    if (!enforceUsageLimit(req, res)) return;

    const userId = req.userId;
    const imageFile =
      req.file || req.files?.image?.[0] || req.files?.image_file?.[0];
    const maskFile = req.files?.mask?.[0] || req.files?.mask_file?.[0];

    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required." });
    }

    if (!maskFile) {
      return res.status(400).json({
        error:
          "Clipdrop cleanup requires a mask image named mask or mask_file.",
      });
    }

    const { object = "selected object" } = req.body;
    const imageBuffer = await cleanupWithClipdrop({ imageFile, maskFile });
    const content = await uploadBase64Image(imageBuffer, "lexora/creations");
    const prompt = `Remove ${object} from ${imageFile.originalname}`;
    const creation = await saveCreation({
      userId,
      prompt,
      content,
      type: "image",
    });
    const usage = await chargeUsage(req);

    res.status(200).json({
      content,
      creation,
      usage: { plan: req.plan, free_usage: usage },
    });
  } catch (error) {
    console.error("Remove object error:", error);
    sendImageProviderError(res, error, "Failed to remove object.");
  }
};

export const reviewResume = async (req, res) => {
  try {
    if (!enforceUsageLimit(req, res)) return;
    if (!req.file)
      return res.status(400).json({ error: "Resume file is required." });

    const userId = req.userId;
    const {
      targetRole = "the target role",
      reviewFocus = "Overall readiness",
    } = req.body;
    const fileName = req.file.originalname.toLowerCase();
    let resumeText = "";

    if (fileName.endsWith(".pdf")) {
      const parser = new PDFParse({ data: req.file.buffer });
      const parsed = await parser.getText();
      await parser.destroy();
      resumeText = parsed.text;
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      const parsed = await mammoth.extractRawText({ buffer: req.file.buffer });
      resumeText = parsed.value;
    } else {
      return res
        .status(400)
        .json({ error: "Please upload a PDF, DOC, or DOCX resume." });
    }

    if (!resumeText.trim()) {
      return res
        .status(400)
        .json({ error: "Could not read text from this resume." });
    }

    const fullPrompt = `Review this resume for ${targetRole}. Focus on ${reviewFocus}. Return a score out of 100, a short summary, strengths, and practical fixes.\n\n${resumeText.slice(0, 12000)}`;
    const content = await getCompletionContent({
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume reviewer. Be direct, practical, and specific. Use markdown headings and bullet points.",
        },
        { role: "user", content: fullPrompt },
      ],
      max_tokens: 2200,
      temperature: 0.4,
    });

    if (!content) {
      return res
        .status(502)
        .json({ error: "AI provider returned an empty response." });
    }

    const creation = await saveCreation({
      userId,
      prompt: `Review resume ${req.file.originalname} for ${targetRole}. Focus: ${reviewFocus}.`,
      content,
      type: "resume-review",
    });
    const usage = await chargeUsage(req);

    res.status(200).json({
      content,
      creation,
      usage: { plan: req.plan, free_usage: usage },
    });
  } catch (error) {
    console.error("Review resume error:", error);
    res.status(500).json({ error: "Failed to review resume." });
  }
};

export const getUserCreations = async (req, res) => {
  try {
    const rows = await sql`
      SELECT * FROM creations
      WHERE user_id = ${req.userId}
      ORDER BY created_at DESC
    `;

    res.status(200).json({ creations: rows });
  } catch (error) {
    console.error("Get user creations error:", error);
    res.status(500).json({ error: "Failed to load creations." });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const rows = await sql`
      SELECT * FROM creations
      WHERE publish = TRUE
      ORDER BY created_at DESC
      LIMIT 100
    `;

    res.status(200).json({ creations: rows });
  } catch (error) {
    console.error("Get published creations error:", error);
    res.status(500).json({ error: "Failed to load published creations." });
  }
};

export const toggleLikeCreation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const existing = await sql`
      SELECT likes FROM creations
      WHERE id = ${id} AND publish = TRUE
      LIMIT 1
    `;

    if (!existing.length) {
      return res.status(404).json({ error: "Published creation not found." });
    }

    const hasLiked = existing[0].likes.includes(userId);
    const rows = hasLiked
      ? await sql`
          UPDATE creations
          SET likes = array_remove(likes, ${userId}), updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `
      : await sql`
          UPDATE creations
          SET likes = array_append(likes, ${userId}), updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;

    res.status(200).json({ creation: rows[0], liked: !hasLiked });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ error: "Failed to update like." });
  }
};
