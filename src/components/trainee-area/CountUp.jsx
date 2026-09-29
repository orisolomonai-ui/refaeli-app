import { useEffect, useRef, useState } from "react";

// מספר שעולה בהדרגה בטעינה/בשינוי (בלי תלות חיצונית מעבר ל-requestAnimationFrame)
export default function CountUp({ value, duration = 600 }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    let raf;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) * (1 - t); // ease-out
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display}</>;
}
