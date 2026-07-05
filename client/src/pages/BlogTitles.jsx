import { useState } from "react";
import { useAuth } from "@clerk/react";
import { Copy, Hash, ListChecks, Send } from "lucide-react";
import {
  FieldLabel,
  PageHeader,
  PrimaryButton,
  ResultPanel,
  ToolCard,
} from "../components/DashboardShell";
import { apiRequest } from "../lib/api";

const categories = ["General", "Technology", "Business", "Lifestyle"];
const angles = [
  "Practical guide",
  "Contrarian take",
  "Beginner friendly",
  "Data-backed insight",
];

const BlogTitles = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Technology");
  const [angle, setAngle] = useState("Practical guide");
  const [titles, setTitles] = useState([]);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { getToken, isSignedIn } = useAuth();

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  const handleAngleChange = (event) => {
    setAngle(event.target.value);
  };

  const handleGenerate = async () => {
    if (!keyword.trim()) return;

    if (!isSignedIn) {
      setError("Please sign in to generate blog titles.");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const token = await getToken();
      const data = await apiRequest("/api/ai/generate-blog-titles", {
        method: "POST",
        token,
        body: {
          keyword: keyword.trim(),
          category,
          angle,
        },
      });

      setTitles(data.titles || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content ideation"
        title="Blog Title Generator"
        description="Explore polished title directions before you commit to a full article."
        action="Saved ideas"
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ToolCard
          title="Title inputs"
          description="Pick a keyword, category, and angle for sharper headline options."
          icon={Hash}
        >
          <div className="space-y-5">
            <div>
              <FieldLabel>Keyword</FieldLabel>
              <input
                type="text"
                value={keyword}
                onChange={handleKeywordChange}
                placeholder="Example: customer onboarding"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div>
              <FieldLabel>Category</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleCategoryChange(option)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      category === option
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/30 hover:text-slate-950"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>Preferred angle</FieldLabel>
              <select
                value={angle}
                onChange={handleAngleChange}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              >
                {angles.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
            Selected: {category} / {angle}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}

          <PrimaryButton
            icon={Send}
            onClick={handleGenerate}
            disabled={!keyword.trim() || isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate titles"}
          </PrimaryButton>
        </ToolCard>

        <ResultPanel
          icon={ListChecks}
          emptyTitle="Title ideas will appear here"
          emptyDescription="Lexora will return scannable headline options with different angles and strengths."
        >
          {titles.length > 0 && (
            <div className="w-full min-w-0 space-y-3">
              {titles.map((title, index) => (
                <article
                  key={title}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-primary">
                      Option {index + 1}
                    </p>
                    <h3 className="mt-1 break-words text-sm font-semibold leading-6 text-slate-800">
                      {title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(title)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-100 text-slate-500 transition hover:border-primary/30 hover:text-primary"
                    aria-label="Copy title"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
          )}
        </ResultPanel>
      </div>
    </div>
  );
};

export default BlogTitles;
