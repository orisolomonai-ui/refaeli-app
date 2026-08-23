import { motion } from "framer-motion";

export default function SplashScreen({ onEnter }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-brand-black px-6"
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

      <motion.button
        onClick={onEnter}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
        whileTap={{ scale: 0.96 }}
        className="rounded-full bg-brand-gold px-8 py-3 text-sm font-bold text-brand-black shadow-lg"
      >
        כניסה
      </motion.button>
    </motion.div>
  );
}
