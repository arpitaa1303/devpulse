export default function RepoCard({ repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-gray-700 bg-gray-800 p-4 transition-colors hover:border-blue-500"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold text-blue-400 group-hover:underline">{repo.name}</h4>
        <span className="text-xs text-gray-500">{repo.language || "-"}</span>
      </div>
      <p className="mt-1 text-sm text-gray-400">{repo.description || "No description provided"}</p>
      <div className="mt-2 flex gap-4 text-xs text-gray-500">
        <span>Stars {repo.stars}</span>
        <span>Forks {repo.forks}</span>
      </div>
    </a>
  );
}
