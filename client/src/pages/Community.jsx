import { useMemo, useState } from "react";
import { Heart, Image, MessageCircle, Search, Users } from "lucide-react";
import { dummyPublishedCreationData } from "../assets/assets";
import { PageHeader } from "../components/DashboardShell";

const Community = () => {
  const [query, setQuery] = useState("");
  const [likedIds, setLikedIds] = useState([]);

  const filteredCreations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return dummyPublishedCreationData;

    return dummyPublishedCreationData.filter((creation) =>
      creation.prompt.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const totalLikes =
    dummyPublishedCreationData.reduce(
      (sum, creation) => sum + creation.likes.length,
      0,
    ) + likedIds.length;

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleLikeToggle = (id) => {
    setLikedIds((current) =>
      current.includes(id)
        ? current.filter((likedId) => likedId !== id)
        : [...current, id],
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Community"
        title="Published Creations"
        description="Explore images shared by Lexora creators and keep track of what is resonating."
        action="Publish new"
      />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Image className="h-5 w-5" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-950">
            {dummyPublishedCreationData.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">Published visuals</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <Heart className="h-5 w-5" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-950">
            {totalLikes}
          </p>
          <p className="mt-1 text-sm text-slate-500">Community likes</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-950">2</p>
          <p className="mt-1 text-sm text-slate-500">Active creators</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Community feed
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Browse recent public AI image generations.
            </p>
          </div>
          <label className="relative block w-full lg:max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search creations"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </label>
        </div>

        {filteredCreations.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCreations.map((creation) => {
              const liked = likedIds.includes(creation.id);
              const likeCount = creation.likes.length + (liked ? 1 : 0);

              return (
                <article
                  key={creation.id}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80"
                >
                  <img
                    src={creation.content}
                    alt={creation.prompt}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="line-clamp-3 min-h-18 text-sm leading-6 text-slate-600">
                      {creation.prompt}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <button
                          type="button"
                          onClick={() => handleLikeToggle(creation.id)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition ${
                            liked
                              ? "bg-rose-50 text-rose-600"
                              : "hover:bg-slate-50 hover:text-rose-500"
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              liked
                                ? "fill-rose-500 text-rose-500"
                                : "text-rose-500"
                            }`}
                          />
                          {likeCount}
                        </button>
                        <span className="inline-flex items-center gap-1.5">
                          <MessageCircle className="h-4 w-4 text-slate-400" />
                          0
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                        Published
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-sm font-semibold text-slate-950">
              No creations found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Community;
