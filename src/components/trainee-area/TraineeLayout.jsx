import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18, ease: "easeOut" },
};

// עוטף כל מסך מתאמן באותה אנימציית מעבר כמו במנהל
export function TraineePage({ children }) {
  return <motion.div {...pageMotion}>{children}</motion.div>;
}

// מעטפת אזור המתאמן: רקע שחור, בלי כותרת הניהול, וכפתור חזרה למסך הבית במסכים פנימיים
export default function TraineeLayout({ children }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/me" || pathname === "/me/";

  // שלא יבהבה רקע בהיר בגלילת-יתר במובייל
  useEffect(() => {
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#0a0a0a";
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <div className="mx-auto max-w-md px-4 pb-12 pt-6">
        {!isHome && (
          <Link
            to="/me"
            className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-brand-gold"
          >
            → חזרה למסך הבית
          </Link>
        )}
        {children}
      </div>
    </div>
  );
}
