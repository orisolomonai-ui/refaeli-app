// מקור אמת אחד לערכים נגזרים על מתאמן (משקל, דירוג, אימונים החודש, פרס הבא...).
// כל מסך קורא מכאן, כדי שאותו מספר לא ייגזר בכמה דרכים.
import { STORE_CATALOG } from "../data/rewards";

export const CHALLENGE_TARGET = 12;
export const WEEKLY_GOAL = 3;
const WEEKDAY_LABELS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

const DAY_MS = 86400000;
const pad = (n) => String(n).padStart(2, "0");

// --- תאריכים (מחרוזות YYYY-MM-DD, חישוב ב-UTC כדי להימנע מקפיצות שעון קיץ) ---

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toUTC(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function daysBetween(fromISO, toISO) {
  return Math.round((toUTC(toISO) - toUTC(fromISO)) / DAY_MS);
}

export function shiftISO(iso, days) {
  return new Date(toUTC(iso) + days * DAY_MS).toISOString().slice(0, 10);
}

export function monthName(iso = todayISO()) {
  return new Date(toUTC(iso)).toLocaleDateString("he-IL", {
    month: "long",
    timeZone: "UTC",
  });
}

// --- משקל והתקדמות ---

export function currentWeight(t) {
  const h = t.progress.weightHistory;
  return h.length ? h[h.length - 1].value : null;
}

export function firstWeight(t) {
  const h = t.progress.weightHistory;
  return h.length ? h[0].value : null;
}

// שינוי מהמדידה הראשונה: שלילי = ירד במשקל
export function weightDelta(t) {
  const current = currentWeight(t);
  if (current === null) return 0;
  return Math.round((current - firstWeight(t)) * 10) / 10;
}

// כמה ק"ג נשארו ליעד, ואיזה חלק מהדרך (0..1) כבר נעשה. מניח יעד ירידה במשקל.
export function goalStatus(t) {
  const current = currentWeight(t);
  const first = firstWeight(t);
  const total = first - t.goalWeight;
  const pct =
    total > 0 ? Math.min(1, Math.max(0, (first - current) / total)) : 0;
  return {
    remainingKg: Math.max(0, Math.round((current - t.goalWeight) * 10) / 10),
    pct,
  };
}

// --- אימונים ---

export function sessionsThisMonth(t, todayIso = todayISO()) {
  const monthPrefix = todayIso.slice(0, 7);
  return t.sessionHistory.filter((s) => s.date.startsWith(monthPrefix)).length;
}

// תחילת השבוע (יום ראשון) שמכיל את התאריך הנתון
function startOfWeekISO(iso) {
  const dow = new Date(toUTC(iso)).getUTCDay(); // 0=ראשון
  return shiftISO(iso, -dow);
}

function sessionsInWeek(t, weekStartIso) {
  const weekEndIso = shiftISO(weekStartIso, 6);
  return t.sessionHistory.filter(
    (s) => s.date >= weekStartIso && s.date <= weekEndIso
  );
}

export function sessionsThisWeek(t, todayIso = todayISO()) {
  return sessionsInWeek(t, startOfWeekISO(todayIso)).length;
}

// מצב 7 ימי השבוע הנוכחי (א'-ש') לפי לוג האימונים בפועל, לתצוגת "השבוע שלי"
export function weekDayStatus(t, todayIso = todayISO()) {
  const weekStart = startOfWeekISO(todayIso);
  const done = new Set(sessionsInWeek(t, weekStart).map((s) => s.date));
  return WEEKDAY_LABELS.map((label, i) => {
    const date = shiftISO(weekStart, i);
    return { label, date, done: done.has(date), isToday: date === todayIso };
  });
}

// כמה שבועות רצופים (כולל הנוכחי) שבהם הייתה לפחות פעילות אחת
export function streakWeeks(t, todayIso = todayISO()) {
  let weekStart = startOfWeekISO(todayIso);
  let streak = 0;
  for (let i = 0; i < 52; i++) {
    if (sessionsInWeek(t, weekStart).length === 0) {
      if (i === 0) {
        weekStart = shiftISO(weekStart, -7);
        continue; // השבוע הנוכחי עדיין לא הסתיים - לא שובר רצף אם ריק עד כה
      }
      break;
    }
    streak++;
    weekStart = shiftISO(weekStart, -7);
  }
  return streak;
}

// --- דירוג ופרסים ---

export function rankedByPoints(trainees) {
  return [...trainees].sort((a, b) => b.points - a.points || a.id - b.id);
}

export function rankOf(trainees, id) {
  return rankedByPoints(trainees).findIndex((t) => t.id === id) + 1;
}

// חיובי = עלה בדירוג מהשבוע שעבר
export function rankChange(trainees, t) {
  return t.lastWeekRank - rankOf(trainees, t.id);
}

// הפרס הזול ביותר שהמתאמן עוד לא הגיע אליו (null אם הגיע לכולם)
export function nextReward(points) {
  const byCost = [...STORE_CATALOG].sort((a, b) => a.cost - b.cost);
  return byCost.find((r) => r.cost > points) ?? null;
}
