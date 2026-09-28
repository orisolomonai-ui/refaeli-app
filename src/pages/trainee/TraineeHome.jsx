import { useCurrentTrainee, useTrainees } from "../../context/TraineesContext";
import { TraineePage } from "../../components/trainee-area/TraineeLayout";
import HomeCard from "../../components/trainee-area/HomeCard";
import {
  CommunitySummary,
  NextRewardLine,
  WeightSummary,
} from "../../components/trainee-area/Summaries";
import { sessionsThisMonth } from "../../lib/traineeSelectors";
import { REWARDS } from "../../data/rewards";

const PREVIEW_REWARDS = REWARDS.slice(0, 3);

function sessionsLine(n) {
  if (n === 0) return "עדיין לא התאמנת החודש";
  if (n === 1) return "אימון אחד החודש";
  return `${n} אימונים החודש`;
}

export default function TraineeHome() {
  const { trainees } = useTrainees();
  const trainee = useCurrentTrainee();
  const firstName = trainee.name.split(" ")[0];

  return (
    <TraineePage>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">היי {firstName} 👋</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {sessionsLine(sessionsThisMonth(trainee))}
        </p>
      </header>

      <div className="space-y-4">
        <HomeCard to="/me/progress" title="ההתקדמות שלי" icon="📈">
          <WeightSummary trainee={trainee} showSparkline />
        </HomeCard>

        <HomeCard to="/me/cash" title="Refaeli Cash" icon="⭐">
          <p>
            <span
              dir="ltr"
              className="inline-block text-5xl font-bold text-brand-gold"
            >
              {trainee.points}
            </span>
          </p>
          <NextRewardLine points={trainee.points} className="mt-2" />
        </HomeCard>

        <HomeCard to="/me/community" title="הקהילה" icon="🏆">
          <CommunitySummary trainee={trainee} trainees={trainees} />
        </HomeCard>

        <HomeCard to="/me/store" title="החנות" icon="🎁">
          <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1">
            {PREVIEW_REWARDS.map((reward) => (
              <div
                key={reward.name}
                className="w-32 shrink-0 snap-start rounded-xl border border-brand-gold/20 bg-black/30 p-3 text-center"
              >
                <div className="text-2xl">{reward.icon}</div>
                <p className="mt-1 line-clamp-2 min-h-8 text-xs font-semibold text-zinc-100">
                  {reward.name}
                </p>
                <p className="mt-1 text-xs font-bold text-brand-gold">
                  {reward.cost} נק'
                </p>
              </div>
            ))}
          </div>
          <span className="mt-4 block rounded-xl bg-brand-gold py-2.5 text-center text-sm font-bold text-brand-black">
            לכל החנות
          </span>
        </HomeCard>
      </div>
    </TraineePage>
  );
}
