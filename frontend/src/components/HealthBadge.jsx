export default function HealthBadge({ score }) {
  const color =
    score >= 70
      ? "border-green-400 text-green-400"
      : score >= 40
        ? "border-yellow-400 text-yellow-400"
        : "border-red-400 text-red-400";

  const label = score >= 70 ? "Healthy" : score >= 40 ? "Moderate" : "Low Activity";

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${color}`}>
      <span className="text-2xl font-bold">{score}</span>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide">Health Score</div>
        <div className="text-xs">{label}</div>
      </div>
    </div>
  );
}
