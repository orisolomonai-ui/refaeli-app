import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ArrowUpDown } from "lucide-react";
import { useCurrentTrainee, useTrainees } from "../../context/TraineesContext";
import { TraineePage } from "../../components/trainee-area/TraineeLayout";
import CoinChip from "../../components/trainee-area/CoinChip";
import RewardCard from "../../components/trainee-area/RewardCard";
import BenefitsBanner from "../../components/trainee-area/BenefitsBanner";
import Icon3D from "../../components/trainee-area/Icon3D";
import Sheet from "../../components/trainee-area/Sheet";
import EmptyState from "../../components/EmptyState";
import { EarningRulesList } from "../../components/cash/CashSections";
import { STORE_CATALOG, STORE_CATEGORIES } from "../../data/rewards";
import { staggerContainer, staggerItem } from "../../lib/motionVariants";

const SORTS = [
  { key: "default", label: "מומלץ" },
  { key: "cheap", label: "מחיר: מהזול ליקר" },
  { key: "expensive", label: "מחיר: מהיקר לזול" },
];

// שלושה פרסים בולטים לבאנר - מתוך STORE_CATALOG הקיים, מגוון קטגוריות/עלויות
const FEATURED_IDS = ["private-session", "tshirt", "discount-month"];
const FEATURED_REWARDS = FEATURED_IDS.map((id) =>
  STORE_CATALOG.find((r) => r.id === id)
).filter(Boolean);

export default function TraineeRewards() {
  const { redeem } = useTrainees();
  const trainee = useCurrentTrainee();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("הכל");
  const [sort, setSort] = useState("default");
  const [selected, setSelected] = useState(null);
  const [justRedeemed, setJustRedeemed] = useState(false);

  const purchasedIds = new Set(
    (trainee.purchasedRewards ?? []).map((p) => p.id)
  );

  const items = useMemo(() => {
    let list = STORE_CATALOG.filter((r) =>
      r.name.includes(search.trim())
    ).filter((r) => category === "הכל" || r.category === category);
    if (sort === "cheap") list = [...list].sort((a, b) => a.cost - b.cost);
    if (sort === "expensive") list = [...list].sort((a, b) => b.cost - a.cost);
    return list;
  }, [search, category, sort]);

  function handleRedeem() {
    redeem(trainee.id, selected);
    setJustRedeemed(true);
  }

  function closeSheet() {
    setSelected(null);
    setJustRedeemed(false);
  }

  return (
    <TraineePage>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">חנות ההטבות</h1>
        <CoinChip points={trainee.points} to={null} />
      </div>

      <BenefitsBanner items={FEATURED_REWARDS} onSelect={setSelected} />

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-brand-line bg-white px-3 py-2.5">
        <Search size={16} className="text-zinc-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש הטבה..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />
      </div>

      <div className="-mx-4 mb-1 flex gap-2 overflow-x-auto px-4 pb-1">
        {STORE_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-[0.96] ${
              category === c
                ? "border-brand-black bg-brand-black text-brand-gold"
                : "border-brand-line bg-white text-zinc-500"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-end">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="flex items-center gap-1 rounded-lg border border-brand-line bg-white px-2 py-1 text-xs text-zinc-500 outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <ArrowUpDown size={14} className="-ms-6 pointer-events-none text-zinc-400" />
      </div>

      {items.length === 0 ? (
        <EmptyState icon="🔍" message="לא נמצאו הטבות תואמות" />
      ) : (
        <motion.div
          key={`${category}-${sort}-${search}`}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {items.map((reward) => (
            <motion.div key={reward.id} variants={staggerItem}>
              <RewardCard
                reward={reward}
                purchased={purchasedIds.has(reward.id)}
                onClick={() => setSelected(reward)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="mt-5">
        <EarningRulesList />
      </div>

      <AnimatePresence>
        {selected && (
          <Sheet
            title={justRedeemed ? "מומש בהצלחה" : "פרטי ההטבה"}
            onClose={closeSheet}
          >
            {justRedeemed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-4 text-center"
              >
                <Icon3D name="confetti" size={64} />
                <p className="text-sm font-semibold text-zinc-800">
                  {selected.name} מומש בהצלחה!
                </p>
                <p className="text-xs text-zinc-500">
                  {selected.type === "pickup"
                    ? "אפשר לאסוף בסטודיו בביקור הבא"
                    : "ההטבה תופעל אוטומטית"}
                </p>
                <button
                  onClick={closeSheet}
                  className="mt-2 w-full rounded-xl bg-brand-black py-3 text-sm font-bold text-brand-gold transition active:scale-[0.98]"
                >
                  סגירה
                </button>
              </motion.div>
            ) : (
              <div>
                <div className="trainee-bg mb-4 flex h-32 items-center justify-center rounded-2xl">
                  <Icon3D name={selected.icon3d} size={72} />
                </div>
                <p className="text-lg font-bold text-zinc-900">
                  {selected.name}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {selected.description}
                </p>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2.5">
                  <span className="text-sm text-zinc-500">עלות</span>
                  <span className="flex items-center gap-1 text-base font-bold text-brand-gold-dark">
                    <Icon3D name="coin" size={18} />
                    {selected.cost}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2.5">
                  <span className="text-sm text-zinc-500">היתרה שלך</span>
                  <span className="text-sm font-semibold text-zinc-700">
                    {trainee.points}
                  </span>
                </div>
                <button
                  onClick={handleRedeem}
                  disabled={trainee.points < selected.cost}
                  className="mt-4 w-full rounded-xl bg-brand-black py-3.5 text-sm font-bold text-brand-gold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 disabled:active:scale-100"
                >
                  {trainee.points < selected.cost
                    ? "אין מספיק נקודות"
                    : "מימוש ההטבה"}
                </button>
              </div>
            )}
          </Sheet>
        )}
      </AnimatePresence>
    </TraineePage>
  );
}
