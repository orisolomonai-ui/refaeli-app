import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import TraineeCard from "../components/TraineeCard";
import SummaryBanner from "../components/SummaryBanner";
import EmptyState from "../components/EmptyState";
import { isLowSessions } from "../lib/utils";
import { useTrainees } from "../context/TraineesContext";

const FILTERS = [
  { key: "all", label: "הכל" },
  { key: "paid", label: "שולם" },
  { key: "unpaid", label: "לא שולם" },
];

const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18, ease: "easeOut" },
};

export default function Dashboard() {
  const { trainees } = useTrainees();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [lowSessionsOnly, setLowSessionsOnly] = useState(false);

  const filteredTrainees = useMemo(() => {
    return trainees.filter((t) => {
      const matchesSearch = t.name.includes(search.trim());
      const matchesFilter = filter === "all" || t.paymentStatus === filter;
      const matchesLowSessions = !lowSessionsOnly || isLowSessions(t);
      return matchesSearch && matchesFilter && matchesLowSessions;
    });
  }, [search, filter, lowSessionsOnly]);

  return (
    <motion.div {...pageMotion}>
      <SummaryBanner trainees={trainees} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">מתאמנים</h1>
          <p className="text-sm text-zinc-500">
            {trainees.length} מתאמנים במערכת
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם..."
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 sm:w-64"
          />
          <div className="flex gap-1 rounded-lg bg-zinc-100 p-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  filter === f.key
                    ? "bg-brand-black text-brand-gold shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setLowSessionsOnly((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              lowSessionsOnly
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-zinc-200 bg-white text-zinc-500 hover:text-zinc-700"
            }`}
          >
            ⚠ אימונים נמוכים
          </button>
        </div>
      </div>

      {filteredTrainees.length === 0 ? (
        <EmptyState icon="🔍" message="לא נמצאו מתאמנים תואמים" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTrainees.map((trainee) => (
            <TraineeCard key={trainee.id} trainee={trainee} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
