import { useState } from "react";

// מציג public/logo.png אם קיים; אם לא (או שנכשל לטעון) - נופל לסימן "רפ" בזהב/שחור.
// variant="mark": חיתוך מוגדל של הסמל (R/F + המשקולת) בלבד - קריא גם בגדלים קטנים
//   (סרגל עליון, כותרת המנהל). variant="full": התמונה המלאה (סמל + שם + תת-כותרת) -
//   למקום אחד עם מקום לנשום, כרגע רק מסך הפתיחה.
export default function Logo({ size = 44, rounded = "rounded-2xl", variant = "mark" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center ${rounded} bg-brand-black font-bold text-brand-gold`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        רפ
      </div>
    );
  }

  if (variant === "full") {
    return (
      <img
        src="/logo.png"
        alt="Refaeli Fitness Studio"
        onError={() => setFailed(true)}
        className={`shrink-0 ${rounded} object-contain`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label="Refaeli Fitness Studio"
      className={`shrink-0 ${rounded} bg-brand-black`}
      style={{
        width: size,
        height: size,
        backgroundImage: "url(/logo.png)",
        backgroundSize: "167%",
        backgroundPosition: "50% 12%",
      }}
    >
      {/* תמונה נסתרת רק כדי להפעיל onError ולזהות אם logo.png חסר */}
      <img
        src="/logo.png"
        alt=""
        aria-hidden="true"
        onError={() => setFailed(true)}
        className="h-0 w-0 opacity-0"
      />
    </div>
  );
}
