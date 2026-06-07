"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AnalogClock from "@/components/clock/AnalogClock";
import StarRating from "@/components/ui/StarRating";
import { CLOCK_CONFIG, QUIZ_SIZE } from "@/types";
import type { Level, QuizQuestion } from "@/types";
import { generateQuiz, generateWrongChoices } from "@/lib/quizGenerator";
import { useProgress } from "@/hooks/useProgress";
import { scoreToStars } from "@/lib/storage";
import { useLang } from "@/contexts/LangContext";

type Choice = QuizQuestion & { id: string };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoices(correct: QuizQuestion, level: Level): Choice[] {
  const wrongs = generateWrongChoices(correct, level);
  return shuffle([
    { ...correct, id: "correct" },
    ...wrongs.map((w, i) => ({ ...w, id: `wrong-${i}` })),
  ]);
}

function QuizContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { t } = useLang();
  const level = (Number(params.get("level") ?? 1) as Level) || 1;
  const { saveResult } = useProgress();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const qs = generateQuiz(level);
    setQuestions(qs);
    setChoices(buildChoices(qs[0], level));
    setIndex(0); setSelected(null); setScore(0); setFinished(false);
  }, [level]);

  const handleSelect = useCallback((id: string) => {
    if (selected !== null) return;
    setSelected(id);
    if (id === "correct") setScore((s) => s + 1);
  }, [selected]);

  const handleNext = useCallback(() => {
    const next = index + 1;
    if (next >= QUIZ_SIZE) { saveResult(level, score); setFinished(true); }
    else { setIndex(next); setChoices(buildChoices(questions[next], level)); setSelected(null); }
  }, [index, score, questions, level, saveResult]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-pink-300 font-bold animate-pulse">🌸 {t.loading}</span>
      </div>
    );
  }

  const timeLabel = (h: number, m: number) =>
    m === 0 ? t.timeExact(h) : m === 30 ? t.timeHalf(h) : t.timeMinute(h, m);

  const current = questions[index];
  const config = CLOCK_CONFIG[level];
  const isCorrect = selected === "correct";
  const stars = scoreToStars(score);

  if (finished) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 max-w-lg mx-auto">
        <div
          className="rounded-3xl p-8 text-center w-full shadow-xl border border-pink-100 card-enter"
          style={{ background: "linear-gradient(135deg, #fdf2f8, #f5f3ff)" }}
        >
          <div className="text-6xl mb-3">{stars === 3 ? "🎉" : stars >= 1 ? "🌸" : "😊"}</div>
          <div className="flex justify-center gap-1 text-sm mb-3"><span>💜</span><span>💗</span><span>💜</span></div>
          <h2
            className="text-2xl font-black mb-1"
            style={{ background: "linear-gradient(135deg, #db2777, #9333ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {stars >= 2 ? t.resultGreat : stars === 1 ? t.resultGood : t.resultTry}
          </h2>
          <p className="text-sm text-pink-400 mb-4">{t.resultScore(score, QUIZ_SIZE)}</p>
          <div className="flex justify-center mb-6"><StarRating stars={stars} size="lg" /></div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/quiz?level=${level}`)}
              className="py-3 rounded-2xl font-black text-white text-lg shadow-lg btn-pop"
              style={{ background: "linear-gradient(135deg, #f472b6, #a855f7)", boxShadow: "0 4px 15px rgba(244,114,182,0.4)" }}
            >
              {t.playAgain}
            </button>
            <button onClick={() => router.push("/")} className="py-3 rounded-2xl bg-white font-black text-pink-400 border border-pink-100 shadow-sm">
              {t.goHome}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-6 max-w-lg mx-auto">
      <div className="w-full flex items-center mb-4">
        <button
          onClick={() => router.push("/")}
          className="text-pink-500 text-sm font-black bg-white/80 rounded-full px-3 py-1.5 shadow-sm border border-pink-100"
        >
          {t.back}
        </button>
        <span
          className="mx-auto text-sm font-black"
          style={{ background: "linear-gradient(135deg, #db2777, #9333ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {t.level} {level}「{t.levelNames[level]}」
        </span>
        <span className="text-sm font-bold text-pink-300">{index + 1}/{QUIZ_SIZE}</span>
      </div>

      <div className="w-full bg-pink-100 rounded-full h-3 mb-4 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{ width: `${(index / QUIZ_SIZE) * 100}%`, background: "linear-gradient(90deg, #f472b6, #c084fc)" }}
        />
      </div>

      <div className="mb-3" style={{ filter: "drop-shadow(0 8px 24px rgba(244,114,182,0.25))" }}>
        <AnalogClock hour={current.hour} minute={current.minute} config={config} size={260} />
      </div>

      <p
        className="text-xl font-black mb-4"
        style={{ background: "linear-gradient(135deg, #db2777, #9333ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        🌸 {t.question}
      </p>

      <div className="grid grid-cols-2 gap-3 w-full mb-4">
        {choices.map((choice) => {
          let style: React.CSSProperties = {};
          let cls = "py-4 rounded-2xl text-center font-black text-sm border-2 transition-all active:scale-95 ";
          if (selected === null) {
            cls += "bg-white border-pink-100 text-pink-600 hover:border-pink-300 hover:bg-pink-50 shadow-sm";
          } else if (choice.id === "correct") {
            cls += "border-emerald-300 text-white";
            style = { background: "linear-gradient(135deg, #34d399, #10b981)" };
          } else if (choice.id === selected) {
            cls += "bg-red-50 border-red-300 text-red-500";
          } else {
            cls += "bg-white border-gray-100 text-gray-300";
          }
          return (
            <button key={choice.id} onClick={() => handleSelect(choice.id)} className={cls} style={style}>
              {timeLabel(choice.hour, choice.minute)}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="w-full card-enter">
          <div
            className={`rounded-2xl px-4 py-3 text-center font-black mb-3 ${isCorrect ? "text-emerald-700" : "text-red-500"}`}
            style={isCorrect ? { background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" } : { background: "#fff0f0" }}
          >
            {isCorrect ? t.correct : t.wrong(timeLabel(current.hour, current.minute))}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-2xl font-black text-white text-lg shadow-lg active:scale-95 btn-pop"
            style={{ background: "linear-gradient(135deg, #f472b6, #a855f7)", boxShadow: "0 4px 15px rgba(244,114,182,0.4)" }}
          >
            {index + 1 < QUIZ_SIZE ? t.nextQuestion : t.viewResult}
          </button>
        </div>
      )}
    </main>
  );
}

export default function QuizPage() {
  return <Suspense><QuizContent /></Suspense>;
}
