import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "./Logo";
import CoinChip from "./CoinChip";
import Avatar from "../Avatar";

// logoScale/logoOpacity הם motion values אופציונליים (מ-TraineeLayout, נגזרים
// מגלילה) - הלוגו מתכווץ בעדינות תוך גלילה; ה-CoinChip נשאר תמיד בגודל מלא.
export default function AppBar({ trainee, onBell, logoScale, logoOpacity }) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 flex items-center justify-between border-b border-brand-line bg-brand-mist/90 px-4 py-3 backdrop-blur">
      <Link to="/me" className="flex items-center gap-2">
        <motion.div style={{ scale: logoScale, opacity: logoOpacity }}>
          <Logo size={36} />
        </motion.div>
      </Link>
      <div className="flex items-center gap-2">
        <CoinChip id="coin-chip-target" points={trainee.points} size="sm" />
        <button
          onClick={onBell}
          aria-label="התראות"
          className="rounded-full p-2 text-zinc-500 hover:bg-white"
        >
          <Bell size={20} />
        </button>
        <Link to="/me/more" aria-label="הפרופיל שלי">
          <Avatar name={trainee.name} size="sm" />
        </Link>
      </div>
    </header>
  );
}
