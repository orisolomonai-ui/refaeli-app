// תקצירים שמשותפים למסך הבית ולמסכים הפנימיים של המתאמן.
// כל הערכים נגזרים מ-traineeSelectors, כך שאותו מספר זהה בכל מקום.
import Sparkline from "./Sparkline";
import {
  CHALLENGE_TARGET,
  currentWeight,
  goalStatus,
  monthName,
  nextReward,
  rankChange,
  rankOf,
  sessionsThisMonth,
  weightDelta,
} from "../../lib/traineeSelectors";

export function Bar({ pct, className = "bg-brand-gold" }) {
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full ${className}`}
        style={{ width: `${Math.round(pct * 100)}%` }}
      />
    </div>
  );
}

export function WeightSummary({ trainee, showSparkline = false }) {
  const current = currentWeight(trainee);
  const delta = weightDelta(trainee);
  const { remainingKg, pct } = goalStatus(trainee);
  const weights = trainee.progress.weightHistory.map((w) => w.value);

  const deltaColor =
    delta < 0 ? "text-emerald-400" : delta > 0 ? "text-red-400" : "text-zinc-400";
  const arrow = delta < 0 ? "▼" : delta > 0 ? "▲" : "–";

  return (
    <div>
      {/* מספר + יחידה בעברית נשארים בזרימת ה-RTL: המספר מימין והיחידה משמאלו */}
      <p>
        <span className="text-5xl font-bold text-white">{current}</span>{" "}
        <span className="text-lg font-medium text-zinc-400">ק"ג</span>
      </p>
      <p className={`mt-1 text-sm font-semibold ${deltaColor}`}>
        {arrow} {Math.abs(delta)} ק"ג{" "}
        <span className="font-normal text-zinc-400">מהמדידה הראשונה</span>
      </p>

      {showSparkline && weights.length > 1 && (
        <div className="mt-3">
          {/* צבע הקו כמו החץ: ירוק אם ירד במשקל, אדום אם עלה, זהב אם לא השתנה */}
          <Sparkline
            values={weights}
            color={delta < 0 ? "#34d399" : delta > 0 ? "#f87171" : "#c9a961"}
          />
        </div>
      )}

      <Bar pct={pct} />
      <p className="mt-2 text-xs text-zinc-300">
        {remainingKg > 0 ? (
          <>
            עוד{" "}
            <span className="font-semibold text-white">{remainingKg} ק"ג</span>{" "}
            ליעד
          </>
        ) : (
          "הגעת ליעד 🎉"
        )}
      </p>
    </div>
  );
}

// "חסרות לך X נק' לפרס הבא" — הפרס הזול ביותר שהמתאמן עוד לא הגיע אליו
export function NextRewardLine({ points, className = "" }) {
  const next = nextReward(points);
  return (
    <p className={`text-sm text-zinc-300 ${className}`}>
      {next ? (
        <>
          חסרות לך{" "}
          <span className="font-semibold text-white">
            {next.cost - points} נק'
          </span>{" "}
          לפרס הבא
        </>
      ) : (
        "הגעת לכל הפרסים 🎉"
      )}
    </p>
  );
}

export function CommunitySummary({ trainee, trainees }) {
  const rank = rankOf(trainees, trainee.id);
  const change = rankChange(trainees, trainee);
  const monthlySessions = sessionsThisMonth(trainee);

  return (
    <div>
      <p className="flex items-baseline gap-3">
        <span className="text-5xl font-bold text-white">מקום {rank}</span>
        {change > 0 && (
          <span className="text-lg font-bold text-emerald-400">▲ {change}</span>
        )}
        {change < 0 && (
          <span className="text-lg font-bold text-red-400">
            ▼ {Math.abs(change)}
          </span>
        )}
        {change === 0 && (
          <span className="text-lg font-bold text-zinc-400">–</span>
        )}
      </p>

      <p className="mt-4 text-sm text-zinc-300">
        אתגר {monthName()}:{" "}
        <span dir="ltr" className="inline-block font-semibold text-white">
          {Math.min(monthlySessions, CHALLENGE_TARGET)}/{CHALLENGE_TARGET}
        </span>{" "}
        אימונים
      </p>
      <Bar pct={Math.min(1, monthlySessions / CHALLENGE_TARGET)} />
    </div>
  );
}
