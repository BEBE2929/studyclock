"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/ui/StarRating";
import { useProgress } from "@/hooks/useProgress";
import { useLang } from "@/contexts/LangContext";
import type { Level } from "@/types";

export default function ProgressPage() {
  const router = useRouter();
  const { progress, reset } = useProgress();
  const { t } = useLang();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-6 max-w-lg mx-auto">
      <div className="w-full flex items-center mb-6">
        <button
          onClick={() => router.push("/")}
          className="text-pink-500 text-sm font-black bg-white/80 rounded-full px-3 py-1.5 shadow-sm border border-pink-100"
        >
          {t.back}
        </button>
        <h1
          className="text-lg font-black mx-auto"
          style={{ background: "linear-gradient(135deg, #db2777, #9333ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          🎀 {t.record}
        </h1>
        <div className="w-16" />
      </div>

      <div className="w-full flex flex-col gap-3 mb-8">
        {([1, 2, 3, 4] as Level[]).map((level) => {
          const lp = progress.levels[level];
          return (
            <div
              key={level}
              className={`rounded-3xl p-4 border card-enter ${!lp.unlocked ? "bg-white/50 border-pink-50 opacity-50" : "bg-white border-pink-100 shadow-md shadow-pink-50"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{["🌸","🦄","🌈","👑"][level - 1]}</span>
                  <div>
                    <span className="font-black text-sm text-gray-600 mr-1">{t.level} {level}</span>
                    <span className="text-xs text-pink-400">{t.levelNames[level]}</span>
                  </div>
                </div>
                {lp.unlocked ? <StarRating stars={lp.stars} size="sm" /> : <span className="text-lg">🔒</span>}
              </div>
              {lp.unlocked && (
                <div className="flex gap-4 text-xs text-pink-400 mt-1">
                  <span>{t.bestScore}: <strong className="text-pink-600">{lp.bestScore}/10</strong></span>
                  <span>{t.attempts}: <strong className="text-pink-600">{lp.attempts}{t.times}</strong></span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => { if (confirmReset) { reset(); setConfirmReset(false); } else setConfirmReset(true); }}
        className={`text-xs px-5 py-2 rounded-full font-bold border transition-all ${
          confirmReset ? "text-white border-transparent" : "border-pink-200 text-pink-300 hover:border-pink-400 hover:text-pink-500"
        }`}
        style={confirmReset ? { background: "linear-gradient(135deg, #f472b6, #a855f7)" } : {}}
      >
        {confirmReset ? t.confirmReset : t.resetRecord}
      </button>
      {confirmReset && (
        <button onClick={() => setConfirmReset(false)} className="mt-2 text-xs text-pink-300 underline">
          {t.cancelReset}
        </button>
      )}
    </main>
  );
}
