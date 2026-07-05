import { useState } from "react";
import { useAuth } from "@clerk/react";
import { CheckCircle2, FileText, PenLine, Send } from "lucide-react";
import Markdown from "react-markdown";
import {
  FieldLabel,
  PageHeader,
  PrimaryButton,
  ResultPanel,
  ToolCard,
} from "../components/DashboardShell";
import { apiRequest } from "../lib/api";

const articleLengths = ["Short", "Medium", "Long"];

const WriteArticle = () => {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("Medium");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("");
  const [article, setArticle] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { getToken, isSignedIn } = useAuth();

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleLengthChange = (selectedLength) => {
    setLength(selectedLength);
  };

  const handleToneChange = (event) => {
    setTone(event.target.value);
  };

  const handleAudienceChange = (event) => {
    setAudience(event.target.value);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    if (!isSignedIn) {
      setError("Please sign in to generate an article.");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const token = await getToken();
      const data = await apiRequest("/api/ai/generate-article", {
        method: "POST",
        token,
        body: {
          prompt: topic.trim(),
          length,
          tone,
          audience: audience.trim(),
        },
      });

      setArticle(data.content);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Writing suite"
        title="AI Article Writer"
        description="Turn a topic into a structured draft with tone, length, and audience controls."
        action="View drafts"
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ToolCard
          title="Article brief"
          description="Give Lexora enough context to create a useful first draft."
          icon={PenLine}
        >
          <div className="space-y-5">
            <div>
              <FieldLabel>Topic</FieldLabel>
              <textarea
                rows={5}
                value={topic}
                onChange={handleTopicChange}
                placeholder="Example: How AI coding assistants help small product teams ship faster"
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
              {!topic.trim() && (
                <p className="mt-2 text-xs text-slate-400">
                  Add a topic to enable generation.
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Length</FieldLabel>
                <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1">
                  {articleLengths.map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => handleLengthChange(option)}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        length === option
                          ? "bg-white text-primary shadow-sm"
                          : "text-slate-500 hover:text-slate-950"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>Tone</FieldLabel>
                <select
                  value={tone}
                  onChange={handleToneChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Editorial</option>
                  <option>Technical</option>
                </select>
              </div>
            </div>

            <div>
              <FieldLabel>Audience</FieldLabel>
              <input
                type="text"
                value={audience}
                onChange={handleAudienceChange}
                placeholder="Startup founders, marketers, developers..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
            Selected: {length} article / {tone} tone
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}

          <PrimaryButton
            icon={Send}
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate article"}
          </PrimaryButton>
        </ToolCard>

        <ResultPanel
          icon={FileText}
          emptyTitle="Your article will appear here"
          emptyDescription="Generated drafts keep headings, paragraphs, and suggested edits in one clean reading panel."
        >
          {article && (
            <div className="h-full w-full min-w-0 overflow-auto rounded-xl bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Draft generated
              </div>
              <div className="markdown-content">
                <Markdown>{article}</Markdown>
              </div>
            </div>
          )}
        </ResultPanel>
      </div>
    </div>
  );
};

export default WriteArticle;
