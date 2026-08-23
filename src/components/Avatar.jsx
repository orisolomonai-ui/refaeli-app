function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : parts[0].slice(0, 2);
}

const SIZE_CLASSES = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-lg",
};

export default function Avatar({ name, size = "sm" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-black font-bold text-brand-gold ${SIZE_CLASSES[size]}`}
    >
      {getInitials(name)}
    </div>
  );
}
