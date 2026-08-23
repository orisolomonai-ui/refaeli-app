import { useState } from "react";
import Avatar from "../Avatar";

const EARNING_RULES = [
  { label: "הגעה לאימון", points: 10 },
  { label: "עמידה ביעד משקל חודשי", points: 50 },
  { label: "רצף של 4 שבועות רצופים", points: 30 },
  { label: "עדכון תמונת התקדמות", points: 15 },
  { label: "הזמנת חבר/ה חדש/ה למועדון", points: 100 },
];

const REWARDS = [
  { icon: "🏷️", name: "10% הנחה על החודש הבא", cost: 200 },
  { icon: "🥤", name: "מוצר חלבון מתנה", cost: 350 },
  { icon: "🎁", name: "אימון פרטי מתנה", cost: 500 },
  { icon: "👕", name: "חולצת Refaeli Fitness", cost: 400 },
];

function RewardCard({ reward, canAfford }) {
  const [redeemed, setRedeemed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 text-center">
      <span className="text-3xl">{reward.icon}</span>
      <p className="text-sm font-semibold text-zinc-800">{reward.name}</p>
      <p className="text-sm font-bold text-brand-gold-dark" dir="ltr">
        {reward.cost} נק'
      </p>
      <button
        onClick={() => setRedeemed(true)}
        disabled={!canAfford || redeemed}
        className={`mt-1 w-full rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
          redeemed
            ? "bg-emerald-50 text-emerald-700"
            : canAfford
            ? "bg-brand-black text-brand-gold hover:bg-brand-charcoal"
            : "cursor-not-allowed bg-zinc-100 text-zinc-400"
        }`}
      >
        {redeemed ? "✓ מומש (הדגמה)" : "מימוש"}
      </button>
    </div>
  );
}

function LeaderboardRow({ rank, entry, isCurrent }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
        isCurrent ? "border border-brand-gold bg-brand-gold-light/40" : ""
      }`}
    >
      <span
        className="w-6 shrink-0 text-center text-sm font-bold text-zinc-500"
        dir="ltr"
      >
        {rank}
      </span>
      <Avatar name={entry.name} size="sm" />
      <span className="flex-1 truncate text-sm font-semibold text-zinc-800">
        {entry.name}
        {isCurrent && (
          <span className="ms-1 text-xs font-normal text-brand-gold-dark">
            (אתה)
          </span>
        )}
      </span>
      <span className="text-sm font-bold text-brand-gold-dark" dir="ltr">
        {entry.points}
      </span>
    </div>
  );
}

export default function RefaeliCashTab({ trainee, trainees }) {
  const ranked = [...trainees].sort((a, b) => b.points - a.points);
  const currentRank = ranked.findIndex((t) => t.id === trainee.id) + 1;
  const top10 = ranked.slice(0, 10);
  const isCurrentInTop10 = currentRank <= 10;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold-light/30 p-8 text-center">
        <p className="text-sm font-medium text-zinc-600">היתרה שלך</p>
        <p className="mt-1 text-6xl font-bold text-brand-gold-dark">
          {trainee.points}
        </p>
        <p className="mt-1 text-sm text-zinc-500">⭐ נקודות Refaeli Cash</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">
          איך צוברים נקודות
        </h3>
        <div className="space-y-2">
          {EARNING_RULES.map((rule) => (
            <div
              key={rule.label}
              className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm"
            >
              <span className="text-zinc-700">{rule.label}</span>
              <span
                className="rounded-full bg-brand-gold-light px-2.5 py-0.5 text-xs font-bold text-brand-gold-dark"
                dir="ltr"
              >
                +{rule.points} נק'
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">
          חנות הפרסים
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {REWARDS.map((reward) => (
            <RewardCard
              key={reward.name}
              reward={reward}
              canAfford={trainee.points >= reward.cost}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">
          10 המובילים החודש
        </h3>
        <div className="space-y-1">
          {top10.map((t, i) => (
            <LeaderboardRow
              key={t.id}
              rank={i + 1}
              entry={t}
              isCurrent={t.id === trainee.id}
            />
          ))}
          {!isCurrentInTop10 && (
            <>
              <div className="my-2 border-t border-dashed border-zinc-200" />
              <LeaderboardRow
                rank={currentRank}
                entry={trainee}
                isCurrent
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
