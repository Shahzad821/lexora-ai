import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AiToolsData } from "../assets/assets";
import { useUser } from "@clerk/react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  return (
    <section className="bg-white px-4 py-20 sm:px-10 lg:px-20 xl:px-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Powerful AI tools
          </div>

          <h2 className="text-3xl font-semibold text-slate-950 sm:text-5xl">
            Everything you need to create faster
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Choose a tool, add your idea, and let Lexora AI help you turn it
            into polished content, visuals, and career-ready documents.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AiToolsData.map(({ title, description, Icon, bg, path }) => (
            <button
              key={title}
              onClick={() => user && navigate(path)}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/80"
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{
                  background: `linear-gradient(90deg, ${bg.from}, ${bg.to})`,
                }}
              />

              <div className="flex items-start justify-between gap-4">
                <div
                  className="flex h-13 w-13 items-center justify-center rounded-2xl text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${bg.from}, ${bg.to})`,
                  }}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 text-slate-400 transition group-hover:border-primary/20 group-hover:text-primary">
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-950">
                {title}
              </h3>
              <p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">
                {description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                Open tool
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AiTools;
