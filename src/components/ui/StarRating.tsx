export default function StarRating({ stars, size = "md" }: { stars: 0 | 1 | 2 | 3; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "text-4xl" : size === "sm" ? "text-lg" : "text-2xl";
  return (
    <span className="flex gap-0.5 justify-center">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`${sz} transition-all duration-300 ${
            n <= stars
              ? "text-yellow-400 drop-shadow-[0_1px_3px_rgba(234,179,8,0.6)]"
              : "text-gray-200"
          }`}
          style={n <= stars ? { animation: `twinkle ${1.2 + n * 0.3}s ease-in-out infinite` } : {}}
        >
          ★
        </span>
      ))}
    </span>
  );
}
