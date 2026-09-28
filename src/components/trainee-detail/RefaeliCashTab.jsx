import {
  BalanceCard,
  EarningRulesList,
  RewardsGrid,
  Leaderboard,
} from "../cash/CashSections";

export default function RefaeliCashTab({ trainee, trainees }) {
  return (
    <div className="space-y-4">
      <BalanceCard points={trainee.points} />
      <EarningRulesList />
      <RewardsGrid points={trainee.points} />
      <Leaderboard trainees={trainees} currentTrainee={trainee} />
    </div>
  );
}
