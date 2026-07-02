import { PricingTable } from "@clerk/react";
import { BadgeCheck, CreditCard, ShieldCheck } from "lucide-react";

const planHighlights = [
  {
    icon: BadgeCheck,
    text: "Upgrade or downgrade anytime",
  },
  {
    icon: CreditCard,
    text: "Secure checkout with Clerk Billing",
  },
  {
    icon: ShieldCheck,
    text: "Plans managed from your account",
  },
];

const Plan = () => {
  return (
    <section
      id="pricing"
      className="bg-[#fbfcff] px-4 py-20 sm:px-10 lg:px-20 xl:px-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-5xl">
            Choose the plan that fits your workflow
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Start simple, then scale your AI content studio as your ideas,
            projects, and team grow.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-3">
          {planHighlights.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
            >
              <Icon className="h-4 w-4 text-primary" />
              {text}
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
          <PricingTable
            ctaPosition="bottom"
            newSubscriptionRedirectUrl="/ai"
            appearance={{
              elements: {
                pricingTable: "gap-5",
                pricingTableCard:
                  "rounded-2xl border-slate-100 shadow-sm hover:shadow-lg transition",
                pricingTableCardButton:
                  "rounded-full bg-primary text-white hover:bg-[#4338ca]",
              },
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Plan;
