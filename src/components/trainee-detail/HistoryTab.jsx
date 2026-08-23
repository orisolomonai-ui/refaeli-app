import EmptyState from "../EmptyState";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("he-IL");
}

const EVENT_STYLES = {
  payment: { dot: "bg-brand-gold", icon: "₪" },
  session: { dot: "border-2 border-brand-gold bg-brand-black", icon: "🏋" },
  measurement: { dot: "bg-zinc-400", icon: "📏" },
};

function buildEvents(trainee) {
  const events = [];

  for (const p of trainee.paymentHistory) {
    events.push({
      type: "payment",
      date: p.date,
      prefix: "תשלום התקבל",
      suffix: `₪${p.amount}`,
    });
  }
  for (const s of trainee.sessionHistory) {
    events.push({
      type: "session",
      date: s.date,
      prefix: "אימון בוצע",
      suffix: null,
    });
  }
  for (const m of trainee.progress.weightHistory) {
    events.push({
      type: "measurement",
      date: m.date,
      prefix: "עדכון מדידה",
      suffix: `${m.value} ק"ג`,
    });
  }

  return events.sort((a, b) => b.date.localeCompare(a.date));
}

export default function HistoryTab({ trainee }) {
  const events = buildEvents(trainee);

  if (events.length === 0) {
    return <EmptyState icon="🕓" message="אין היסטוריה עדיין" />;
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <ol className="relative space-y-5 border-e-2 border-zinc-100 pe-5">
        {events.map((e, i) => {
          const style = EVENT_STYLES[e.type];
          return (
            <li key={i} className="relative">
              <span
                className={`absolute top-0.5 -end-[26px] flex h-3.5 w-3.5 items-center justify-center rounded-full ${style.dot}`}
              />
              <p className="text-sm font-semibold text-zinc-800">
                {e.prefix}
                {e.suffix && (
                  <>
                    {" · "}
                    <span dir="ltr">{e.suffix}</span>
                  </>
                )}
              </p>
              <p className="text-xs text-zinc-500">{formatDate(e.date)}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
