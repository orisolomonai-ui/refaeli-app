export default function EmptyState({ icon, message, compact = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 text-center text-zinc-400 ${
        compact ? "p-6" : "p-10"
      }`}
    >
      <span className={compact ? "text-2xl" : "text-4xl"}>{icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}
