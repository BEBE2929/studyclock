export default function StarRating({ stars, size = "md" }: { stars: 0 | 1 | 2 | 3; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "text-4xl" : size === "sm" ? "text-lg" : "text-2xl";
  return (
    <span className="flex gap-0.5 justify-center">
      {[1, 2, 3].map((n) => (
        <span key={n} className={`${sz} ${n <= stars ? "text-yellow-400" : "text-gray-200"}`}>
          ★
        </span>
      ))}
    </span>
  );
}
