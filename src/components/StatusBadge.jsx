export default function StatusBadge({ status }) {
  const isPaid = status === "paid";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        isPaid
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isPaid ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {isPaid ? "שולם" : "לא שולם"}
    </span>
  );
}
