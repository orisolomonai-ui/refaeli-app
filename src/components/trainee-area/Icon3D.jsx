// אייקונים תלת-ממדיים (Fluent Emoji 3D, MIT) ב-public/3d — ראו public/3d/ATTRIBUTION.md
export default function Icon3D({ name, size = 28, className = "", alt = "" }) {
  return (
    <img
      src={`/3d/${name}.png`}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={`select-none object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
