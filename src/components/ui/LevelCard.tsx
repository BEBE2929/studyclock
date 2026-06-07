import Link from "next/link";
import StarRating from "./StarRating";
import { useLang } from "@/contexts/LangContext";
import type { Level, LevelProgress } from "@/types";

const LEVEL_STYLES: Record<Level, { bg: string; border: string; shadow: string; badge: string }> = {
  1: { bg: "from-pink-100 to-rose-50",      border: "border-pink-300",   shadow: "shadow-pink-200",   badge: "bg-pink-400 text-white" },
  2: { bg: "from-purple-100 to-fuchsia-50", border: "border-purple-300", shadow: "shadow-purple-200", badge: "bg-purple-400 text-white" },
  3: { bg: "from-sky-100 to-indigo-50",     border: "border-sky-300",    shadow: "shadow-sky-200",    badge: "bg-sky-400 text-white" },
  4: { bg: "from-yellow-100 to-amber-50",   border: "border-yellow-300", shadow: "shadow-yellow-200", badge: "bg-yellow-400 text-white" },
};

const LEVEL_EMOJI: Record<Level, string> = { 1: "🌸", 2: "🦄", 3: "🌈", 4: "👑" };

interface LevelCardProps {
  level: Level;
  progress: LevelProgress;
  mode: "learn" | "quiz";
}

export default function LevelCard({ level, progress, mode }: LevelCardProps) {
  const { t } = useLang();
  const s = LEVEL_STYLES[level];

  if (!progress.unlocked) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-pink-100 bg-white/50 p-4 text-center select-none">
        <div className="text-3xl mb-1 grayscale opacity-30">🔒</div>
        <div className="text-xs font-bold text-pink-200">{t.level} {level}</div>
        <div className="text-xs text-pink-200">{t.levelNames[level]}</div>
      </div>
    );
  }

  return (
    <Link
      href={`/${mode}?level=${level}`}
      className={`rounded-3xl border-2 ${s.border} bg-gradient-to-br ${s.bg} p-4 text-center block
        shadow-lg ${s.shadow} hover:shadow-xl hover:-translate-y-1 active:scale-95
        transition-all duration-200 card-enter btn-pop`}
    >
      <div className="text-4xl mb-1">{LEVEL_EMOJI[level]}</div>
      <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full mb-1 ${s.badge}`}>
        {t.level} {level}
      </span>
      <div className="text-xs font-bold text-gray-500 mb-2">{t.levelNames[level]}</div>
      <StarRating stars={progress.stars} size="sm" />
    </Link>
  );
}
