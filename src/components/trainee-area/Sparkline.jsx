import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

// גרף קו קטן בסגנון בורסה: בלי צירים, בלי מספרים, בלי טולטיפ, עם נקודה במדידה האחרונה.
// ציר ה-Y מוסתר ומשמש רק להגדרת טווח, כדי שהתנודה תראה גם כשהשינוי קטן.
export default function Sparkline({ values, color = "#c9a961" }) {
  const data = values.map((value) => ({ value }));
  const lastIndex = data.length - 1;

  // נקודה רק בסוף הקו; לשאר הנקודות מחזירים אלמנט ריק (recharts דורש אלמנט)
  function renderDot({ cx, cy, index }) {
    if (index !== lastIndex) return <g key={index} />;
    return (
      <g key={index}>
        <circle cx={cx} cy={cy} r={7} fill={color} opacity={0.25} />
        <circle cx={cx} cy={cy} r={4} fill={color} />
      </g>
    );
  }

  return (
    <div dir="ltr" className="h-14 w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 10, bottom: 8, left: 4 }}>
          <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={renderDot}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
