import { Link } from "react-router-dom";

// כרטיס גדול במסך הבית של המתאמן; כל הכרטיס לחיץ ופותח את המסך שלו
export default function HomeCard({ to, title, icon, children }) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border border-brand-gold/20 bg-brand-charcoal p-5 shadow-lg transition hover:border-brand-gold/50 active:scale-[0.99]"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-gold">
          <span aria-hidden="true">{icon}</span>
          {title}
        </h2>
        <span className="text-brand-gold/60" aria-hidden="true">
          ←
        </span>
      </div>
      {children}
    </Link>
  );
}
