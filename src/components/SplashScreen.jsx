import { motion } from "framer-motion";
import Logo from "./trainee-area/Logo";
import Icon3D from "./trainee-area/Icon3D";

const HIGHLIGHTS = [
  { icon: "gift", label: "הטבות" },
  { icon: "coin", label: "נקודות" },
  { icon: "shoe", label: "אימונים" },
];

export default function SplashScreen({ onEnterTrainee, onEnterAdmin }) {
  return (
    <motion.div
      className="trainee-bg fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden px-6 py-12"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mt-10 flex flex-col items-center gap-6"
      >
        <Logo size={140} variant="full" />
        <div className="text-center">
          <p className="text-xl font-medium text-zinc-500">המסע שלך</p>
          <h1 className="text-3xl font-bold text-brand-gold-dark">
            מתחיל כאן
          </h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="flex items-start justify-center gap-10"
      >
        {HIGHLIGHTS.map((h) => (
          <div key={h.label} className="flex flex-col items-center gap-2">
            <Icon3D name={h.icon} size={48} />
            <span className="text-sm font-medium text-zinc-600">
              {h.label}
            </span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        className="flex w-full max-w-xs flex-col items-center gap-3"
      >
        <motion.button
          onClick={onEnterTrainee}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-2xl bg-brand-black py-4 text-base font-bold text-brand-gold shadow-lg"
        >
          כניסת מתאמן
        </motion.button>
        <motion.button
          onClick={onEnterAdmin}
          whileTap={{ scale: 0.97 }}
          className="rounded-full px-6 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-600"
        >
          כניסת מנהל
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
