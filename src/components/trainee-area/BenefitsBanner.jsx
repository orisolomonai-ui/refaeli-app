import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import Icon3D from "./Icon3D";

// באנר הטבות מתחלף: מתחלף אוטומטית, ניתן להחליק ביד (drag, אותו דפוס snap
// כמו IconCardCarousel), ועוצר את ה-autoplay כל עוד המשתמש נוגע בו.
const AUTOPLAY_MS = 4000;
const SWIPE_VELOCITY_THRESHOLD = 500;
const SWIPE_DISTANCE_RATIO = 0.25;
const SPRING = { type: "spring", stiffness: 300, damping: 30 };

export default function BenefitsBanner({ items, onSelect }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      setWidth(w);
      x.set(-index * w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!width || items.length < 2) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      goTo((index + 1) % items.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, width]);

  function goTo(i) {
    setIndex(i);
    animate(x, -i * width, SPRING);
  }

  function handleDragEnd(_event, info) {
    const { offset, velocity } = info;
    let delta = 0;
    if (velocity.x < -SWIPE_VELOCITY_THRESHOLD || offset.x < -width * SWIPE_DISTANCE_RATIO) delta = 1;
    else if (velocity.x > SWIPE_VELOCITY_THRESHOLD || offset.x > width * SWIPE_DISTANCE_RATIO) delta = -1;
    goTo(((index + delta) % items.length + items.length) % items.length);
  }

  return (
    <div className="mb-4">
      <div
        ref={containerRef}
        className="overflow-hidden rounded-2xl"
        onPointerDown={() => (pausedRef.current = true)}
        onPointerUp={() => (pausedRef.current = false)}
      >
        <motion.div
          dir="ltr"
          className="flex cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragElastic={0.12}
          dragConstraints={{ left: -(items.length - 1) * width, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          {items.map((reward) => (
            <button
              key={reward.id}
              onClick={() => onSelect(reward)}
              dir="rtl"
              className="flex shrink-0 items-center gap-3 bg-brand-black px-5 py-4 text-start"
              style={{ width: width || "100%" }}
            >
              <Icon3D name={reward.icon3d} size={48} />
              <div className="flex-1">
                <p className="text-xs font-medium text-brand-gold">הטבה מומלצת</p>
                <p className="text-sm font-bold text-white">{reward.name}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-zinc-300">
                  <Icon3D name="coin" size={14} />
                  {reward.cost} נק&apos;
                </p>
              </div>
            </button>
          ))}
        </motion.div>
      </div>
      {items.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {items.map((reward, i) => (
            <button
              key={reward.id}
              onClick={() => goTo(i)}
              aria-label={`מעבר להטבה ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-4 bg-brand-gold" : "w-1.5 bg-zinc-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
