import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useCurrentTrainee } from "../../context/TraineesContext";
import { TraineePage } from "../../components/trainee-area/TraineeLayout";
import Avatar from "../../components/Avatar";
import StatusBadge from "../../components/StatusBadge";
import Icon3D from "../../components/trainee-area/Icon3D";
import Sheet from "../../components/trainee-area/Sheet";
import EmptyState from "../../components/EmptyState";
import HistoryTab from "../../components/trainee-detail/HistoryTab";
import { staggerContainer, staggerItem } from "../../lib/motionVariants";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("he-IL");
}

function MoreRow({ icon3d, label, onClick, to }) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <Icon3D name={icon3d} size={28} />
        <span className="text-sm font-semibold text-zinc-800">{label}</span>
      </div>
      <ChevronLeft size={16} className="text-zinc-300" />
    </>
  );
  const className =
    "flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition active:scale-[0.98]";
  return to ? (
    <Link to={to} className={className}>
      {content}
    </Link>
  ) : (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function PurchasedRewardsSheet({ trainee, onClose }) {
  const purchased = trainee.purchasedRewards ?? [];
  return (
    <Sheet title="ההטבות שרכשת" onClose={onClose}>
      {purchased.length === 0 ? (
        <EmptyState icon="🎁" message="עדיין לא מימשת הטבות" compact />
      ) : (
        <ul className="space-y-2">
          {[...purchased].reverse().map((p, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-xl bg-zinc-50 p-3"
            >
              <span className="text-sm font-semibold text-zinc-800">
                {p.name}
              </span>
              <span className="text-xs text-zinc-400">
                {formatDate(p.date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}

function ReferralSheet({ onClose }) {
  return (
    <Sheet title="חבר מביא חבר" onClose={onClose}>
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <Icon3D name="handshake" size={64} />
        <p className="text-sm text-zinc-600">
          הזמינו חבר/ה חדש/ה למועדון וקבלו <b>100 נק' Refaeli Cash</b> לאחר
          האימון הראשון שלהם
        </p>
        <button className="mt-2 w-full rounded-xl bg-brand-black py-3 text-sm font-bold text-brand-gold transition active:scale-[0.98]">
          שליחת הזמנה (הדגמה)
        </button>
      </div>
    </Sheet>
  );
}

function MembershipSheet({ trainee, onClose }) {
  return (
    <Sheet title="המנוי שלי" onClose={onClose}>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-3">
          <span className="text-sm text-zinc-500">סוג מנוי</span>
          <span className="text-sm font-semibold text-zinc-800">
            {trainee.subscriptionType}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-3">
          <span className="text-sm text-zinc-500">סטטוס תשלום</span>
          <StatusBadge status={trainee.paymentStatus} />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-3">
          <span className="text-sm text-zinc-500">אימונים שנותרו</span>
          <span dir="ltr" className="text-sm font-semibold text-zinc-800">
            {trainee.sessionsRemaining} / {trainee.totalSessions}
          </span>
        </div>
      </div>
    </Sheet>
  );
}

export default function TraineeMore() {
  const trainee = useCurrentTrainee();
  const [sheet, setSheet] = useState(null); // "activity" | "rewards" | "referral" | "membership"

  return (
    <TraineePage>
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <Avatar name={trainee.name} size="md" />
        <div>
          <p className="text-base font-bold text-zinc-900">{trainee.name}</p>
          <p className="text-xs text-zinc-500">{trainee.phone}</p>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-2.5"
      >
        <motion.div variants={staggerItem}>
          <MoreRow
            icon3d="calendar"
            label="ציר הפעילות שלי"
            onClick={() => setSheet("activity")}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <MoreRow
            icon3d="chart_increasing"
            label="התקדמות ותמונות"
            to="/me/performance"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <MoreRow
            icon3d="gift"
            label="ההטבות שרכשת"
            onClick={() => setSheet("rewards")}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <MoreRow
            icon3d="handshake"
            label="חבר מביא חבר"
            onClick={() => setSheet("referral")}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <MoreRow
            icon3d="idcard"
            label="המנוי שלי"
            onClick={() => setSheet("membership")}
          />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {sheet === "activity" && (
          <Sheet title="ציר הפעילות שלי" onClose={() => setSheet(null)}>
            <div className="max-h-[60vh] overflow-y-auto">
              <HistoryTab trainee={trainee} />
            </div>
          </Sheet>
        )}
        {sheet === "rewards" && (
          <PurchasedRewardsSheet
            trainee={trainee}
            onClose={() => setSheet(null)}
          />
        )}
        {sheet === "referral" && (
          <ReferralSheet onClose={() => setSheet(null)} />
        )}
        {sheet === "membership" && (
          <MembershipSheet trainee={trainee} onClose={() => setSheet(null)} />
        )}
      </AnimatePresence>
    </TraineePage>
  );
}
