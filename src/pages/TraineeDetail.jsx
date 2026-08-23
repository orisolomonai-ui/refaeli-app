import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTrainees } from "../context/TraineesContext";
import Avatar from "../components/Avatar";
import EditTraineeModal from "../components/EditTraineeModal";
import EmptyState from "../components/EmptyState";
import StatusTab from "../components/trainee-detail/StatusTab";
import ProgressTab from "../components/trainee-detail/ProgressTab";
import HistoryTab from "../components/trainee-detail/HistoryTab";
import RefaeliCashTab from "../components/trainee-detail/RefaeliCashTab";

const TABS = [
  { key: "status", label: "סטטוס" },
  { key: "progress", label: "התקדמות" },
  { key: "history", label: "היסטוריה" },
  { key: "cash", label: "Refaeli Cash" },
];

const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18, ease: "easeOut" },
};

export default function TraineeDetail() {
  const { id } = useParams();
  const { trainees, getTraineeById, markAsPaid, addSession, updateTrainee } =
    useTrainees();
  const trainee = getTraineeById(id);
  const [activeTab, setActiveTab] = useState("status");
  const [isEditing, setIsEditing] = useState(false);

  if (!trainee) {
    return (
      <motion.div {...pageMotion}>
        <EmptyState icon="🔎" message="מתאמן לא נמצא" />
        <Link
          to="/"
          className="mt-4 inline-block text-sm font-medium text-brand-gold-dark hover:underline"
        >
          חזרה לדשבורד
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div {...pageMotion}>
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-brand-gold-dark"
      >
        → חזרה לדשבורד
      </Link>

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={trainee.name} size="md" />
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {trainee.name}
            </h1>
            <p className="text-sm text-zinc-500">{trainee.phone}</p>
            <p className="text-xs text-zinc-500">{trainee.subscriptionType}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {trainee.paymentStatus !== "paid" && (
            <button
              onClick={() => markAsPaid(trainee.id)}
              className="rounded-lg bg-brand-gold px-3 py-2 text-sm font-semibold text-brand-black hover:bg-brand-gold-dark"
            >
              ✓ סמן כשולם
            </button>
          )}
          <button
            onClick={() => addSession(trainee.id)}
            disabled={trainee.sessionsRemaining === 0}
            className="rounded-lg border border-brand-gold/40 px-3 py-2 text-sm font-semibold text-brand-gold-dark hover:bg-brand-gold-light/40 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-300 disabled:hover:bg-transparent"
          >
            + הוסף אימון
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50"
          >
            ✎ ערוך
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg bg-zinc-100 p-1 sm:w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-brand-black text-brand-gold shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === "status" && <StatusTab trainee={trainee} />}
          {activeTab === "progress" && (
            <ProgressTab progress={trainee.progress} />
          )}
          {activeTab === "history" && <HistoryTab trainee={trainee} />}
          {activeTab === "cash" && (
            <RefaeliCashTab trainee={trainee} trainees={trainees} />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isEditing && (
          <EditTraineeModal
            trainee={trainee}
            onClose={() => setIsEditing(false)}
            onSave={(updates) => {
              updateTrainee(trainee.id, updates);
              setIsEditing(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
