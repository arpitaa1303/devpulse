export default function StatCard({ label, value, icon }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-gray-700 bg-gray-800 p-5">
      <span className="text-2xl">{icon}</span>
      <span className="text-3xl font-bold text-white">{value?.toLocaleString()}</span>
      <span className="text-sm text-gray-400">{label}</span>
    </div>
  );
}
