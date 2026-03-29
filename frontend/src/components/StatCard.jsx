const ICONS = {
  Repos: (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <rect x="3" y="2" width="14" height="16" rx="2" />
      <path d="M7 6h6M7 10h6M7 14h4" strokeLinecap="round" />
    </svg>
  ),
  Stars: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M10 1.5l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.77l-4.77 2.44.91-5.32L2.27 7.12l5.34-.78L10 1.5z" />
    </svg>
  ),
  Forks: (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <circle cx="10" cy="3" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="5" cy="17" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="1.6" fill="currentColor" stroke="none" />
      <path
        d="M10 4.6v3.9M10 8.5c0 2 -5 2.5 -5 5.9M10 8.5c0 2 5 2.5 5 5.9"
        strokeLinecap="round"
      />
    </svg>
  ),
  Code: (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <path
        d="M6.5 7L3 10l3.5 3M13.5 7L17 10l-3.5 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.5 5l-3 10" strokeLinecap="round" />
    </svg>
  ),
};

export default function StatCard({ label, value, icon }) {
  const iconEl = ICONS[icon];

  return (
    <div className="group flex flex-col gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 shadow-[0_16px_28px_-16px_rgba(49,91,182,0.22)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_32px_-16px_rgba(49,91,182,0.30)]">
      {/* Icon circle */}
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent-blue-muted)] text-[var(--accent-blue)]">
        {iconEl}
      </span>

      {/* Value */}
      <span className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
        {value?.toLocaleString()}
      </span>

      {/* Label */}
      <span className="label-mono">{label}</span>
    </div>
  );
}
