import { useState } from "react";
import { useAuth } from "@clerk/react";
import { Download, Palette, Send } from "lucide-react";
import {
  FieldLabel,
  PageHeader,
  PrimaryButton,
  ResultPanel,
  ToolCard,
} from "../components/DashboardShell";
import { dummyPublishedCreationData } from "../assets/assets";
import { apiRequest } from "../lib/api";

const styles = ["Realistic", "Anime", "3D", "Watercolor"];

const GenerateImages = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Realistic");
  const [publish, setPublish] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { getToken, isSignedIn } = useAuth();

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleStyleChange = (selectedStyle) => {
    setStyle(selectedStyle);
  };

  const handlePublishChange = (event) => {
    setPublish(event.target.checked);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!isSignedIn) {
      setError("Please sign in to generate an image.");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const token = await getToken();
      const data = await apiRequest("/api/ai/generate-image", {
        method: "POST",
        token,
        body: {
          prompt: prompt.trim(),
          style,
          publish,
        },
      });

      setGeneratedImage(data.creation || {
        content: data.content,
        prompt: `${prompt.trim()} in ${style} style`,
        publish,
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Visual studio"
        title="AI Image Generation"
        description="Describe the scene, choose a style, and create publish-ready visuals."
        action="Gallery"
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ToolCard
          title="Image prompt"
          description="Use concrete subjects, mood, environment, and style details."
          icon={Palette}
        >
          <div className="space-y-5">
            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                rows={6}
                value={prompt}
                onChange={handlePromptChange}
                placeholder="Example: A quiet futuristic library at sunrise, warm window light, cinematic detail"
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div>
              <FieldLabel>Style</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {styles.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleStyleChange(option)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      style === option
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/30 hover:text-slate-950"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Publish to community
              <input
                type="checkbox"
                checked={publish}
                onChange={handlePublishChange}
                className="h-4 w-4 accent-primary"
              />
            </label>
          </div>

          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
            Selected: {style} / {publish ? "Public" : "Private"}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}

          <PrimaryButton
            icon={Send}
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate image"}
          </PrimaryButton>
        </ToolCard>

        <ResultPanel
          title="Preview"
          description={
            generatedImage
              ? "Your generated image preview is ready."
              : "Recent community images are shown until you generate a new visual."
          }
        >
          {generatedImage ? (
            <div className="w-full min-w-0">
              <img
                src={generatedImage.content}
                alt={generatedImage.prompt}
                className="aspect-[4/3] w-full rounded-xl object-cover shadow-sm"
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-slate-950">
                    {generatedImage.prompt}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {publish ? "Marked for community" : "Private draft"}
                  </p>
                </div>
                <a
                  href={generatedImage.content}
                  download={`lexora-${style.toLowerCase()}-image.png`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary/30 hover:text-primary"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          ) : (
            <div className="grid w-full gap-3 sm:grid-cols-3">
              {dummyPublishedCreationData.map((image) => (
                <img
                  key={image.id}
                  src={image.content}
                  alt={image.prompt}
                  className="aspect-square w-full rounded-xl object-cover shadow-sm"
                />
              ))}
            </div>
          )}
        </ResultPanel>
      </div>
    </div>
  );
};

export default GenerateImages;
