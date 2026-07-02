import { ArrowRight, CheckCircle2, Sparkles, WandSparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/react";
import { assets } from "../assets/assets";

const Hero = () => {
  const navigate = useNavigate();
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const handleStart = () => {
    if (user) {
      navigate("/ai");
      return;
    }

    openSignIn();
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7f8ff] px-4 pt-28 pb-14 sm:px-10 lg:px-20 xl:px-32">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      {/* <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-white/90 to-transparent" /> */}

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/75 px-4 py-2 text-sm font-medium text-primary shadow-sm shadow-primary/10 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            AI content studio for faster creation
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            Create polished content with{" "}
            <span className="text-primary">Lexora AI</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Write articles, generate blog ideas, create images, clean visuals,
            and review resumes from one calm workspace built for momentum.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:bg-[#4338ca]"
            >
              Start creating
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate("/ai")}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-7 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary"
            >
              Explore tools
            </button>
          </div>

          <div className="mt-9 flex flex-col gap-4 text-sm text-slate-600 sm:flex-row sm:items-center">
            <div className="flex -space-x-3">
              <img
                src={assets.user_group}
                alt="Creators using Lexora AI"
                className="h-11 w-auto"
              />
            </div>
            <div>
              <div className="mb-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={assets.star_icon}
                    alt=""
                    className="h-4 w-4"
                  />
                ))}
              </div>
              Trusted by creators for fast, high-quality AI output.
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-4 rounded-4xl bg-primary/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:p-5">
            <div className="rounded-2xl bg-slate-950 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Today&apos;s studio</p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Launch campaign draft
                  </h2>
                </div>
                <div className="rounded-full bg-white/10 p-3">
                  <WandSparkles className="h-5 w-5 text-indigo-200" />
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white/8 p-4">
                <div className="mb-3 h-2 w-24 rounded-full bg-indigo-300" />
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-white/70" />
                  <div className="h-2 w-5/6 rounded-full bg-white/50" />
                  <div className="h-2 w-3/4 rounded-full bg-white/30" />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                "Article ready",
                "Image generated",
                "Resume improved",
                "Background removed",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Productivity boost
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-slate-950">
                    8.4x
                  </p>
                </div>
                <div className="flex h-20 items-end gap-2">
                  {[34, 52, 45, 70, 86].map((height, index) => (
                    <div
                      key={height}
                      className="w-8 rounded-t-xl bg-primary/80"
                      style={{
                        height: `${height}%`,
                        opacity: 0.55 + index * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
