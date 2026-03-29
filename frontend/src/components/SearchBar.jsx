import { useState } from "react";

const EXAMPLES = ["octocat", "gaearon", "torvalds"];

export default function SearchBar({ onSearch, loading }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  /* NEW: chip click fills input and triggers search immediately */
  const handleChipClick = (name) => {
    setUsername(name);
    onSearch(name);
  };

  return (
    <div className="space-y-4 pb-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
            Analyze a Profile
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Enter any public GitHub username to get an instant pulse.
          </p>
        </div>

        {/* CHANGED: chips are now <button> elements with click handler */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="label-mono mr-1">Try:</span>
          {EXAMPLES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handleChipClick(name)}
              disabled={loading}
              className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-1 font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-blue)] hover:bg-[var(--accent-blue-muted)] hover:text-[var(--accent-blue)] disabled:pointer-events-none disabled:opacity-50"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="e.g. torvalds"
          className="flex-1 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--border-focus)] focus:ring-4 focus:ring-[var(--accent-blue)]/20"
        />
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="rounded-xl bg-[var(--accent-blue)] px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_25px_-16px_rgba(37,91,140,0.50)] transition-colors hover:bg-[var(--accent-blue-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </form>
    </div>
  );
}
