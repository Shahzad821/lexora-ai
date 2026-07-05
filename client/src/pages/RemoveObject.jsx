import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { Brush, Download, Scissors, UploadCloud } from "lucide-react";
import {
  FieldLabel,
  PageHeader,
  PrimaryButton,
  ResultPanel,
  ToolCard,
} from "../components/DashboardShell";
import { apiRequest } from "../lib/api";

const brushSizes = ["Small", "Medium", "Large"];

const RemoveObject = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [objectPrompt, setObjectPrompt] = useState("");
  const [brushSize, setBrushSize] = useState("Medium");
  const [processedUrl, setProcessedUrl] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { getToken, isSignedIn } = useAuth();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setProcessedUrl("");
  };

  const handleObjectPromptChange = (event) => {
    setObjectPrompt(event.target.value);
  };

  const handleBrushSizeChange = (selectedBrushSize) => {
    setBrushSize(selectedBrushSize);
  };

  const handleRemoveObject = async () => {
    if (!file || !objectPrompt.trim()) return;

    if (!isSignedIn) {
      setError("Please sign in to remove an object.");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("object", objectPrompt.trim());
      const token = await getToken();
      const data = await apiRequest("/api/ai/remove-object", {
        method: "POST",
        token,
        body: formData,
      });

      setProcessedUrl(data.content);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Image cleanup"
        title="Object Removal"
        description="Upload an image, mark the unwanted area, and let Lexora rebuild the background."
        action="Recent edits"
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ToolCard
          title="Edit setup"
          description="Select a source image and choose the brush size for object masking."
          icon={Scissors}
        >
          <div className="space-y-5">
            <div>
              <FieldLabel>Source file</FieldLabel>
              <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-primary hover:bg-primary/5">
                {preview ? (
                  <img
                    src={preview}
                    alt={fileName}
                    className="max-h-36 rounded-xl object-contain shadow-sm"
                  />
                ) : (
                  <UploadCloud className="h-9 w-9 text-primary" />
                )}
                <span className="mt-3 text-sm font-semibold text-slate-950">
                  {fileName || "Upload image"}
                </span>
                <span className="mt-2 text-xs text-slate-500">
                  PNG, JPG, or WEBP
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <FieldLabel>Object to remove</FieldLabel>
              <input
                type="text"
                value={objectPrompt}
                onChange={handleObjectPromptChange}
                placeholder="Example: background car, sign, person in red shirt"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div>
              <FieldLabel>Brush size</FieldLabel>
              <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1">
                {brushSizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => handleBrushSizeChange(size)}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      brushSize === size
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-500 hover:text-slate-950"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
            Selected brush: {brushSize}
          </div>

          <PrimaryButton
            icon={Brush}
            onClick={handleRemoveObject}
            disabled={!preview || !objectPrompt.trim() || isProcessing}
          >
            {isProcessing ? "Processing..." : "Remove selected object"}
          </PrimaryButton>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}
        </ToolCard>

        <ResultPanel
          icon={Scissors}
          emptyTitle="Edited image preview"
          emptyDescription="Your cleaned image will appear here after the masked object is removed."
        >
          {processedUrl && (
            <div className="w-full min-w-0">
              <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={processedUrl}
                  alt={fileName}
                  className="max-h-96 w-full object-contain"
                />
                <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                  {brushSize} brush processed
                </div>
              </div>
              <a
                href={processedUrl}
                download={`lexora-object-removed-${fileName}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-primary/30 hover:text-primary"
              >
                <Download className="h-4 w-4" />
                Download edit
              </a>
            </div>
          )}
        </ResultPanel>
      </div>
    </div>
  );
};

export default RemoveObject;
