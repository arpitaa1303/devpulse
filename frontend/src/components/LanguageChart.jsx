import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#2F6EA8",
  "#2A9D8F",
  "#5E86C1",
  "#4E8F7A",
  "#7BA8C4",
  "#6B8DA8",
  "#3A7CC2",
];

/* Custom tooltip */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-3 py-2 text-xs shadow-lg">
      <span className="font-semibold text-[var(--text-primary)]">{name}</span>
      <span className="ml-2 text-[var(--text-muted)]">
        {value} repo{value !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

export default function LanguageChart({ languages }) {
  const data = Object.entries(languages)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-5 shadow-[0_16px_30px_-24px_rgba(39,87,132,0.22)]">
      <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
        Language Breakdown
      </h3>

      {/* CHANGED: donut chart — innerRadius added, labels removed from arcs */}
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={88}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* NEW: custom legend row */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full flex-shrink-0"
              style={{ background: COLORS[index % COLORS.length] }}
            />
            <span className="text-[var(--text-secondary)]">{entry.name}</span>
            <span className="text-[var(--text-muted)]">
              {Math.round((entry.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
