"use client";

import Link from "next/link";
import LevelCard from "@/components/ui/LevelCard";
import { useProgress } from "@/hooks/useProgress";
import { useLang } from "@/contexts/LangContext";
import type { Level } from "@/types";

export default function HomePage() {
  const { progress } = useProgress();
  const { lang, t, setLang } = useLang();

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 max-w-lg mx-auto">
      <div className="w-full flex justify-end mb-2">
        <div className="flex rounded-full border border-gray-200 overflow-hidden text-sm font-bold">
          <button
            onClick={() => setLang("ja")}
            className={`px-3 py-1 transition-colors ${lang === "ja" ? "bg-sky-500 text-white" : "text-gray-400 hover:bg-gray-100"}`}
          >
            日本語
          </button>
          <button
            onClick={() => setLang("ko")}
            className={`px-3 py-1 transition-colors ${lang === "ko" ? "bg-sky-500 text-white" : "text-gray-400 hover:bg-gray-100"}`}
          >
            한국어
          </button>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-5xl mb-2">🕐</div>
        <h1 className="text-3xl font-black text-sky-700">{t.appTitle}</h1>
        <p className="text-sm text-gray-500 mt-1">{t.appSubtitle}</p>
      </div>

      <section className="w-full mb-6">
        <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span>📖</span> {t.learnMode}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {([1, 2, 3, 4] as Level[]).map((level) => (
            <LevelCard key={level} level={level} progress={progress.levels[level]} mode="learn" />
          ))}
        </div>
      </section>

      <section className="w-full mb-6">
        <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span>🎯</span> {t.quizMode}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {([1, 2, 3, 4] as Level[]).map((level) => (
            <LevelCard key={level} level={level} progress={progress.levels[level]} mode="quiz" />
          ))}
        </div>
      </section>

      <Link href="/progress" className="text-sm text-sky-600 underline mt-2">
        {t.viewRecord}
      </Link>
    </main>
  );
}
