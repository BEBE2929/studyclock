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
      <div className="w-full flex justify-end mb-4">
        <div className="flex rounded-full bg-white/80 border border-pink-100 overflow-hidden text-xs font-bold shadow-sm">
          <button
            onClick={() => setLang("ja")}
            className={`px-3 py-1.5 transition-all ${lang === "ja" ? "text-white" : "text-pink-300 hover:text-pink-500"}`}
            style={lang === "ja" ? { background: "linear-gradient(135deg, #f472b6, #c084fc)" } : {}}
          >
            日本語
          </button>
          <button
            onClick={() => setLang("ko")}
            className={`px-3 py-1.5 transition-all ${lang === "ko" ? "text-white" : "text-pink-300 hover:text-pink-500"}`}
            style={lang === "ko" ? { background: "linear-gradient(135deg, #f472b6, #c084fc)" } : {}}
          >
            한국어
          </button>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="flex justify-center gap-3 mb-2 text-2xl">
          <span className="sway" style={{ animationDelay: "0s" }}>🌸</span>
          <span className="text-5xl" style={{ filter: "drop-shadow(0 4px 10px rgba(244,114,182,0.4))" }}>🕐</span>
          <span className="sway" style={{ animationDelay: "0.5s" }}>🌸</span>
        </div>
        <h1
          className="text-4xl font-black mt-1"
          style={{ background: "linear-gradient(135deg, #db2777, #9333ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {t.appTitle}
        </h1>
        <p className="text-sm text-pink-400 mt-1 font-medium">{t.appSubtitle}</p>
        <div className="flex justify-center gap-2 mt-2 text-base opacity-60">
          <span>💜</span><span>🌟</span><span>💗</span><span>🌟</span><span>💜</span>
        </div>
      </div>

      <section className="w-full mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📖</span>
          <h2
            className="text-sm font-black"
            style={{ background: "linear-gradient(90deg, #db2777, #9333ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {t.learnMode}
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-pink-200 to-transparent" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {([1, 2, 3, 4] as Level[]).map((level) => (
            <LevelCard key={level} level={level} progress={progress.levels[level]} mode="learn" />
          ))}
        </div>
      </section>

      <section className="w-full mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎀</span>
          <h2
            className="text-sm font-black"
            style={{ background: "linear-gradient(90deg, #9333ea, #db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {t.quizMode}
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {([1, 2, 3, 4] as Level[]).map((level) => (
            <LevelCard key={level} level={level} progress={progress.levels[level]} mode="quiz" />
          ))}
        </div>
      </section>

      <Link href="/progress" className="text-xs font-bold text-pink-400 hover:text-pink-600 transition-colors mt-2 flex items-center gap-1">
        <span>🎀</span> {t.viewRecord}
      </Link>
    </main>
  );
}
