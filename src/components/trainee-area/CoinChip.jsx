import { Link } from "react-router-dom";
import Icon3D from "./Icon3D";
import CountUp from "./CountUp";

// to=null מציג צ'יפ סטטי (למשל בעמוד ההטבות עצמו); אחרת קישור לחנות ההטבות
export default function CoinChip({ points, to = "/me/rewards", size = "md" }) {
  const pad = size === "sm" ? "px-2 py-1" : "px-3 py-1.5";
  const iconSize = size === "sm" ? 18 : 22;
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const className = `inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-white shadow-sm ${pad}`;

  const content = (
    <>
      <Icon3D name="coin" size={iconSize} />
      <span dir="ltr" className={`font-bold text-brand-gold-dark ${textSize}`}>
        <CountUp value={points} />
      </span>
    </>
  );

  if (!to) return <span className={className}>{content}</span>;
  return (
    <Link to={to} className={className}>
      {content}
    </Link>
  );
}
