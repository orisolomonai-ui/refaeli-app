import { useState } from "react";
import { motion } from "framer-motion";

const SUBSCRIPTION_OPTIONS = [
  "מנוי חודשי",
  "מנוי שנתי",
  "חבילת 10 אימונים",
  "חבילת 20 אימונים",
];

export default function EditTraineeModal({ trainee, onClose, onSave }) {
  const [name, setName] = useState(trainee.name);
  const [phone, setPhone] = useState(trainee.phone);
  const [subscriptionType, setSubscriptionType] = useState(
    trainee.subscriptionType
  );

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ name, phone, subscriptionType });
  }

  return (
    <motion.div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <div className="bg-brand-black px-5 py-4">
          <h3 className="text-base font-bold text-brand-gold">
            עריכת פרטי מתאמן
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              שם
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              טלפון
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              dir="ltr"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              סוג מנוי
            </label>
            <select
              value={subscriptionType}
              onChange={(e) => setSubscriptionType(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
            >
              {SUBSCRIPTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-black px-4 py-2 text-sm font-medium text-brand-gold hover:bg-brand-charcoal"
            >
              שמירה
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
