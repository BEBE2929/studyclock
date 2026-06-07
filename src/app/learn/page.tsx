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
        <span className="text-gray-400">{t.loading}</span>
      </div>
    );
  }

  const current = questions[index];
  const config = CLOCK_CONFIG[level];

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
      <div className="w-full flex items-center mb-6">
        <button onClick={() => router.push("/")} className="text-sky-600 text-sm font-bold mr-auto">
          {t.back}
        </button>
        <span className="text-sm font-bold text-gray-500">
          {t.level} {level}「{t.levelNames[level]}」
        </span>
        <span className="ml-auto text-sm text-gray-400">{index + 1}/{questions.length}</span>
      </div>

      <div className="mb-4">
        <AnalogClock hour={current.hour} minute={current.minute} config={config} size={280} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm px-6 py-4 text-center mb-4 w-full">
        <p className="text-3xl font-black text-sky-700 mb-1">{timeText()}</p>
        <p className="text-sm text-gray-500">{handDescription()}</p>
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold disabled:opacity-30"
        >
          {t.prev}
        </button>
        <button
          onClick={handleNext}
          className="flex-grow-[2] py-3 rounded-2xl bg-sky-500 text-white font-bold text-lg active:scale-95 transition-transform"
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
