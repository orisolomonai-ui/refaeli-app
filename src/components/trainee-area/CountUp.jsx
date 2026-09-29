import { useEffect, useRef, useState } from "react";

function decimalPlaces(n) {
  const s = String(n);
  const i = s.indexOf(".");
  return i === -1 ? 0 : s.length - i - 1;
}

// מספר שעולה בהדרגה בטעינה/בשינוי (בלי תלות חיצונית מעבר ל-requestAnimationFrame).
// שומר על מספר הספרות אחרי הנקודה של הערך היעד (למשל משקל 83.4) - לא מעגל לשלם.
export default function CountUp({ value, duration = 600 }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const decimals = decimalPlaces(to);
    const start = performance.now();
    let raf;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) * (1 - t); // ease-out
      const current = from + (to - from) * eased;
      setDisplay(Number(current.toFixed(decimals)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display}</>;
}
