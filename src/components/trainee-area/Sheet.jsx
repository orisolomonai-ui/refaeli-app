import { motion } from "framer-motion";
import { X } from "lucide-react";

// גיליון תחתון (bottom sheet) - לפרטי פרס, אישור מימוש, הודעות וכו'.
// עטפו ב-<AnimatePresence> במקום הקריאה כדי לקבל גם אנימציית יציאה.
export default function Sheet({ onClose, title, children }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-zinc-200 sm:hidden" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="סגירה"
            className="rounded-full p-1.5 text-zinc-400 transition active:scale-90 hover:bg-zinc-100"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
