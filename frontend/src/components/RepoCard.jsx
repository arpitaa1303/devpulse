export default function RepoCard({ repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 shadow-[0_10px_24px_-20px_rgba(45,87,180,0.38)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-teal)] hover:bg-[var(--surface-elevated)] hover:shadow-[0_16px_30px_-18px_rgba(42,157,143,0.30)]"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Repo name */}
        <h4 className="font-semibold text-[var(--accent-blue-strong)] group-hover:underline">
          {repo.name}
        </h4>

        {/* CHANGED: language badge now teal-tinted */}
        {repo.language && (
          <span className="rounded-full border border-[var(--accent-teal-light)] bg-[var(--accent-teal-light)] px-2 py-0.5 text-xs font-semibold text-[var(--accent-teal-strong)]">
            {repo.language}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        {repo.description || "No description provided"}
      </p>

      {/* CHANGED: pills now have SVG icons */}
      <div className="mt-3 flex gap-2 text-xs text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-2.5 py-1 font-semibold">
          <svg viewBox="0 0 16 16" className="h-3 w-3 fill-amber-400">
            <path d="M8 1l1.85 3.75 4.15.6-3 2.93.71 4.12L8 10.27l-3.71 1.93.71-4.12L2 5.35l4.15-.6z" />
          </svg>
          {repo.stars}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-2.5 py-1 font-semibold">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-3 w-3 stroke-[var(--text-muted)]"
            strokeWidth={1.8}
          >
            <circle cx="8" cy="2.5" r="1.3" fill="currentColor" stroke="none" />
            <circle
              cx="4"
              cy="13.5"
              r="1.3"
              fill="currentColor"
              stroke="none"
            />
            <circle
              cx="12"
              cy="13.5"
              r="1.3"
              fill="currentColor"
              stroke="none"
            />
            <path
              d="M8 3.8v3M8 6.8c0 1.8-4 2-4 5.4M8 6.8c0 1.8 4 2 4 5.4"
              strokeLinecap="round"
            />
          </svg>
          {repo.forks}
        </span>
      </div>
    </a>
  );
}
