import { useCurrentTrainee } from "../../context/TraineesContext";
import { TraineePage } from "../../components/trainee-area/TraineeLayout";
import { WeightSummary } from "../../components/trainee-area/Summaries";
import ProgressTab from "../../components/trainee-detail/ProgressTab";

export default function TraineeProgress() {
  const trainee = useCurrentTrainee();

  return (
    <TraineePage>
      <h1 className="mb-4 text-2xl font-bold text-white">ההתקדמות שלי</h1>
      <div className="mb-4 rounded-2xl border border-brand-gold/20 bg-brand-charcoal p-5">
        <WeightSummary trainee={trainee} />
      </div>
      <ProgressTab progress={trainee.progress} />
    </TraineePage>
  );
}
