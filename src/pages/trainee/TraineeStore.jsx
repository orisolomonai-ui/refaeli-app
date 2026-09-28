import { useCurrentTrainee } from "../../context/TraineesContext";
import { TraineePage } from "../../components/trainee-area/TraineeLayout";
import { NextRewardLine } from "../../components/trainee-area/Summaries";
import { RewardsGrid } from "../../components/cash/CashSections";

export default function TraineeStore() {
  const trainee = useCurrentTrainee();

  return (
    <TraineePage>
      <h1 className="mb-1 text-2xl font-bold text-white">החנות</h1>
      <p className="mb-4 text-sm text-zinc-400">
        היתרה שלך:{" "}
        <span className="font-semibold text-brand-gold">
          {trainee.points} נק'
        </span>
      </p>
      <RewardsGrid
        points={trainee.points}
        tone="dark"
        columnsClass="grid-cols-2"
      />
      <NextRewardLine points={trainee.points} className="mt-4 text-center" />
    </TraineePage>
  );
}
