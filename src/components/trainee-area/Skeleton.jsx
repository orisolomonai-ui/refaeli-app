// בלוק שלד פשוט (פועם) לטעינה ראשונית
export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-zinc-200/70 ${className}`} />;
}

// שלד שמדמה את מבנה מסך הבית (כרטיס שחור + קרוסלה + כרטיס) - מוצג פעם אחת
// בכניסה הראשונה ל-/me באותו session, כי הנתונים כאן סינכרוניים ואין באמת
// המתנה לשרת שרוצים להראות אותה שוב בכל ניווט.
export default function HomeSkeleton() {
  return (
    <div>
      <SkeletonBlock className="mb-3 h-6 w-32" />
      <SkeletonBlock className="h-24 w-full rounded-2xl" />
      <div className="mt-5 flex items-end justify-between">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <SkeletonBlock className="h-11 w-11 rounded-full" />
            <SkeletonBlock className="h-3 w-10" />
          </div>
        ))}
      </div>
      <SkeletonBlock className="mt-3 h-44 w-full rounded-2xl" />
      <SkeletonBlock className="mt-4 h-16 w-full rounded-2xl" />
      <SkeletonBlock className="mt-4 h-14 w-full rounded-2xl" />
    </div>
  );
}
