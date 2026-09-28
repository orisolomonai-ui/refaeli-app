import { useCurrentTrainee, useTrainees } from "../../context/TraineesContext";
import { TraineePage } from "../../components/trainee-area/TraineeLayout";
import { CommunitySummary } from "../../components/trainee-area/Summaries";
import { Leaderboard } from "../../components/cash/CashSections";

export default function TraineeCommunity() {
  const { trainees } = useTrainees();
  const trainee = useCurrentTrainee();

  return (
    <TraineePage>
      <h1 className="mb-4 text-2xl font-bold text-white">הקהילה</h1>
      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-gold/20 bg-brand-charcoal p-5">
          <CommunitySummary trainee={trainee} trainees={trainees} />
        </div>
        <Leaderboard
          trainees={trainees}
          currentTrainee={trainee}
          tone="dark"
        />
      </div>
    </TraineePage>
  );
}
