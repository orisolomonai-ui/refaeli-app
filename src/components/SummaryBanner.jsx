import { daysSince } from "../lib/utils";

export default function SummaryBanner({ trainees }) {
  const unpaidCount = trainees.filter(
    (t) => t.paymentStatus === "unpaid"
  ).length;
  const noSessionsCount = trainees.filter(
    (t) => t.sessionsRemaining === 0
  ).length;
  const inactiveCount = trainees.filter(
    (t) => daysSince(t.lastSessionDate) > 14
  ).length;

  const stats = [
    { label: "לא שילמו החודש", value: unpaidCount },
    { label: "נגמרו להם האימונים", value: noSessionsCount },
    { label: "לא התאמנו מעל שבועיים", value: inactiveCount },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 divide-y divide-brand-gold/20 overflow-hidden rounded-2xl bg-brand-black sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-x-reverse">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center gap-1 px-6 py-5 text-center"
        >
          <span className="text-3xl font-bold text-brand-gold">
            {s.value}
          </span>
          <span className="text-xs font-medium text-zinc-300">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
