import { useState } from "react";

import { analyzeUser } from "./api/github";
import HealthBadge from "./components/HealthBadge";
import LanguageChart from "./components/LanguageChart";
import RepoCard from "./components/RepoCard";
import SearchBar from "./components/SearchBar";
import StatCard from "./components/StatCard";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (username) => {
    setLoading(true);
    setError(null);
    setData(null);

    const result = await analyzeUser(username);
    if (result.error) {
      setError(result.error);
    } else {
      setData(result.data);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4">
      <div className="mx-auto max-w-5xl">
        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && (
          <div className="py-12 text-center text-gray-400">
            <div className="inline-block text-4xl animate-spin">O</div>
            <p className="mt-2">Fetching GitHub data...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-700 bg-red-900/30 p-4 text-red-400">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-6 pb-12">
            <div className="flex flex-col gap-4 rounded-xl border border-gray-700 bg-gray-800 p-5 md:flex-row md:items-center">
              <img
                src={data.profile.avatar_url}
                alt="avatar"
                className="h-16 w-16 rounded-full border-2 border-blue-500"
              />
              <div>
                <h2 className="text-xl font-bold text-white">
                  {data.profile.name || data.profile.username}
                </h2>
                <p className="text-sm text-gray-400">{data.profile.bio || "No bio provided"}</p>
                <p className="mt-1 text-xs text-gray-500">@{data.profile.username}</p>
              </div>
              <div className="md:ml-auto">
                <HealthBadge score={data.health_score} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCard label="Public Repos" value={data.stats.total_repos} icon="Repos" />
              <StatCard label="Total Stars" value={data.stats.total_stars} icon="Stars" />
              <StatCard label="Total Forks" value={data.stats.total_forks} icon="Forks" />
              <StatCard label="Languages" value={data.stats.languages_used} icon="Code" />
            </div>

            <LanguageChart languages={data.languages} />

            <div>
              <h3 className="mb-3 font-semibold text-white">Top Repositories</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {data.top_repos.map((repo) => (
                  <RepoCard key={repo.name} repo={repo} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
