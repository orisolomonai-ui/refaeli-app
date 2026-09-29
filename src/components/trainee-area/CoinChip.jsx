import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import Icon3D from "./Icon3D";
import CountUp from "./CountUp";

// to=null מציג צ'יפ סטטי (למשל בעמוד ההטבות עצמו); אחרת קישור לחנות ההטבות.
// id מועבר רק מה-AppBar (הצ'יפ הקבוע), כדי ש-"+N עף לארנק" ידע לאן לכוון.
export default function CoinChip({ points, to = "/me/rewards", size = "md", id }) {
  const pad = size === "sm" ? "px-2 py-1" : "px-3 py-1.5";
  const iconSize = size === "sm" ? 18 : 22;
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const className = `inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-white shadow-sm ${pad}`;

  // קפיצת scale קטנה כשהיתרה עולה (למשל אחרי צ'ק-אין)
  const controls = useAnimationControls();
  const prevPoints = useRef(points);
  useEffect(() => {
    if (points > prevPoints.current) {
      controls.start({ scale: [1, 1.22, 1], transition: { duration: 0.35, ease: "easeOut" } });
    }
    prevPoints.current = points;
  }, [points, controls]);

  const content = (
    <>
      <Icon3D name="coin" size={iconSize} />
      <span dir="ltr" className={`font-bold text-brand-gold-dark ${textSize}`}>
        <CountUp value={points} />
      </span>
    </>
  );

  if (!to) {
    return (
      <motion.span id={id} animate={controls} className={className}>
        {content}
      </motion.span>
    );
  }
  return (
    <Link to={to}>
      <motion.span id={id} animate={controls} className={className}>
        {content}
      </motion.span>
    </Link>
  );
}
