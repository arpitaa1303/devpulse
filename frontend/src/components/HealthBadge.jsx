export default function HealthBadge({ score }) {
  const isHealthy = score >= 70;
  const isModerate = score >= 40;

  const palette = isHealthy
    ? {
        wrap: "border-emerald-200 bg-[var(--success-bg)]",
        score: "bg-emerald-100 text-[var(--success-text)]",
        dot: "bg-emerald-400",
        label: "text-[var(--success-text)]",
        text: "Healthy",
      }
    : isModerate
      ? {
          wrap: "border-amber-200 bg-[var(--warning-bg)]",
          score: "bg-amber-100 text-[var(--warning-text)]",
          dot: "bg-amber-400",
          label: "text-[var(--warning-text)]",
          text: "Moderate",
        }
      : {
          wrap: "border-rose-200 bg-[var(--danger-bg)]",
          score: "bg-rose-100 text-[var(--danger-text)]",
          dot: "bg-rose-400",
          label: "text-[var(--danger-text)]",
          text: "Low Activity",
        };

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border px-4 py-2.5 shadow-[0_8px_20px_-14px_rgba(23,43,62,0.35)] ${palette.wrap}`}
    >
      {/* Pulsing score circle */}
      <span
        className={`animate-pulse-ring flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${palette.score}`}
      >
        {score}
      </span>

      {/* Text block */}
      <div className={palette.label}>
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${palette.dot}`} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Health Score
          </span>
        </div>
        <div className="mt-0.5 text-sm font-semibold">{palette.text}</div>
      </div>
    </div>
  );
}
