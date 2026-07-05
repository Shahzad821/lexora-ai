import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();
await connectCloudinary();
const requiredEnv = [
  "CLERK_SECRET_KEY",
  "LEXORA_API_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (!process.env.DATABASE_URL && !process.env.DB_URL) {
  missingEnv.push("DATABASE_URL or DB_URL");
}

if (missingEnv.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnv.join(", ")}`,
  );
}

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(clerkMiddleware());

const PORT = process.env.PORT || 3000;
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/ai", aiRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error("Unhandled API error:", error);
  res.status(error.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : error.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
