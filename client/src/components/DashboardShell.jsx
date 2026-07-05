import { ArrowRight, Sparkles } from "lucide-react";

export const PageHeader = ({
  title,
  description,
  eyebrow = "Lexora workspace",
  action,
}) => (
  <section className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
    {action && (
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary"
      >
        {action}
        <ArrowRight className="h-4 w-4" />
      </button>
    )}
  </section>
);

export const ToolCard = ({ title, description, icon: Icon, children }) => (
  <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
    {children}
  </section>
);

export const ResultPanel = ({
  title = "Generated output",
  description,
  emptyTitle,
  emptyDescription,
  icon: Icon,
  children,
}) => (
  <section className="flex min-h-[520px] min-w-0 flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        )}
      </div>
    </div>
    <div className="flex min-w-0 flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 sm:p-6">
      {children || (
        <div className="max-w-sm text-center">
          {Icon && (
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
              <Icon className="h-6 w-6" />
            </div>
          )}
          <h3 className="text-base font-semibold text-slate-950">
            {emptyTitle}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {emptyDescription}
          </p>
        </div>
      )}
    </div>
  </section>
);

export const FieldLabel = ({ children }) => (
  <label className="mb-2 block text-sm font-semibold text-slate-800">
    {children}
  </label>
);

export const PrimaryButton = ({
  children,
  icon: Icon,
  onClick,
  disabled = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </button>
);
