import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCurrentTrainee } from "../../context/TraineesContext";
import { TraineePage } from "../../components/trainee-area/TraineeLayout";
import CategoryCarousel from "../../components/trainee-area/CategoryCarousel";
import BeforeAfterSlider from "../../components/BeforeAfterSlider";
import EmptyState from "../../components/EmptyState";
import { currentWeight, weightDelta } from "../../lib/traineeSelectors";
import CountUp from "../../components/trainee-area/CountUp";

const GOLD = "#c9a961";
const GRAPHITE = "#71717a";

const CATEGORIES = [
  { key: "weight", label: "משקל", icon3d: "scale" },
  { key: "body", label: "הרכב גוף", icon3d: "chart_increasing" },
  { key: "photos", label: "תמונות", icon3d: "target" },
];

const RANGES = [
  { key: "8w", label: "8 שבועות", weeks: 8 },
  { key: "all", label: "הכל", weeks: null },
];

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

function sliceByRange(history, rangeKey) {
  const range = RANGES.find((r) => r.key === rangeKey);
  if (!range?.weeks) return history;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - range.weeks * 7);
  const cutoffIso = cutoff.toISOString().slice(0, 10);
  const filtered = history.filter((p) => p.date >= cutoffIso);
  return filtered.length >= 2 ? filtered : history;
}

function WeightChart({ trainee, range }) {
  const data = sliceByRange(trainee.progress.weightHistory, range);
  const current = currentWeight(trainee);
  const delta = weightDelta(trainee);
  const deltaColor =
    delta < 0 ? "text-emerald-600" : delta > 0 ? "text-red-500" : "text-zinc-400";

  return (
    <div>
      <p>
        <span className="text-4xl font-bold text-zinc-900">
          <CountUp value={current} />
        </span>{" "}
        <span className="text-lg font-medium text-zinc-400">ק"ג</span>
      </p>
      <p className={`mt-1 text-sm font-semibold ${deltaColor}`}>
        {delta <= 0 ? "▼" : "▲"} {Math.abs(delta)} ק"ג{" "}
        <span className="font-normal text-zinc-400">
          מ-{formatDate(trainee.progress.weightHistory[0].date)}
        </span>
      </p>
      {data.length > 0 ? (
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid stroke="#f0efec" />
              <XAxis
                dataKey="date"
                tickFormatter={formatTick}
                stroke="#a1a1aa"
                fontSize={11}
              />
              <YAxis stroke="#a1a1aa" fontSize={11} domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="value"
                name='משקל (ק"ג)'
                stroke={GOLD}
                strokeWidth={2.5}
                dot={{ fill: GOLD, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState icon="⚖️" message="אין נתונים עדיין" compact />
      )}
    </div>
  );
}

function BodyChart({ trainee, range }) {
  const fatHistory = sliceByRange(trainee.progress.bodyFatHistory, range);
  const lastFat = trainee.progress.bodyFatHistory.at(-1)?.value;
  const lastMuscle = trainee.progress.muscleMassHistory.at(-1)?.value;

  if (fatHistory.length === 0) {
    return <EmptyState icon="📊" message="אין נתונים עדיין" compact />;
  }

  return (
    <div>
      <div className="flex gap-6">
        <div>
          <p className="text-xs font-medium text-zinc-500">אחוז שומן</p>
          <p className="text-2xl font-bold text-zinc-900">
            <CountUp value={lastFat} />
            <span className="text-sm font-medium text-zinc-400">%</span>
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-zinc-500">מסת שריר</p>
          <p className="text-2xl font-bold text-zinc-900">
            <CountUp value={lastMuscle} />
            <span className="text-sm font-medium text-zinc-400"> ק"ג</span>
          </p>
        </div>
      </div>

      {/* פסי טווח בריאותי לאחוז שומן, בהשראת גרף "ביצועים" ב-Active */}
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={fatHistory}>
            <ReferenceArea y1={0} y2={14} fill="#60a5fa" fillOpacity={0.18} />
            <ReferenceArea y1={14} y2={20} fill="#34d399" fillOpacity={0.18} />
            <ReferenceArea y1={20} y2={26} fill="#fbbf24" fillOpacity={0.18} />
            <ReferenceArea y1={26} y2={40} fill="#f87171" fillOpacity={0.18} />
            <XAxis
              dataKey="date"
              tickFormatter={formatTick}
              stroke="#a1a1aa"
              fontSize={11}
            />
            <YAxis stroke="#a1a1aa" fontSize={11} domain={[0, 40]} />
            <Tooltip {...tooltipStyle} />
            <Line
              type="monotone"
              dataKey="value"
              name="אחוז שומן (%)"
              stroke={GRAPHITE}
              strokeWidth={2.5}
              dot={{ fill: GRAPHITE, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 flex flex-wrap justify-center gap-3 text-[10px] text-zinc-500">
          <span>🔵 נמוך</span>
          <span>🟢 תקין</span>
          <span>🟡 גבולי</span>
          <span>🔴 גבוה</span>
        </div>
      </div>
    </div>
  );
}

function PhotosView({ trainee }) {
  const photos = trainee.progress.photos ?? [];
  if (photos.length >= 2) {
    return <BeforeAfterSlider before={photos[0]} after={photos.at(-1)} />;
  }
  if (photos.length === 1) {
    return (
      <div className="mx-auto max-w-[180px] overflow-hidden rounded-xl">
        <img
          src={photos[0].url}
          alt={`תמונת התקדמות מתאריך ${formatDate(photos[0].date)}`}
          className="h-56 w-full object-cover"
        />
        <p className="mt-1 text-center text-xs text-zinc-500">
          {formatDate(photos[0].date)}
        </p>
      </div>
    );
  }
  return <EmptyState icon="📷" message="אין תמונות עדיין" compact />;
}

const VIEWS = { weight: WeightChart, body: BodyChart, photos: PhotosView };

export default function TraineePerformance() {
  const trainee = useCurrentTrainee();
  const [category, setCategory] = useState("weight");
  const [range, setRange] = useState("8w");
  const View = VIEWS[category];

  return (
    <TraineePage>
      <h1 className="mb-4 text-xl font-bold text-zinc-900">הביצועים שלי</h1>

      <CategoryCarousel
        categories={CATEGORIES}
        active={category}
        onChange={setCategory}
      />

      {category !== "photos" && (
        <div className="mt-3 flex justify-center gap-1 rounded-full bg-zinc-100 p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                range === r.key
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
        <View trainee={trainee} range={range} />
      </div>
    </TraineePage>
  );
}
