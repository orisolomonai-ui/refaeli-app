import { motion } from "framer-motion";

// חלון הסבר חד-פעמי שמצביע על אלמנט: "חור" ברקע הכהה מעל ה-targetRect
// (טכניקת box-shadow ענק), עם בועת טקסט וכפתור "המשך". הקריאה מ-onDismiss
// אחראית לשמור את הדגל ב-localStorage כדי שלא יופיע שוב.
export default function Coachmark({ targetRect, text, onDismiss }) {
  if (!targetRect) return null;
  const pad = 10;
  const cx = targetRect.left + targetRect.width / 2;
  const cy = targetRect.top + targetRect.height / 2;
  const r = Math.max(targetRect.width, targetRect.height) / 2 + pad;

  const bubbleTop = (targetRect.bottom ?? targetRect.top + targetRect.height) + 14;

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onDismiss}
    >
      {/* "חור" מעל האלמנט - הרקע הכהה סביבו בלבד, ע"י box-shadow ענק על עיגול שקוף */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          left: cx - r,
          top: cy - r,
          width: r * 2,
          height: r * 2,
          boxShadow: "0 0 0 9999px rgba(10,10,10,0.78)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.25 }}
        className="absolute left-1/2 w-64 -translate-x-1/2 rounded-2xl bg-white p-4 text-center shadow-2xl"
        style={{ top: bubbleTop }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-semibold text-zinc-800">{text}</p>
        <motion.button
          onClick={onDismiss}
          whileTap={{ scale: 0.97 }}
          className="mt-3 w-full rounded-xl bg-brand-black py-2 text-sm font-bold text-brand-gold"
        >
          המשך
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
