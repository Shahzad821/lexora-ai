import { Heart, ImageIcon, Sparkles } from "lucide-react";
import { dummyPublishedCreationData } from "../assets/assets";

const DummyImages = () => {
  return (
    <section id="creations" className="px-4 py-20 sm:px-10 lg:px-20 xl:px-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <ImageIcon className="h-4 w-4" />
              AI image examples
            </div>
            <h2 className="text-3xl font-semibold text-slate-950 sm:text-5xl">
              Explore dummy creations
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              A quick preview of generated visuals from the community feed,
              styled as a clean gallery for your landing page.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-[#fbfcff] p-5">
            <p className="text-sm font-medium text-slate-500">
              Published samples
            </p>
            <p className="mt-1 text-3xl font-semibold text-slate-950">
              {dummyPublishedCreationData.length}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {dummyPublishedCreationData.map((creation) => (
            <article
              key={creation.id}
              className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80"
            >
              <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
                <img
                  src={creation.content}
                  alt={creation.prompt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  {creation.type}
                </div>
              </div>

              <div className="p-5">
                <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
                  {creation.prompt}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    Published
                  </span>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Heart className="h-4 w-4 text-rose-500" />
                    {creation.likes.length}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DummyImages;
