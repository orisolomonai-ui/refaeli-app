import { useCurrentTrainee, useTrainees } from "../../context/TraineesContext";
import { TraineePage } from "../../components/trainee-area/TraineeLayout";
import Avatar from "../../components/Avatar";
import Icon3D from "../../components/trainee-area/Icon3D";
import { Bar } from "../../components/trainee-area/Summaries";
import { Leaderboard } from "../../components/cash/CashSections";
import {
  CHALLENGE_TARGET,
  monthName,
  rankedByPoints,
  sessionsThisMonth,
} from "../../lib/traineeSelectors";

const PODIUM_ORDER = [2, 1, 3]; // מציגים שני-ראשון-שלישי כדי שהראשון יהיה במרכז
const PODIUM_HEIGHT = { 1: "h-24", 2: "h-16", 3: "h-12" };
const PODIUM_ICON = { 1: "crown", 2: "medal", 3: "medal" };

function PodiumSpot({ place, entry }) {
  if (!entry) return <div className="flex-1" />;
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5">
      <Icon3D name={PODIUM_ICON[place]} size={place === 1 ? 30 : 24} />
      <Avatar name={entry.name} size="sm" />
      <p className="max-w-[72px] truncate text-xs font-semibold text-zinc-800">
        {entry.name.split(" ")[0]}
      </p>
      <p className="text-[11px] font-bold text-brand-gold-dark">
        {entry.points}
      </p>
      <div
        className={`w-full rounded-t-lg bg-gradient-to-b from-brand-gold-light to-brand-gold/40 ${PODIUM_HEIGHT[place]}`}
      />
    </div>
  );
}

export default function TraineeGroups() {
  const { trainees } = useTrainees();
  const trainee = useCurrentTrainee();
  const ranked = rankedByPoints(trainees);
  const top3 = { 1: ranked[0], 2: ranked[1], 3: ranked[2] };
  const monthDone = sessionsThisMonth(trainee);

  return (
    <TraineePage>
      <h1 className="mb-4 text-xl font-bold text-zinc-900">הקהילה שלי</h1>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-700">
            אתגר {monthName()}
          </span>
          <span dir="ltr" className="text-sm font-bold text-brand-gold-dark">
            {Math.min(monthDone, CHALLENGE_TARGET)}/{CHALLENGE_TARGET}
          </span>
        </div>
        <Bar pct={Math.min(1, monthDone / CHALLENGE_TARGET)} />
        <p className="mt-2 text-xs text-zinc-500">אימונים החודש - כל הסטודיו יחד</p>
      </div>

      <div className="mt-4 flex items-end gap-2 rounded-2xl bg-white p-4 pt-6 shadow-sm">
        {PODIUM_ORDER.map((place) => (
          <PodiumSpot key={place} place={place} entry={top3[place]} />
        ))}
      </div>

      <div className="mt-4">
        <Leaderboard
          trainees={trainees}
          currentTrainee={trainee}
          title="הדירוג המלא"
        />
      </div>
    </TraineePage>
  );
}
