import { useEffect, useState } from "react";
import { Download, Eraser, ImageUp, UploadCloud } from "lucide-react";
import {
  FieldLabel,
  PageHeader,
  PrimaryButton,
  ResultPanel,
  ToolCard,
} from "../components/DashboardShell";

const RemoveBackground = () => {
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [processed, setProcessed] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setProcessed(false);
  };

  const handleRemoveBackground = () => {
    setProcessed(true);
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
        title="Background Removal"
        description="Upload a product shot, portrait, or creative image and isolate the subject."
        action="Batch history"
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ToolCard
          title="Upload image"
          description="Best results come from clear subject edges and high-resolution source files."
          icon={ImageUp}
        >
          <FieldLabel>Source file</FieldLabel>
          <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-primary hover:bg-primary/5">
            {preview ? (
              <img
                src={preview}
                alt={fileName}
                className="max-h-44 rounded-xl object-contain shadow-sm"
              />
            ) : (
              <UploadCloud className="h-10 w-10 text-primary" />
            )}
            <span className="mt-4 text-sm font-semibold text-slate-950">
              {fileName || "Drop image here or browse"}
            </span>
            <span className="mt-2 text-xs leading-5 text-slate-500">
              PNG, JPG, or WEBP up to 10MB
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <PrimaryButton
            icon={Eraser}
            onClick={handleRemoveBackground}
            disabled={!preview}
          >
            Remove background
          </PrimaryButton>
        </ToolCard>

        <ResultPanel
          icon={Eraser}
          emptyTitle="Clean image preview"
          emptyDescription="The transparent-background result will be ready here with download and publish actions."
        >
          {processed && preview && (
            <div className="w-full">
              <div className="rounded-2xl bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%,transparent_75%,#e2e8f0_75%),linear-gradient(45deg,#e2e8f0_25%,transparent_25%,transparent_75%,#e2e8f0_75%)] bg-[length:24px_24px] bg-[position:0_0,12px_12px] p-4">
                <img
                  src={preview}
                  alt={fileName}
                  className="mx-auto max-h-96 rounded-xl object-contain"
                />
              </div>
              <a
                href={preview}
                download={`lexora-bg-removed-${fileName}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-primary/30 hover:text-primary"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </a>
            </div>
          )}
        </ResultPanel>
      </div>
    </div>
  );
};

export default RemoveBackground;
