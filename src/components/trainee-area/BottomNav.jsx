import { NavLink } from "react-router-dom";
import { Home, Gift, BarChart3, Users, Menu } from "lucide-react";

const TABS = [
  { to: "/me", label: "ראשי", icon: Home, end: true },
  { to: "/me/rewards", label: "הטבות", icon: Gift },
  { to: "/me/performance", label: "ביצועים", icon: BarChart3 },
  { to: "/me/groups", label: "קבוצות", icon: Users },
  { to: "/me/more", label: "עוד", icon: Menu },
];

// פס ניווט תחתון - ילד אחרון וקבוע בתוך עמודת ה-flex של TraineeLayout
// (לא fixed/sticky), כך שהוא נשאר בתחתית גם בתוך מסגרת הטלפון בדסקטופ.
export default function BottomNav() {
  return (
    <nav className="flex shrink-0 items-stretch justify-between border-t border-brand-line bg-white px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px] font-medium transition ${
              isActive ? "text-brand-gold-dark" : "text-zinc-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={22}
                strokeWidth={isActive ? 2.4 : 2}
                fill={isActive ? "currentColor" : "none"}
                fillOpacity={isActive ? 0.15 : 0}
              />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
