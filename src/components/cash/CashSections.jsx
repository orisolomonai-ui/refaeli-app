// קטעי ה-Refaeli Cash (יתרה, איך צוברים, חנות, ליגה) — משמשים גם בלשונית של המנהל
// (tone="light", המראה המקורי) וגם באזור המתאמן (tone="dark").
import { useState } from "react";
import { motion } from "framer-motion";
import Avatar from "../Avatar";
import { EARNING_RULES, REWARDS } from "../../data/rewards";
import { rankChange, rankedByPoints, rankOf } from "../../lib/traineeSelectors";
import { staggerContainer, staggerItem } from "../../lib/motionVariants";

const THEME = {
  light: {
    panel: "rounded-xl border border-zinc-200 bg-white p-5",
    panelTitle: "text-zinc-700",
    balanceCard:
      "rounded-2xl border border-brand-gold/30 bg-brand-gold-light/30 p-8 text-center",
    balanceLabel: "text-zinc-600",
    balanceNumber: "text-brand-gold-dark",
    balanceSub: "text-zinc-500",
    ruleRow: "bg-zinc-50",
    ruleLabel: "text-zinc-700",
    ruleBadge: "bg-brand-gold-light text-brand-gold-dark",
    rewardCard: "border-zinc-200 bg-white",
    rewardName: "text-zinc-800",
    rewardCost: "text-brand-gold-dark",
    redeemDone: "bg-emerald-50 text-emerald-700",
    redeemOk: "bg-brand-black text-brand-gold hover:bg-brand-charcoal",
    redeemNo: "cursor-not-allowed bg-zinc-100 text-zinc-400",
    rowCurrent: "border border-brand-gold bg-brand-gold-light/40",
    rank: "text-zinc-500",
    name: "text-zinc-800",
    accent: "text-brand-gold-dark",
    divider: "border-zinc-200",
  },
  dark: {
    panel: "rounded-xl border border-brand-gold/20 bg-brand-charcoal p-5",
    panelTitle: "text-zinc-300",
    balanceCard:
      "rounded-2xl border border-brand-gold/30 bg-brand-charcoal p-8 text-center",
    balanceLabel: "text-zinc-400",
    balanceNumber: "text-brand-gold",
    balanceSub: "text-zinc-400",
    ruleRow: "bg-black/30",
    ruleLabel: "text-zinc-200",
    ruleBadge: "bg-brand-gold/15 text-brand-gold",
    rewardCard: "border-brand-gold/20 bg-brand-charcoal",
    rewardName: "text-zinc-100",
    rewardCost: "text-brand-gold",
    redeemDone: "bg-emerald-500/15 text-emerald-400",
    redeemOk: "bg-brand-gold text-brand-black hover:bg-brand-gold-dark",
    redeemNo: "cursor-not-allowed bg-zinc-800 text-zinc-500",
    rowCurrent: "border border-brand-gold bg-brand-gold/10",
    rank: "text-zinc-400",
    name: "text-zinc-100",
    accent: "text-brand-gold",
    divider: "border-zinc-700",
  },
};

export function Panel({ title, tone = "light", children }) {
  const t = THEME[tone];
  return (
    <div className={t.panel}>
      <h3 className={`mb-3 text-sm font-semibold ${t.panelTitle}`}>{title}</h3>
      {children}
    </div>
  );
}

export function BalanceCard({ points, tone = "light", children }) {
  const t = THEME[tone];
  return (
    <div className={t.balanceCard}>
      <p className={`text-sm font-medium ${t.balanceLabel}`}>היתרה שלך</p>
      <p className={`mt-1 text-6xl font-bold ${t.balanceNumber}`}>{points}</p>
      <p className={`mt-1 text-sm ${t.balanceSub}`}>⭐ נקודות Refaeli Cash</p>
      {children}
    </div>
  );
}

export function EarningRulesList({ tone = "light" }) {
  const t = THEME[tone];
  return (
    <Panel title="איך צוברים נקודות" tone={tone}>
      <div className="space-y-2">
        {EARNING_RULES.map((rule) => (
          <div
            key={rule.label}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${t.ruleRow}`}
          >
            <span className={t.ruleLabel}>{rule.label}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${t.ruleBadge}`}
            >
              {/* רק הטוקן עם הסימן מבודד; היחידה נשארת בזרימת ה-RTL */}
              <span dir="ltr" className="inline-block">
                +{rule.points}
              </span>{" "}
              נק'
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function RewardCard({ reward, canAfford, tone = "light" }) {
  const t = THEME[tone];
  const [redeemed, setRedeemed] = useState(false);

  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center ${t.rewardCard}`}
    >
      <span className="text-3xl">{reward.icon}</span>
      <p className={`text-sm font-semibold ${t.rewardName}`}>{reward.name}</p>
      <p className={`text-sm font-bold ${t.rewardCost}`}>{reward.cost} נק'</p>
      <button
        onClick={() => setRedeemed(true)}
        disabled={!canAfford || redeemed}
        className={`mt-1 w-full rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
          redeemed ? t.redeemDone : canAfford ? t.redeemOk : t.redeemNo
        }`}
      >
        {redeemed ? "✓ מומש (הדגמה)" : "מימוש"}
      </button>
    </div>
  );
}

export function RewardsGrid({
  points,
  tone = "light",
  columnsClass = "grid-cols-2 sm:grid-cols-4",
}) {
  return (
    <Panel title="חנות הפרסים" tone={tone}>
      <div className={`grid gap-3 ${columnsClass}`}>
        {REWARDS.map((reward) => (
          <RewardCard
            key={reward.name}
            reward={reward}
            canAfford={points >= reward.cost}
            tone={tone}
          />
        ))}
      </div>
    </Panel>
  );
}

function LeaderboardRow({ rank, entry, isCurrent, tone, change }) {
  const t = THEME[tone];
  const arrow = change > 0 ? "up" : change < 0 ? "down" : null;
  return (
    <motion.div
      layout
      variants={staggerItem}
      transition={{ layout: { duration: 0.3, ease: "easeOut" } }}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
        isCurrent ? t.rowCurrent : ""
      }`}
    >
      <motion.span
        layout="position"
        className={`w-6 shrink-0 text-center text-sm font-bold ${t.rank}`}
        dir="ltr"
      >
        {rank}
      </motion.span>
      {/* חץ שינוי דירוג - מוצג רק כשיש שינוי; קפיצת opacity/scale קטנה כשהוא
          מופיע/מתעדכן (ה-key כולל את rank כדי לרענן את האנימציה בשינוי דירוג) */}
      <motion.span
        key={`${entry.id}-${rank}-${arrow ?? "same"}`}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`-me-1 w-3 shrink-0 text-xs font-bold ${
          arrow === "up" ? "text-emerald-500" : arrow === "down" ? "text-red-500" : ""
        }`}
      >
        {arrow === "up" ? "▲" : arrow === "down" ? "▼" : ""}
      </motion.span>
      <Avatar name={entry.name} size="sm" />
      <span className={`flex-1 truncate text-sm font-semibold ${t.name}`}>
        {entry.name}
        {isCurrent && (
          <span className={`ms-1 text-xs font-normal ${t.accent}`}>(אתה)</span>
        )}
      </span>
      <span className={`text-sm font-bold ${t.accent}`} dir="ltr">
        {entry.points}
      </span>
    </motion.div>
  );
}

export function Leaderboard({
  trainees,
  currentTrainee,
  tone = "light",
  title = "10 המובילים החודש",
}) {
  const t = THEME[tone];
  const ranked = rankedByPoints(trainees);
  const currentRank = rankOf(trainees, currentTrainee.id);
  const top10 = ranked.slice(0, 10);

  return (
    <Panel title={title} tone={tone}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-1"
      >
        {top10.map((entry, i) => (
          <LeaderboardRow
            key={entry.id}
            rank={i + 1}
            entry={entry}
            isCurrent={entry.id === currentTrainee.id}
            tone={tone}
            change={rankChange(trainees, entry)}
          />
        ))}
        {currentRank > 10 && (
          <>
            <div className={`my-2 border-t border-dashed ${t.divider}`} />
            <LeaderboardRow
              rank={currentRank}
              entry={currentTrainee}
              isCurrent
              tone={tone}
              change={rankChange(trainees, currentTrainee)}
            />
          </>
        )}
      </motion.div>
    </Panel>
  );
}
