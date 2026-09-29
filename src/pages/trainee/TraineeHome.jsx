import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, Dumbbell } from "lucide-react";
import { useCurrentTrainee, useTrainees } from "../../context/TraineesContext";
import { TraineePage } from "../../components/trainee-area/TraineeLayout";
import IconCardCarousel from "../../components/trainee-area/IconCardCarousel";
import Icon3D from "../../components/trainee-area/Icon3D";
import CountUp from "../../components/trainee-area/CountUp";
import HomeSkeleton from "../../components/trainee-area/Skeleton";
import Coachmark from "../../components/trainee-area/Coachmark";
import { flyPointsFrom } from "../../components/trainee-area/PointsFly";
import { Bar } from "../../components/trainee-area/Summaries";
import { EARNING_RULES } from "../../data/rewards";
import { COACH_MESSAGE, MEAL_PLAN } from "../../data/traineeDemoContent";
import {
  CHALLENGE_TARGET,
  WEEKLY_GOAL,
  currentWeight,
  goalStatus,
  monthName,
  rankOf,
  sessionsThisMonth,
  sessionsThisWeek,
  streakWeeks,
  weekDayStatus,
  weightDelta,
} from "../../lib/traineeSelectors";

const CATEGORIES = [
  { key: "sessions", label: "אימונים", icon3d: "shoe" },
  { key: "weight", label: "משקל", icon3d: "scale" },
  { key: "body", label: "הרכב גוף", icon3d: "chart_increasing" },
  { key: "nutrition", label: "תזונה", icon3d: "salad" },
];

function SessionsCategory({ trainee }) {
  const days = weekDayStatus(trainee);
  const done = sessionsThisWeek(trainee);
  const remaining = Math.max(0, WEEKLY_GOAL - done);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p>
          <span className="text-4xl font-bold text-zinc-900">
            <CountUp value={done} />
          </span>
          <span className="text-lg font-medium text-zinc-400">
            /{WEEKLY_GOAL}
          </span>
        </p>
        <span className="text-sm font-medium text-zinc-500">השבוע</span>
      </div>

      <div className="mt-4 flex justify-between">
        {days.map((d) => (
          <div key={d.date} className="flex flex-col items-center gap-1.5">
            <span
              className={`text-xs font-medium ${
                d.isToday ? "text-brand-gold-dark" : "text-zinc-400"
              }`}
            >
              {d.label}
            </span>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                d.done
                  ? "bg-brand-gold text-brand-black"
                  : d.isToday
                  ? "border-2 border-brand-gold/50 text-zinc-300"
                  : "bg-zinc-100 text-zinc-300"
              }`}
            >
              {d.done ? "✓" : ""}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-brand-gold-light/30 px-3 py-2">
        <span className="text-xs font-medium text-zinc-600">
          {remaining > 0
            ? `עוד ${remaining} אימונים ליעד השבועי`
            : "עמדת ביעד השבועי! 🎉"}
        </span>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-brand-gold-dark">
          +{EARNING_RULES[0].points} נק'
        </span>
      </div>
    </div>
  );
}

function WeightCategory({ trainee }) {
  const current = currentWeight(trainee);
  const delta = weightDelta(trainee);
  const { remainingKg, pct } = goalStatus(trainee);
  const deltaColor =
    delta < 0
      ? "text-emerald-600"
      : delta > 0
      ? "text-red-500"
      : "text-zinc-400";
  const arrow = delta < 0 ? "▼" : delta > 0 ? "▲" : "–";

  return (
    <div>
      <p>
        <span className="text-4xl font-bold text-zinc-900">
          <CountUp value={current} />
        </span>{" "}
        <span className="text-lg font-medium text-zinc-400">ק"ג</span>
      </p>
      <p className={`mt-1 text-sm font-semibold ${deltaColor}`}>
        {arrow} {Math.abs(delta)} ק"ג{" "}
        <span className="font-normal text-zinc-400">מהמדידה הראשונה</span>
      </p>
      <Bar pct={pct} />
      <p className="mt-2 text-xs text-zinc-500">
        {remainingKg > 0 ? (
          <>
            עוד <span className="font-semibold text-zinc-800">{remainingKg} ק"ג</span> ליעד
          </>
        ) : (
          "הגעת ליעד 🎉"
        )}
      </p>
    </div>
  );
}

function BodyCategory({ trainee }) {
  const fat = trainee.progress.bodyFatHistory;
  const muscle = trainee.progress.muscleMassHistory;
  const lastFat = fat.at(-1)?.value;
  const lastMuscle = muscle.at(-1)?.value;
  const fatDelta =
    fat.length > 1 ? Math.round((lastFat - fat[0].value) * 10) / 10 : 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-zinc-50 p-3">
        <p className="text-xs font-medium text-zinc-500">אחוז שומן</p>
        <p className="mt-1 text-2xl font-bold text-zinc-900">
          {lastFat}
          <span className="text-sm font-medium text-zinc-400">%</span>
        </p>
        <p
          className={`mt-0.5 text-xs font-semibold ${
            fatDelta < 0 ? "text-emerald-600" : "text-zinc-400"
          }`}
        >
          {fatDelta < 0 ? "▼" : "▲"} {Math.abs(fatDelta)}%
        </p>
      </div>
      <div className="rounded-xl bg-zinc-50 p-3">
        <p className="text-xs font-medium text-zinc-500">מסת שריר</p>
        <p className="mt-1 text-2xl font-bold text-zinc-900">
          {lastMuscle}
          <span className="text-sm font-medium text-zinc-400"> ק"ג</span>
        </p>
        <Link
          to="/me/performance"
          className="mt-0.5 block text-xs font-semibold text-brand-gold-dark"
        >
          לפירוט המלא ←
        </Link>
      </div>
    </div>
  );
}

function NutritionCategory() {
  const [checked, setChecked] = useState({});
  return (
    <div className="space-y-2">
      {MEAL_PLAN.map((meal) => (
        <button
          key={meal.key}
          onClick={() =>
            setChecked((c) => ({ ...c, [meal.key]: !c[meal.key] }))
          }
          className="flex w-full items-center justify-between rounded-xl bg-zinc-50 px-3 py-2.5 text-right transition active:scale-[0.98]"
        >
          <div>
            <p className="text-sm font-semibold text-zinc-800">
              {meal.label}
            </p>
            <p className="text-xs text-zinc-500">{meal.suggestion}</p>
          </div>
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              checked[meal.key]
                ? "bg-brand-gold text-brand-black"
                : "border border-zinc-300 text-transparent"
            }`}
          >
            ✓
          </span>
        </button>
      ))}
    </div>
  );
}

export default function TraineeHome() {
  const { trainees, checkIn } = useTrainees();
  const trainee = useCurrentTrainee();
  const [category, setCategory] = useState("sessions");
  const firstName = trainee.name.split(" ")[0];

  const monthDone = sessionsThisMonth(trainee);
  const streak = streakWeeks(trainee);
  const rank = rankOf(trainees, trainee.id);

  // שלד טעינה - פעם אחת בכניסה הראשונה ל-/me באותו session (הנתונים סינכרוניים,
  // אין באמת המתנה חוזרת שרוצים להראות בכל ניווט)
  const [showSkeleton, setShowSkeleton] = useState(
    () => !sessionStorage.getItem("refaeli_home_seen")
  );
  useEffect(() => {
    if (!showSkeleton) return;
    const t = setTimeout(() => {
      sessionStorage.setItem("refaeli_home_seen", "true");
      setShowSkeleton(false);
    }, 450);
    return () => clearTimeout(t);
  }, [showSkeleton]);

  // חלון הסבר חד-פעמי (localStorage) שמצביע על קרוסלת הקטגוריות
  const carouselWrapRef = useRef(null);
  const [coachTarget, setCoachTarget] = useState(null);
  useEffect(() => {
    if (showSkeleton || localStorage.getItem("refaeli_coach_seen")) return;
    const t = setTimeout(() => {
      const rect = carouselWrapRef.current?.getBoundingClientRect();
      if (rect) {
        setCoachTarget({ left: rect.left, top: rect.top, width: rect.width, height: 78 });
      }
    }, 300);
    return () => clearTimeout(t);
  }, [showSkeleton]);

  function dismissCoach() {
    localStorage.setItem("refaeli_coach_seen", "true");
    setCoachTarget(null);
  }

  function handleCheckIn(e) {
    if (trainee.sessionsRemaining > 0) flyPointsFrom(e.currentTarget, 10);
    checkIn(trainee.id);
  }

  if (showSkeleton) {
    return (
      <TraineePage>
        <HomeSkeleton />
      </TraineePage>
    );
  }

  return (
    <TraineePage>
      <h1 className="mb-3 text-xl font-bold text-zinc-900">
        היי {firstName} 👋
      </h1>

      {/* כרטיס סיכום שחור, כמו כרטיס "השבוע" הכהה ב-Active */}
      <div className="rounded-2xl bg-brand-black p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Icon3D name="fire" size={26} />
            <div>
              <p className="text-xs text-zinc-400">רצף שבועי</p>
              <p className="text-sm font-bold">
                {streak} {streak === 1 ? "שבוע" : "שבועות"} רצופים
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="text-left">
              <p className="text-xs text-zinc-400">מקום בקהילה</p>
              <p className="text-sm font-bold">#{rank}</p>
            </div>
            <Icon3D name="trophy" size={26} />
          </div>
        </div>
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-zinc-300">
            <span>
              אתגר {monthName()}: {Math.min(monthDone, CHALLENGE_TARGET)}/
              {CHALLENGE_TARGET} אימונים
            </span>
          </div>
          <Bar
            pct={Math.min(1, monthDone / CHALLENGE_TARGET)}
            className="bg-brand-gold"
          />
        </div>
      </div>

      {/* קרוסלת קטגוריות מסונכרנת: אייקונים + כרטיסים */}
      <div ref={carouselWrapRef} className="mt-5">
        <IconCardCarousel
          categories={CATEGORIES}
          active={category}
          onChange={setCategory}
        >
          <SessionsCategory trainee={trainee} />
          <WeightCategory trainee={trainee} />
          <BodyCategory trainee={trainee} />
          <NutritionCategory />
        </IconCardCarousel>
      </div>

      {/* הודעה מעמית */}
      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-brand-gold/20 bg-brand-gold-light/20 p-3.5">
        <span className="text-xl">👨‍🏫</span>
        <div>
          <p className="text-xs font-semibold text-brand-gold-dark">
            הודעה מעמית · היום
          </p>
          <p className="mt-0.5 text-sm text-zinc-700">{COACH_MESSAGE.text}</p>
        </div>
      </div>

      {/* צ'ק-אין */}
      <button
        onClick={handleCheckIn}
        disabled={trainee.sessionsRemaining === 0}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-gold py-3.5 text-sm font-bold text-brand-black shadow-md transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
      >
        <Dumbbell size={18} />
        צ'ק-אין לאימון
      </button>
      <p className="mt-2 text-center text-xs text-zinc-400">
        {trainee.sessionsRemaining > 0
          ? `נותרו ${trainee.sessionsRemaining} אימונים במנוי`
          : "נגמרו האימונים במנוי - יש לחדש"}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <Link
          to="/me/rewards"
          className="flex items-center gap-1 text-xs font-semibold text-zinc-400"
        >
          <ChevronLeft size={14} /> לחנות הפרסים
        </Link>
        <Link
          to="/me/groups"
          className="flex items-center gap-1 text-xs font-semibold text-zinc-400"
        >
          <ChevronLeft size={14} /> לדירוג הקהילה
        </Link>
      </div>

      <AnimatePresence>
        {coachTarget && (
          <Coachmark
            targetRect={coachTarget}
            text="כאן רואים את ההתקדמות שלך - החליקו בין הקטגוריות והרוויחו Refaeli Cash"
            onDismiss={dismissCoach}
          />
        )}
      </AnimatePresence>
    </TraineePage>
  );
}
