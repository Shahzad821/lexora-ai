import { useState } from "react";
import { useAuth } from "@clerk/react";
import { CheckCircle2, FileCheck2, FileText, UploadCloud } from "lucide-react";
import Markdown from "react-markdown";
import {
  FieldLabel,
  PageHeader,
  PrimaryButton,
  ResultPanel,
  ToolCard,
} from "../components/DashboardShell";
import { apiRequest } from "../lib/api";

const reviewFocusOptions = [
  "Overall readiness",
  "ATS keywords",
  "Impact bullets",
  "Formatting and clarity",
];

const ReviewResume = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [reviewFocus, setReviewFocus] = useState("Overall readiness");
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const { getToken, isSignedIn } = useAuth();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);
    setFileName(file.name);
    setReview("");
  };

  const handleTargetRoleChange = (event) => {
    setTargetRole(event.target.value);
  };

  const handleReviewFocusChange = (event) => {
    setReviewFocus(event.target.value);
  };

  const handleReview = async () => {
    if (!file || !targetRole.trim()) return;

    if (!isSignedIn) {
      setError("Please sign in to review a resume.");
      return;
    }

    setError("");
    setIsReviewing(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("targetRole", targetRole.trim());
      formData.append("reviewFocus", reviewFocus);
      const token = await getToken();
      const data = await apiRequest("/api/ai/review-resume", {
        method: "POST",
        token,
        body: formData,
      });

      setReview(data.content);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career tools"
        title="Resume Reviewer"
        description="Get structured feedback on impact, clarity, keywords, and formatting."
        action="Review history"
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ToolCard
          title="Resume details"
          description="Upload your resume and add the role you are targeting."
          icon={FileText}
        >
          <div className="space-y-5">
            <div>
              <FieldLabel>Resume file</FieldLabel>
              <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-primary hover:bg-primary/5">
                <UploadCloud className="h-9 w-9 text-primary" />
                <span className="mt-3 text-sm font-semibold text-slate-950">
                  {fileName || "Upload PDF or DOCX"}
                </span>
                <span className="mt-2 text-xs text-slate-500">
                  Keep it under 5MB for faster review
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <FieldLabel>Target role</FieldLabel>
              <input
                type="text"
                value={targetRole}
                onChange={handleTargetRoleChange}
                placeholder="Example: Frontend Engineer"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div>
              <FieldLabel>Review focus</FieldLabel>
              <select
                value={reviewFocus}
                onChange={handleReviewFocusChange}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              >
                {reviewFocusOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
            Selected focus: {reviewFocus}
          </div>

          <PrimaryButton
            icon={FileCheck2}
            onClick={handleReview}
            disabled={!fileName || !targetRole.trim() || isReviewing}
          >
            {isReviewing ? "Reviewing..." : "Review resume"}
          </PrimaryButton>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}
        </ToolCard>

        <ResultPanel
          icon={FileCheck2}
          emptyTitle="Resume score and notes"
          emptyDescription="Lexora will summarize strengths, missing keywords, and practical edits in this panel."
        >
          {review && (
            <div className="w-full min-w-0">
              <div className="min-w-0 rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Resume review
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">
                      {fileName}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="markdown-content mt-5 text-sm leading-7 text-slate-700">
                  <Markdown>{review}</Markdown>
                </div>
              </div>
            </div>
          )}
        </ResultPanel>
      </div>
    </div>
  );
};

export default ReviewResume;
