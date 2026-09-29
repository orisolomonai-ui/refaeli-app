import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import AppBar from "./AppBar";
import BottomNav from "./BottomNav";
import Sheet from "./Sheet";
import PointsFly from "./PointsFly";
import { useCurrentTrainee } from "../../context/TraineesContext";
import { NOTIFICATIONS } from "../../data/traineeDemoContent";

const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18, ease: "easeOut" },
};

// עוטף כל מסך מתאמן באותה אנימציית מעבר
export function TraineePage({ children }) {
  return <motion.div {...pageMotion}>{children}</motion.div>;
}

// "מסגרת טלפון" באזור המתאמן: על מובייל תופס את כל המסך; בדסקטופ מוצג כרטיס
// ממורכז ברוחב טלפון, כדי שגם שם זה יראה וירגיש כמו אפליקציה ולא כמו אתר.
export default function TraineeLayout({ children }) {
  const trainee = useCurrentTrainee();
  const [showNotifications, setShowNotifications] = useState(false);

  // כיווץ עדין של הלוגו תוך גלילה (transform/opacity בלבד) - ה-CoinChip
  // עצמו נשאר בגודל מלא כל הזמן, כי הוא כבר "דבוק" בתוך ה-sticky header.
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const logoScale = useTransform(scrollY, [0, 60], [1, 0.78], { clamp: true });
  const logoOpacity = useTransform(scrollY, [0, 60], [1, 0.65], { clamp: true });

  return (
    <div className="flex min-h-dvh justify-center trainee-bg sm:items-center sm:bg-zinc-200 sm:p-6">
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-brand-mist sm:h-[860px] sm:max-h-[92dvh] sm:w-[430px] sm:rounded-[2.5rem] sm:border sm:border-zinc-300 sm:shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-3">
          <AppBar
            trainee={trainee}
            onBell={() => setShowNotifications(true)}
            logoScale={logoScale}
            logoOpacity={logoOpacity}
          />
          {children}
          <div className="h-2" />
        </div>
        <BottomNav />
      </div>

      <AnimatePresence>
        {showNotifications && (
          <Sheet title="התראות" onClose={() => setShowNotifications(false)}>
            <ul className="space-y-2">
              {NOTIFICATIONS.map((n, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-zinc-50 p-3"
                >
                  <span className="text-xl">{n.icon}</span>
                  <div>
                    <p className="text-sm text-zinc-800">{n.text}</p>
                    <p className="text-xs text-zinc-400">{n.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Sheet>
        )}
      </AnimatePresence>
      <PointsFly />
    </div>
  );
}
