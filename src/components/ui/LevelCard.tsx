import Link from "next/link";
import StarRating from "./StarRating";
import { useLang } from "@/contexts/LangContext";
import type { Level, LevelProgress } from "@/types";

const LEVEL_COLORS: Record<Level, string> = {
  1: "bg-green-100 border-green-400 hover:bg-green-200",
  2: "bg-blue-100 border-blue-400 hover:bg-blue-200",
  3: "bg-yellow-100 border-yellow-400 hover:bg-yellow-200",
  4: "bg-red-100 border-red-400 hover:bg-red-200",
};

const LEVEL_EMOJI: Record<Level, string> = { 1: "🌱", 2: "🌿", 3: "🌳", 4: "⭐" };

interface LevelCardProps {
  level: Level;
  progress: LevelProgress;
  mode: "learn" | "quiz";
}

export default function LevelCard({ level, progress, mode }: LevelCardProps) {
  const { t } = useLang();

  if (!progress.unlocked) {
    return (
      <div className="rounded-2xl border-2 border-gray-200 bg-gray-100 p-4 text-center opacity-60">
        <div className="text-3xl mb-1">🔒</div>
        <div className="text-sm font-bold text-gray-400">{t.level} {level}</div>
        <div className="text-xs text-gray-400">{t.levelNames[level]}</div>
      </div>
    );
  }

  return (
    <Link
      href={`/${mode}?level=${level}`}
      className={`rounded-2xl border-2 p-4 text-center block transition-all active:scale-95 ${LEVEL_COLORS[level]}`}
    >
      <div className="text-3xl mb-1">{LEVEL_EMOJI[level]}</div>
      <div className="text-sm font-bold text-gray-700">{t.level} {level}</div>
      <div className="text-xs text-gray-600 mb-2">{t.levelNames[level]}</div>
      <StarRating stars={progress.stars} size="sm" />
    </Link>
  );
}
