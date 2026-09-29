import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import CoinChip from "./CoinChip";
import Avatar from "../Avatar";

export default function AppBar({ trainee, onBell }) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 flex items-center justify-between border-b border-brand-line bg-brand-mist/90 px-4 py-3 backdrop-blur">
      <Link to="/me" className="flex items-center gap-2">
        <Logo size={36} />
      </Link>
      <div className="flex items-center gap-2">
        <CoinChip points={trainee.points} size="sm" />
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
