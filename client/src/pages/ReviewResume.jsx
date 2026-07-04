import { useState } from "react";
import { CheckCircle2, FileCheck2, FileText, UploadCloud } from "lucide-react";
import {
  FieldLabel,
  PageHeader,
  PrimaryButton,
  ResultPanel,
  ToolCard,
} from "../components/DashboardShell";

const reviewFocusOptions = [
  "Overall readiness",
  "ATS keywords",
  "Impact bullets",
  "Formatting and clarity",
];

const ReviewResume = () => {
  const [fileName, setFileName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [reviewFocus, setReviewFocus] = useState("Overall readiness");
  const [review, setReview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setReview(null);
  };

  const handleTargetRoleChange = (event) => {
    setTargetRole(event.target.value);
  };

  const handleReviewFocusChange = (event) => {
    setReviewFocus(event.target.value);
  };

  const handleReview = () => {
    if (!fileName || !targetRole.trim()) return;

    setReview({
      score: 82,
      summary: `${fileName} is a solid fit for ${targetRole.trim()}, with the biggest opportunity around ${reviewFocus.toLowerCase()}.`,
      wins: [
        "Strong technical positioning in the opening section.",
        "Clear project ownership and measurable delivery language.",
        "Good foundation for ATS matching once role keywords are added.",
      ],
      fixes: [
        "Add more outcome metrics to the top three bullets.",
        "Move the most relevant skills closer to the target role summary.",
        "Trim repeated responsibilities and keep each bullet action-led.",
      ],
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career tools"
        title="Resume Reviewer"
        description="Get structured feedback on impact, clarity, keywords, and formatting."
        action="Review history"
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
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
            disabled={!fileName || !targetRole.trim()}
          >
            Review resume
          </PrimaryButton>
        </ToolCard>

        <ResultPanel
          icon={FileCheck2}
          emptyTitle="Resume score and notes"
          emptyDescription="Lexora will summarize strengths, missing keywords, and practical edits in this panel."
        >
          {review && (
            <div className="w-full space-y-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Resume score
                    </p>
                    <p className="mt-1 text-4xl font-semibold text-slate-950">
                      {review.score}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {review.summary}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-emerald-600">
                    Working well
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {review.wins.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-rose-600">
                    Improve next
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {review.fixes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
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
