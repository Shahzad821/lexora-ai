import {
  ArrowRight,
  Clock3,
  FileText,
  Image,
  Layers3,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  AiToolsData,
  dummyCreationData,
  dummyPublishedCreationData,
} from "../assets/assets";
import Markdown from "react-markdown";
const Dashboard = () => {
  const navigate = useNavigate();

  const totalCreations =
    dummyCreationData.length + dummyPublishedCreationData.length;
  const publishedCount = dummyPublishedCreationData.length;
  const articleCount = dummyCreationData.filter(
    (creation) => creation.type === "article",
  ).length;
  const imageCount = dummyPublishedCreationData.filter(
    (creation) => creation.type === "image",
  ).length;

  const stats = [
    {
      label: "Total creations",
      value: totalCreations,
      Icon: Layers3,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Articles drafted",
      value: articleCount,
      Icon: FileText,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      label: "Images published",
      value: imageCount,
      Icon: Image,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Public posts",
      value: publishedCount,
      Icon: TrendingUp,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  const recentCreations = [...dummyPublishedCreationData, ...dummyCreationData]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);

  const [expandedIds, setExpandedIds] = useState([]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-200/70 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-indigo-100">
              <Sparkles className="h-4 w-4" />
              Welcome back to Lexora AI
            </div>
            <h1 className="text-3xl font-semibold sm:text-5xl">
              Your creative workspace is ready.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Draft content, generate visuals, clean images, and review resumes
              from one focused dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/ai/write-article")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-50"
              >
                Create article
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/ai/generate-images")}
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Generate image
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/8 p-5">
            <p className="text-sm font-medium text-white/60">This week</p>
            <p className="mt-2 text-4xl font-semibold">24</p>
            <p className="mt-1 text-sm text-emerald-200">+32% faster output</p>
            <div className="mt-6 flex h-24 items-end gap-2">
              {[35, 52, 44, 68, 58, 82, 96].map((height) => (
                <div
                  key={height}
                  className="flex-1 rounded-t-xl bg-white/75"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, Icon, color, bg }) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}
              >
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                Live
              </span>
            </div>
            <p className="mt-5 text-3xl font-semibold text-slate-950">
              {value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Quick tools
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Jump into your most useful AI workflows.
              </p>
            </div>
            <Clock3 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {AiToolsData.slice(0, 6).map(({ title, path, Icon, bg }) => (
              <button
                key={title}
                onClick={() => navigate(path)}
                className="group flex items-center gap-3 rounded-xl border border-slate-100 p-4 text-left transition hover:border-primary/20 hover:bg-primary/5"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{
                    background: `linear-gradient(135deg, ${bg.from}, ${bg.to})`,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Recent creations
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest drafts and published work.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {recentCreations.map((creation) => (
              <article
                key={creation.id}
                className="rounded-xl border border-slate-100 p-4 transition hover:border-primary/15 hover:bg-primary/3"
              >
                <div className="flex gap-4">
                  {creation.type === "image" ? (
                    <img
                      src={creation.content}
                      alt={creation.prompt}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize text-slate-600">
                        {creation.type}
                      </span>
                      {creation.publish && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                          Published
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleExpand(creation.id)}
                      className="line-clamp-2 w-full text-left text-sm leading-6 text-slate-600"
                      aria-expanded={expandedIds.includes(creation.id)}
                    >
                      {creation.prompt}
                    </button>
                  </div>
                </div>

                {expandedIds.includes(creation.id) && (
                  <div className="mt-3 border-t pt-3 text-sm text-slate-600">
                    {creation.type === "image" ? (
                      <img
                        src={creation.content}
                        alt={creation.prompt}
                        className="rounded-md object-cover h-40 w-full"
                      />
                    ) : (
                      <div className="reset-tw prose">
                        <Markdown>{creation.content}</Markdown>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-slate-400">
                      Created: {new Date(creation.created_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
