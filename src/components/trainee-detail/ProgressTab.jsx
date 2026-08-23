import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BeforeAfterSlider from "../BeforeAfterSlider";
import EmptyState from "../EmptyState";

const GOLD = "#c9a961";
const GRAPHITE = "#71717a";

function formatTick(dateStr) {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "numeric",
  });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("he-IL");
}

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#0a0a0a",
    border: "1px solid rgba(201,169,97,0.3)",
    borderRadius: 8,
  },
  labelStyle: { color: GOLD, fontWeight: 600 },
  itemStyle: { color: "#fff" },
  labelFormatter: formatDate,
};

function mergeByDate(bodyFatHistory, muscleMassHistory) {
  const map = new Map();
  for (const p of bodyFatHistory) {
    map.set(p.date, { date: p.date, bodyFat: p.value });
  }
  for (const p of muscleMassHistory) {
    map.set(p.date, { ...(map.get(p.date) ?? { date: p.date }), muscleMass: p.value });
  }
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export default function ProgressTab({ progress }) {
  const compositionData = mergeByDate(
    progress.bodyFatHistory,
    progress.muscleMassHistory
  );
  const photos = progress.photos ?? [];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-zinc-700">
          משקל לאורך זמן
        </h4>
        {progress.weightHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={progress.weightHistory}>
              <CartesianGrid stroke="#f0efec" />
              <XAxis
                dataKey="date"
                tickFormatter={formatTick}
                stroke="#a1a1aa"
                fontSize={12}
              />
              <YAxis
                stroke="#a1a1aa"
                fontSize={12}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="value"
                name='משקל (ק"ג)'
                stroke={GOLD}
                strokeWidth={2}
                dot={{ fill: GOLD, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState icon="⚖️" message="אין נתונים עדיין" compact />
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-zinc-700">
          אחוז שומן ומסת שריר
        </h4>
        {compositionData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={compositionData}>
                <CartesianGrid stroke="#f0efec" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatTick}
                  stroke="#a1a1aa"
                  fontSize={12}
                />
                <YAxis yAxisId="left" stroke={GOLD} fontSize={12} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={GRAPHITE}
                  fontSize={12}
                />
                <Tooltip {...tooltipStyle} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bodyFat"
                  name="אחוז שומן (%)"
                  stroke={GOLD}
                  strokeWidth={2}
                  dot={{ fill: GOLD, r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="muscleMass"
                  name='מסת שריר (ק"ג)'
                  stroke={GRAPHITE}
                  strokeWidth={2}
                  dot={{ fill: GRAPHITE, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 flex justify-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-zinc-600">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: GOLD }}
                />
                אחוז שומן
              </span>
              <span className="flex items-center gap-1.5 text-zinc-600">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: GRAPHITE }}
                />
                מסת שריר
              </span>
            </div>
          </>
        ) : (
          <EmptyState icon="📊" message="אין נתונים עדיין" compact />
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-zinc-700">
          תמונות התקדמות
        </h4>
        {photos.length >= 2 ? (
          <BeforeAfterSlider before={photos[0]} after={photos[photos.length - 1]} />
        ) : photos.length === 1 ? (
          <div className="mx-auto max-w-[160px] overflow-hidden rounded-lg">
            <img
              src={photos[0].url}
              alt={`תמונת התקדמות מתאריך ${formatDate(photos[0].date)}`}
              className="h-52 w-full object-cover"
            />
            <p className="mt-1 text-center text-xs text-zinc-500">
              {formatDate(photos[0].date)}
            </p>
          </div>
        ) : (
          <EmptyState icon="📷" message="אין תמונות עדיין" compact />
        )}
      </div>
    </div>
  );
}
