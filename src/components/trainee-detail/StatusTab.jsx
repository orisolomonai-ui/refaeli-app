import StatusBadge from "../StatusBadge";
import { isLowSessions } from "../../lib/utils";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("he-IL");
}

export default function StatusTab({ trainee }) {
  const sessionsPct = Math.round(
    (trainee.sessionsRemaining / trainee.totalSessions) * 100
  );
  const lowSessions = isLowSessions(trainee);
  const isUnpaid = trainee.paymentStatus === "unpaid";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-700">תשלום</h3>
          <StatusBadge status={trainee.paymentStatus} />
        </div>
        <p className="text-xs text-zinc-500">תשלום אחרון</p>
        <p className="mb-3 text-lg font-bold text-zinc-900">
          {formatDate(trainee.lastPaymentDate)}
        </p>
        <p className="text-xs text-zinc-500">סוג מנוי</p>
        <p className="mb-3 text-lg font-bold text-zinc-900">
          {trainee.subscriptionType}
        </p>
        {isUnpaid && (
          <p className="text-sm font-bold text-red-600">
            חוב פתוח: <span dir="ltr">₪{trainee.price}</span>
          </p>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">אימונים</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">נותרו</span>
          <span
            className={`font-bold ${
              lowSessions ? "text-red-600" : "text-zinc-900"
            }`}
            dir="ltr"
          >
            {trainee.sessionsRemaining} / {trainee.totalSessions}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full rounded-full ${
              lowSessions ? "bg-red-500" : "bg-brand-gold"
            }`}
            style={{ width: `${sessionsPct}%` }}
          />
        </div>
        {lowSessions && (
          <p className="mt-2 text-xs font-medium text-red-600">
            ⚠ נותרו רק {trainee.sessionsRemaining} אימונים
          </p>
        )}
        <p className="mt-3 text-xs text-zinc-500">אימון אחרון</p>
        <p className="text-sm font-semibold text-zinc-800">
          {formatDate(trainee.lastSessionDate)}
        </p>
      </div>

      <div className="rounded-xl border border-brand-gold/30 bg-brand-gold-light/30 p-5 text-center">
        <h3 className="mb-2 text-sm font-semibold text-zinc-700">
          Refaeli Cash
        </h3>
        <p className="text-4xl font-bold text-brand-gold-dark">
          {trainee.points}
        </p>
        <p className="mt-1 text-xs text-zinc-500">נקודות זכות</p>
      </div>
    </div>
  );
}
