import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import { Home, Gift, BarChart3, Users, Menu } from "lucide-react";

const TABS = [
  { to: "/me", label: "ראשי", icon: Home, end: true },
  { to: "/me/rewards", label: "הטבות", icon: Gift },
  { to: "/me/performance", label: "ביצועים", icon: BarChart3 },
  { to: "/me/groups", label: "קבוצות", icon: Users },
  { to: "/me/more", label: "עוד", icon: Menu },
];

// קפיצת scale קטנה כשהטאב הופך פעיל (לא בכל רינדור - רק במעבר false->true)
function NavIcon({ Icon, isActive }) {
  const controls = useAnimationControls();
  const wasActive = useRef(isActive);
  useEffect(() => {
    if (isActive && !wasActive.current) {
      controls.start({ scale: [1, 1.28, 1], transition: { duration: 0.32, ease: "easeOut" } });
    }
    wasActive.current = isActive;
  }, [isActive, controls]);

  return (
    <motion.span animate={controls}>
      <Icon
        size={22}
        strokeWidth={isActive ? 2.4 : 2}
        fill={isActive ? "currentColor" : "none"}
        fillOpacity={isActive ? 0.15 : 0}
      />
    </motion.span>
  );
}

export default function BottomNav() {
  return (
    <nav className="flex shrink-0 items-stretch justify-between border-t border-brand-line bg-white px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px] font-medium transition-colors duration-200 ${
              isActive ? "text-brand-gold-dark" : "text-zinc-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <NavIcon Icon={Icon} isActive={isActive} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
