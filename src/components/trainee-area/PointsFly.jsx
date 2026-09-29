import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Icon3D from "./Icon3D";

// "+N" צף שטס מנקודת פעולה (למשל כפתור הצ'ק-אין) אל ה-CoinChip הקבוע
// בסרגל העליון. מופעל מכל מקום באזור המתאמן דרך אירוע window גלובלי
// (window.dispatchEvent(new CustomEvent("refaeli:points-fly", {detail:{originRect, amount}})))
// כדי לא לדרוש חיווט props/context בין TraineeHome ל-TraineeLayout עבור מקרה שימוש יחיד.
export default function PointsFly() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    function handleFly(e) {
      const { originRect, amount } = e.detail ?? {};
      const targetEl = document.getElementById("coin-chip-target");
      if (!originRect || !targetEl) return;
      const targetRect = targetEl.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setItems((prev) => [
        ...prev,
        {
          id,
          amount,
          fromX: originRect.left + originRect.width / 2,
          fromY: originRect.top + originRect.height / 2,
          toX: targetRect.left + targetRect.width / 2,
          toY: targetRect.top + targetRect.height / 2,
        },
      ]);
    }
    window.addEventListener("refaeli:points-fly", handleFly);
    return () => window.removeEventListener("refaeli:points-fly", handleFly);
  }, []);

  function remove(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return createPortal(
    <AnimatePresence>
      {items.map((it) => (
        <motion.div
          key={it.id}
          className="pointer-events-none fixed z-[60] flex items-center gap-1 rounded-full bg-brand-black px-2 py-1 text-xs font-bold text-brand-gold shadow-lg"
          style={{ left: it.fromX, top: it.fromY, translateX: "-50%", translateY: "-50%" }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: it.toX - it.fromX,
            y: it.toY - it.fromY,
            opacity: 0,
            scale: 0.5,
          }}
          transition={{ duration: 0.6, ease: "easeIn" }}
          onAnimationComplete={() => remove(it.id)}
        >
          <Icon3D name="coin" size={14} />+{it.amount}
        </motion.div>
      ))}
    </AnimatePresence>,
    document.body
  );
}

// עוזר לקריאה מנקודת האינטראקציה (למשל onClick של כפתור), בלי לזכור את שם
// האירוע/הפרטים בכל מקום קריאה.
export function flyPointsFrom(element, amount) {
  if (!element) return;
  window.dispatchEvent(
    new CustomEvent("refaeli:points-fly", {
      detail: { originRect: element.getBoundingClientRect(), amount },
    })
  );
}
