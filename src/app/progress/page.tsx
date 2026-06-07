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
        <button onClick={() => router.push("/")} className="text-sky-600 text-sm font-bold">
          {t.back}
        </button>
        <h1 className="text-lg font-black text-gray-700 mx-auto">{t.record}</h1>
        <div className="w-12" />
      </div>

      <div className="w-full flex flex-col gap-4 mb-8">
        {([1, 2, 3, 4] as Level[]).map((level) => {
          const lp = progress.levels[level];
          return (
            <div key={level} className={`bg-white rounded-2xl shadow-sm p-4 ${!lp.unlocked ? "opacity-50" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-black text-gray-700 mr-2">{t.level} {level}</span>
                  <span className="text-sm text-gray-500">{t.levelNames[level]}</span>
                </div>
                {lp.unlocked ? <StarRating stars={lp.stars} /> : <span className="text-xl">🔒</span>}
              </div>
              {lp.unlocked && (
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>{t.bestScore}: <strong className="text-sky-600">{lp.bestScore}/10</strong></span>
                  <span>{t.attempts}: <strong>{lp.attempts}{t.times}</strong></span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => { if (confirmReset) { reset(); setConfirmReset(false); } else setConfirmReset(true); }}
        className={`text-sm px-4 py-2 rounded-full border transition-colors ${confirmReset ? "bg-red-500 text-white border-red-500" : "border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400"}`}
      >
        {confirmReset ? t.confirmReset : t.resetRecord}
      </button>
      {confirmReset && (
        <button onClick={() => setConfirmReset(false)} className="mt-2 text-xs text-gray-400 underline">
          {t.cancelReset}
        </button>
      )}
    </main>
  );
}
