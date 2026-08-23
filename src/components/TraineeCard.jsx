import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import Avatar from "./Avatar";
import { isLowSessions } from "../lib/utils";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("he-IL");
}

export default function TraineeCard({ trainee }) {
  const sessionsPct = Math.round(
    (trainee.sessionsRemaining / trainee.totalSessions) * 100
  );
  const lowSessions = isLowSessions(trainee);

  return (
    <Link
      to={`/trainee/${trainee.id}`}
      className="group block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-gold/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <Avatar name={trainee.name} size="sm" />
          <div>
            <h3 className="text-base font-bold text-zinc-900 group-hover:text-brand-gold-dark">
              {trainee.name}
            </h3>
            <p className="text-sm text-zinc-500">{trainee.phone}</p>
          </div>
        </div>
        <StatusBadge status={trainee.paymentStatus} />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">אימונים שנותרו</span>
          <span
            className={`font-semibold ${
              lowSessions ? "text-red-600" : "text-zinc-800"
            }`}
            dir="ltr"
          >
            {trainee.sessionsRemaining} / {trainee.totalSessions}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full rounded-full ${
              lowSessions ? "bg-red-500" : "bg-brand-gold"
            }`}
            style={{ width: `${sessionsPct}%` }}
          />
        </div>
        {lowSessions && (
          <p className="text-xs font-medium text-red-600">
            ⚠ נותרו רק {trainee.sessionsRemaining} אימונים
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-sm">
        <span className="text-zinc-500">
          אימון אחרון: {formatDate(trainee.lastSessionDate)}
        </span>
        <span className="flex items-center gap-1 font-semibold text-brand-gold-dark">
          {trainee.points} ⭐
        </span>
      </div>
    </Link>
  );
}
