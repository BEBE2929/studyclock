"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import AnalogClock from "@/components/clock/AnalogClock";
import { CLOCK_CONFIG } from "@/types";
import type { Level, QuizQuestion } from "@/types";
import { generateQuiz } from "@/lib/quizGenerator";
import { useLang } from "@/contexts/LangContext";

function LearnContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { t } = useLang();
  const level = (Number(params.get("level") ?? 1) as Level) || 1;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setQuestions(generateQuiz(level));
    setIndex(0);
  }, [level]);

  const handleNext = useCallback(() => {
    if (index < questions.length - 1) setIndex((i) => i + 1);
    else router.push("/");
  }, [index, questions.length, router]);

  const handlePrev = useCallback(() => {
    if (index > 0) setIndex((i) => i - 1);
  }, [index]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-pink-300 font-bold animate-pulse">🌸 {t.loading}</span>
      </div>
    );
  }

  const current = questions[index];
  const config = CLOCK_CONFIG[level];
  const progressPct = ((index + 1) / questions.length) * 100;

  const timeText = () => {
    if (current.minute === 0) return t.timeExact(current.hour);
    if (current.minute === 30) return t.timeHalf(current.hour);
    return t.timeMinute(current.hour, current.minute);
  };

  const handDescription = () => {
    if (level === 1) return t.handDescHourOnly(current.hour);
    if (current.minute === 0) return t.handDescExact(current.hour);
    if (current.minute === 30) return t.handDescHalf(current.hour, current.hour + 1 > 12 ? 1 : current.hour + 1);
    return t.handDescMinute(current.minute);
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-6 max-w-lg mx-auto">
      <div className="w-full flex items-center mb-4">
        <button
          onClick={() => router.push("/")}
          className="text-pink-500 text-sm font-black bg-white/80 rounded-full px-3 py-1.5 shadow-sm border border-pink-100 hover:bg-white transition-all"
        >
          {t.back}
        </button>
        <span
          className="mx-auto text-sm font-black"
          style={{ background: "linear-gradient(135deg, #db2777, #9333ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {t.level} {level}「{t.levelNames[level]}」
        </span>
        <span className="text-sm font-bold text-pink-300">{index + 1}/{questions.length}</span>
      </div>

      <div className="w-full bg-pink-100 rounded-full h-3 mb-5 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #f472b6, #c084fc)" }}
        />
      </div>

      <div className="mb-4" style={{ filter: "drop-shadow(0 8px 24px rgba(244,114,182,0.25))" }}>
        <AnalogClock hour={current.hour} minute={current.minute} config={config} size={280} />
      </div>

      <div
        className="rounded-3xl px-6 py-4 text-center mb-5 w-full shadow-lg card-enter border border-pink-100"
        style={{ background: "linear-gradient(135deg, #fdf2f8, #f5f3ff)" }}
      >
        <div className="flex justify-center gap-1 text-sm mb-1">
          <span>🌸</span><span>🌸</span><span>🌸</span>
        </div>
        <p
          className="text-3xl font-black mb-1"
          style={{ background: "linear-gradient(135deg, #db2777, #9333ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {timeText()}
        </p>
        <p className="text-xs text-pink-400 mt-1">{handDescription()}</p>
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="flex-1 py-3 rounded-2xl bg-white font-black text-pink-400 shadow-sm border border-pink-100 disabled:opacity-30 active:scale-95 transition-all"
        >
          {t.prev}
        </button>
        <button
          onClick={handleNext}
          className="flex-grow-[2] py-3 rounded-2xl font-black text-white text-lg shadow-lg active:scale-95 transition-all btn-pop"
          style={{ background: "linear-gradient(135deg, #f472b6, #a855f7)", boxShadow: "0 4px 15px rgba(244,114,182,0.45)" }}
        >
          {index < questions.length - 1 ? t.next : t.finish}
        </button>
      </div>
    </main>
  );
}

export default function LearnPage() {
  return <Suspense><LearnContent /></Suspense>;
}
