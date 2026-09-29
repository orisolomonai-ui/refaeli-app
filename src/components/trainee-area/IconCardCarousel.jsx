import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import Icon3D from "./Icon3D";

const SWIPE_VELOCITY_THRESHOLD = 500;
const SWIPE_DISTANCE_RATIO = 0.25;
const SPRING = { type: "spring", stiffness: 320, damping: 32 };

function clampIndex(i, max) {
  return Math.max(0, Math.min(max, i));
}

// אייקון בודד בשורה העליונה: גודל/שקיפות שלו נגזרים ברציפות מאותו motion value
// שמניע גם את שורת הכרטיסים למטה - כך ששניהם זזים באותו פריים.
function CarouselIcon({ cat, index, x, slideWidth, isActive, onSelect }) {
  const distance = useTransform(x, (v) => index - -v / (slideWidth || 1));
  const scale = useTransform(distance, [-1, 0, 1], [0.68, 1.6, 0.68], {
    clamp: true,
  });
  const opacity = useTransform(distance, [-2, -1, 0, 1, 2], [0.35, 0.55, 1, 0.55, 0.35], {
    clamp: true,
  });

  return (
    <button
      onClick={() => onSelect(index)}
      className="flex flex-1 flex-col items-center gap-1.5 py-1"
    >
      <motion.div style={{ scale }} className="relative">
        {isActive && (
          <motion.div
            layoutId="carousel-ring"
            className="absolute -inset-1.5 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
            transition={SPRING}
          />
        )}
        <motion.div
          style={{ opacity }}
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Icon3D name={cat.icon3d} size={24} />
        </motion.div>
      </motion.div>
      <motion.span
        style={{ opacity }}
        className={`text-xs font-medium ${
          isActive ? "text-zinc-900" : "text-zinc-400"
        }`}
      >
        {cat.label}
      </motion.span>
    </button>
  );
}

// קרוסלת אייקונים + כרטיסים מסונכרנת: גרירת שורת הכרטיסים מזיזה בו-זמנית את
// גדלי/שקיפות האייקונים למעלה (motion value אחד משותף), ולחיצה על אייקון
// מגלגלת את הכרטיסים אליו באנימציית spring. עובד עם עכבר ומגע.
//
// activeIndex הוא state פנימי (לא נגזר מ-active בכל רינדור): הקומפוננטה היא
// "בקרת-עצמה" עם ערך התחלתי מ-active, וה-spring מופעל ישירות מנקודת
// האינטראקציה (snapTo) - לא דרך useEffect - כדי שההיסטוריה של הגרירה תישאר
// חד-משמעית ולא תתחרה בעדכון React אסינכרוני.
export default function IconCardCarousel({ categories, active, onChange, children }) {
  const slides = Array.isArray(children) ? children : [children];
  const initialIndex = Math.max(
    0,
    categories.findIndex((c) => c.key === active)
  );

  const containerRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const x = useMotionValue(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      setSlideWidth(w);
      x.set(-activeIndex * w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function snapTo(index) {
    const clamped = clampIndex(index, categories.length - 1);
    setActiveIndex(clamped);
    animate(x, -clamped * slideWidth, SPRING);
    onChange?.(categories[clamped].key);
  }

  function handleDragEnd(_event, info) {
    const { offset, velocity } = info;
    let delta = 0;
    if (velocity.x < -SWIPE_VELOCITY_THRESHOLD || offset.x < -slideWidth * SWIPE_DISTANCE_RATIO) {
      delta = 1;
    } else if (
      velocity.x > SWIPE_VELOCITY_THRESHOLD ||
      offset.x > slideWidth * SWIPE_DISTANCE_RATIO
    ) {
      delta = -1;
    }
    snapTo(activeIndex + delta);
  }

  return (
    <div>
      <div className="flex items-end justify-between" dir="rtl">
        {categories.map((cat, i) => (
          <CarouselIcon
            key={cat.key}
            cat={cat}
            index={i}
            x={x}
            slideWidth={slideWidth}
            isActive={i === activeIndex}
            onSelect={snapTo}
          />
        ))}
      </div>

      <div ref={containerRef} className="mt-3 overflow-hidden">
        {/* dir="ltr" מפורש: translateX() כאן הוא חישוב פיקסלים גולמי (לא זרימת
            טקסט), וצריך שסדר השקופיות הפיזי יתאים למתמטיקה שלו בלי קשר
            לכיווניות העמוד - כמו ב-BeforeAfterSlider. */}
        <motion.div
          dir="ltr"
          className="flex"
          style={{ x }}
          drag="x"
          dragElastic={0.12}
          dragConstraints={{
            left: -(categories.length - 1) * slideWidth,
            right: 0,
          }}
          onDragEnd={handleDragEnd}
        >
          {slides.map((slide, i) => (
            <div
              key={categories[i]?.key ?? i}
              className="shrink-0"
              style={{ width: slideWidth || "100%" }}
            >
              <div className="mx-1 rounded-2xl bg-white p-4 shadow-sm">
                {slide}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
