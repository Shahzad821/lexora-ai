import { assets, dummyTestimonialData } from "../assets/assets";

const Testimonials = () => {
  return (
    <section id="testimonials" className="px-4 py-20 sm:px-10 lg:px-20 xl:px-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-5xl">
            Loved by creators and teams
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            See how people use Lexora AI to move from blank page to finished
            work without slowing down.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {dummyTestimonialData.map((testimonial) => (
            <article
              key={`${testimonial.name}-${testimonial.title}`}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={
                      star <= testimonial.rating
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    alt=""
                    className="h-4 w-4"
                  />
                ))}
              </div>

              <p className="mt-5 min-h-32 text-sm leading-7 text-slate-600">
                "{testimonial.content}"
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-slate-950">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-slate-500">{testimonial.title}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
