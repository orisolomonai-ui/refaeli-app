// פס התקדמות משותף שמשמש כמה מסכים באזור המתאמן
export function Bar({ pct, className = "bg-brand-gold" }) {
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
      <div
        className={`h-full rounded-full ${className}`}
        style={{ width: `${Math.round(pct * 100)}%` }}
      />
    </div>
  );
}
