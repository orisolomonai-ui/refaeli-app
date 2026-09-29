import Icon3D from "./Icon3D";

const TYPE_LABEL = { pickup: "איסוף בסטודיו", digital: "מתנה דיגיטלית" };

export default function RewardCard({ reward, purchased, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col overflow-hidden rounded-2xl bg-white text-right shadow-sm ring-1 ring-brand-line transition active:scale-[0.98]"
    >
      <div className="trainee-bg flex h-24 items-center justify-center">
        <Icon3D name={reward.icon3d} size={56} />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-[11px] font-medium text-zinc-400">
          {TYPE_LABEL[reward.type]}
        </span>
        <p className="line-clamp-2 min-h-9 text-sm font-bold text-zinc-900">
          {reward.name}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm font-bold text-brand-gold-dark">
            <Icon3D name="coin" size={16} />
            {reward.cost}
          </span>
          {purchased && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              נרכש ✓
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
