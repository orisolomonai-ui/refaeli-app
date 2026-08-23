import { useState } from "react";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("he-IL");
}

export default function BeforeAfterSlider({ before, after }) {
  const [pos, setPos] = useState(50);

  return (
    <div className="mx-auto max-w-sm select-none">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-zinc-200">
        <img
          src={before.url}
          alt="תמונת לפני"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        >
          <img
            src={after.url}
            alt="תמונת אחרי"
            className="h-full w-full object-cover"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-brand-gold"
          style={{ left: `${pos}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brand-gold bg-brand-black text-xs text-brand-gold"
          style={{ left: `${pos}%` }}
        >
          ⇔
        </div>

        <span className="absolute bottom-2 left-2 rounded bg-brand-black/70 px-2 py-0.5 text-xs text-white">
          לפני · {formatDate(before.date)}
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-brand-black/70 px-2 py-0.5 text-xs text-white">
          אחרי · {formatDate(after.date)}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="mt-3 block w-full accent-brand-gold"
        aria-label="גרור להשוואת תמונות לפני ואחרי"
      />
    </div>
  );
}
