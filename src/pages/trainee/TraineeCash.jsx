import { Link } from "react-router-dom";
import { useCurrentTrainee } from "../../context/TraineesContext";
import { TraineePage } from "../../components/trainee-area/TraineeLayout";
import { NextRewardLine } from "../../components/trainee-area/Summaries";
import {
  BalanceCard,
  EarningRulesList,
} from "../../components/cash/CashSections";

export default function TraineeCash() {
  const trainee = useCurrentTrainee();

  return (
    <TraineePage>
      <h1 className="mb-4 text-2xl font-bold text-white">Refaeli Cash</h1>
      <div className="space-y-4">
        <BalanceCard points={trainee.points} tone="dark">
          <NextRewardLine points={trainee.points} className="mt-4" />
        </BalanceCard>
        <EarningRulesList tone="dark" />
        <Link
          to="/me/store"
          className="block rounded-xl bg-brand-gold py-3 text-center text-sm font-bold text-brand-black"
        >
          לחנות הפרסים
        </Link>
      </div>
    </TraineePage>
  );
}
