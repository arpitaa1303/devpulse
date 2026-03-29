import { useState } from "react";
import { analyzeUser } from "./api/github";
import HealthBadge from "./components/HealthBadge";
import LanguageChart from "./components/LanguageChart";
import RepoCard from "./components/RepoCard";
import SearchBar from "./components/SearchBar";
import StatCard from "./components/StatCard";

/* ── SVG icons ────────────────────────────────────────────────── */
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M12 2C6.48 2 2 6.58 2 12.17c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.49v-1.71c-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.1-1.48-1.1-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0112 7.4c.85.004 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.81c0 .27.18.59.69.49A10.17 10.17 0 0022 12.17C22 6.58 17.52 2 12 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className="h-4 w-4"
    stroke="currentColor"
    strokeWidth={1.6}
  >
    <circle cx="10" cy="10" r="8" />
    <path d="M10 6v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PipelineIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className="h-4 w-4"
    stroke="currentColor"
    strokeWidth={1.6}
  >
    <circle cx="4" cy="10" r="2.2" />
    <circle cx="16" cy="10" r="2.2" />
    <circle cx="10" cy="4" r="2.2" />
    <path d="M6 10h4M12 10h2M10 6.2V8" strokeLinecap="round" />
  </svg>
);

/* Feature tiles data */
const FEATURES = [
  {
    title: "Pulse Score",
    desc: "A 0–100 health score based on activity recency, repo descriptions, stars, and language diversity.",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-5 w-5"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        <path
          d="M2 10h3l2-6 3 12 2-8 2 4h4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    teal: false,
  },
  {
    title: "Language DNA",
    desc: "Visual donut chart of every language across original repos — see the full tech fingerprint at a glance.",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-5 w-5"
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
    teal: true,
  },
  {
    title: "Repo Radar",
    desc: "Top repositories ranked by stars — metadata cards with language, forks, and direct GitHub links.",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-5 w-5"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        <circle cx="10" cy="10" r="7" />
        <circle cx="10" cy="10" r="3" />
        <path d="M10 3v2M10 15v2M3 10h2M15 10h2" strokeLinecap="round" />
      </svg>
    ),
    teal: false,
  },
];

/* Proof strip items — rendered as a horizontal row */
const PROOF = [
  {
    label: "Data Source",
    value: "GitHub API",
    sub: "Official REST v3",
    icon: <GitHubIcon />,
  },
  {
    label: "Performance",
    value: "Redis Cached",
    sub: "5-min TTL",
    icon: <ClockIcon />,
  },
  {
    label: "Reliability",
    value: "CI/CD Pipeline",
    sub: "GitHub Actions",
    icon: <PipelineIcon />,
  },
];

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (username) => {
    setLoading(true);
    setError(null);
    setData(null);
    const result = await analyzeUser(username);
    if (result.error) setError(result.error);
    else setData(result.data);
    setLoading(false);
  };

  const scrollToAnalyzer = () => {
    document
      .getElementById("analyzer")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    /* Generous page padding — more breathing room top and bottom */
    <div className="min-h-screen px-5 py-14 text-[var(--text-primary)] md:px-10 md:py-20">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* ══════════════════════════════════════════════════════
            PAGE HEADER — DEVPULSE sits OUTSIDE any card,
            centered, with a blue-to-teal gradient color.
        ══════════════════════════════════════════════════════ */}
        <header className="animate-fade-up text-center">
          {/* Status pill */}
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-teal)] animate-breathe" />
            GitHub Profile Analyzer
          </span>

          {/* Title — outside any card, gradient text */}
          <h1
            className="mt-4 text-7xl font-black leading-none tracking-tighter md:text-8xl lg:text-[7rem]"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-teal) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            DEVPULSE
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-[var(--text-secondary)] md:text-lg">
            Turn any public GitHub profile into a clear signal — activity
            health, technology fingerprint, and standout repos. In one search.
          </p>

          {/* Feature tags */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {["Health Score", "Language Mix", "Top Repos"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={scrollToAnalyzer}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--accent-blue)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_32px_-14px_rgba(37,91,140,0.48)] transition-colors hover:bg-[var(--accent-blue-strong)]"
          >
            Analyze a Username
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        {/* ══════════════════════════════════════════════════════
            PROOF STRIP — 3 columns, horizontal, inside a card.
            Each item: icon circle + value + sub-label.
            Full width, evenly spaced, dividers between items.
        ══════════════════════════════════════════════════════ */}
        <section
          className="animate-fade-up rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] shadow-[0_12px_32px_-20px_rgba(39,87,132,0.18)]"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="grid grid-cols-1 divide-y divide-[var(--border-soft)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {PROOF.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 px-7 py-6"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent-blue-muted)] text-[var(--accent-blue)]">
                  {item.icon}
                </span>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    {item.value}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {item.label} · {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FEATURE TILES — 3 equal cards, icons, staggered fade
        ══════════════════════════════════════════════════════ */}
        <section className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((tile, i) => (
            <article
              key={tile.title}
              className="animate-fade-up rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-6 shadow-[0_10px_24px_-18px_rgba(115,147,173,0.26)]"
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              <span
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                  tile.teal
                    ? "bg-[var(--accent-teal-light)] text-[var(--accent-teal-strong)]"
                    : "bg-[var(--accent-blue-muted)] text-[var(--accent-blue)]"
                }`}
              >
                {tile.icon}
              </span>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                {tile.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {tile.desc}
              </p>
            </article>
          ))}
        </section>

        {/* ══════════════════════════════════════════════════════
            ANALYZER SECTION — search + results
        ══════════════════════════════════════════════════════ */}
        <section
          id="analyzer"
          className="animate-fade-up rounded-3xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-7 shadow-[0_20px_50px_-30px_rgba(39,87,132,0.22)] md:p-10"
          style={{ animationDelay: "0.45s" }}
        >
          <SearchBar onSearch={handleSearch} loading={loading} />

          {/* Loading spinner */}
          {loading && (
            <div className="py-16 text-center text-[var(--text-muted)]">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[var(--border-soft)] border-t-[var(--accent-blue)]" />
              <p className="mt-4 text-sm">Fetching GitHub data…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-[var(--danger-bg)] p-4 text-sm text-[var(--danger-text)]">
              {error}
            </div>
          )}

          {/* Results */}
          {data && (
            <div className="mt-6 space-y-6">
              {/* Profile header */}
              <div className="flex flex-col gap-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-6 md:flex-row md:items-start">
                <img
                  src={data.profile.avatar_url}
                  alt="avatar"
                  className="h-16 w-16 rounded-full border-2 border-[var(--accent-teal)]"
                />
                <div className="flex-1 space-y-1">
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    {data.profile.name || data.profile.username}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {data.profile.bio || "No bio provided"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    @{data.profile.username}
                  </p>
                  <div className="flex gap-4 pt-1 text-xs text-[var(--text-muted)]">
                    <span>
                      <strong className="font-semibold text-[var(--text-primary)]">
                        {data.profile.followers?.toLocaleString()}
                      </strong>{" "}
                      followers
                    </span>
                    <span>
                      <strong className="font-semibold text-[var(--text-primary)]">
                        {data.profile.following?.toLocaleString()}
                      </strong>{" "}
                      following
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <HealthBadge score={data.health_score} />
                  {data.from_cache && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-teal-light)] bg-[var(--accent-teal-light)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-teal-strong)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-teal)] animate-breathe" />
                      Cached
                    </span>
                  )}
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                  label="Public Repos"
                  value={data.stats.total_repos}
                  icon="Repos"
                />
                <StatCard
                  label="Total Stars"
                  value={data.stats.total_stars}
                  icon="Stars"
                />
                <StatCard
                  label="Total Forks"
                  value={data.stats.total_forks}
                  icon="Forks"
                />
                <StatCard
                  label="Languages"
                  value={data.stats.languages_used}
                  icon="Code"
                />
              </div>

              {/* Language chart */}
              <LanguageChart languages={data.languages} />

              {/* Top repos */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-[var(--text-primary)]">
                  Top Repositories
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {data.top_repos.map((repo) => (
                    <RepoCard key={repo.name} repo={repo} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
