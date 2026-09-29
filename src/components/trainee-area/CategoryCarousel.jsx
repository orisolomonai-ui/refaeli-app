import { motion } from "framer-motion";
import Icon3D from "./Icon3D";
import Ring from "./Ring";

// קרוסלת קטגוריות עגולה עם גלילה אופקית; הקטגוריה הנבחרת מוגדלת בתוך טבעת זהב
export default function CategoryCarousel({ categories, active, onChange }) {
  return (
    <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-1" dir="rtl">
      {categories.map((cat) => {
        const isActive = cat.key === active;
        return (
          <motion.button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            whileTap={{ scale: 0.94 }}
            className="flex shrink-0 snap-center flex-col items-center gap-1.5"
          >
            {isActive ? (
              <Ring pct={1} size={62} stroke={2.5}>
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon3D name={cat.icon3d} size={32} />
                </div>
              </Ring>
            ) : (
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white opacity-60 shadow-sm">
                <Icon3D name={cat.icon3d} size={26} />
              </div>
            )}
            <span
              className={`text-xs font-medium ${
                isActive ? "text-zinc-900" : "text-zinc-400"
              }`}
            >
              {cat.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
