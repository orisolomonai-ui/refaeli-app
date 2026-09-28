import { motion } from "framer-motion";

export default function SplashScreen({ onEnterTrainee, onEnterAdmin }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-brand-black px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-gold text-4xl font-bold text-brand-black">
          רפ
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-gold">Refaeli</h1>
          <p className="mt-1 text-sm tracking-widest text-white/70">
            FITNESS STUDIO
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
        className="flex w-full max-w-xs flex-col items-center gap-3"
      >
        <motion.button
          onClick={onEnterTrainee}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-full bg-brand-gold py-3.5 text-base font-bold text-brand-black shadow-lg"
        >
          כניסת מתאמן
        </motion.button>
        <motion.button
          onClick={onEnterAdmin}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border border-white/20 px-6 py-2 text-xs font-medium text-zinc-300 hover:border-white/40"
        >
          כניסת מנהל
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
