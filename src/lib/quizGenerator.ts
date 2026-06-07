import type { Level, QuizQuestion } from "@/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** レベルに対応した全候補時刻を生成 */
function generateCandidates(level: Level): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  for (let h = 1; h <= 12; h++) {
    if (level === 1) {
      questions.push({ hour: h, minute: 0 });
    } else if (level === 2) {
      questions.push({ hour: h, minute: 0 });
      questions.push({ hour: h, minute: 30 });
    } else if (level === 3) {
      for (let m = 0; m < 60; m += 5) {
        questions.push({ hour: h, minute: m });
      }
    } else {
      for (let m = 0; m < 60; m++) {
        questions.push({ hour: h, minute: m });
      }
    }
  }
  return questions;
}

/** クイズ問題を10問生成 */
export function generateQuiz(level: Level): QuizQuestion[] {
  const candidates = generateCandidates(level);
  return shuffle(candidates).slice(0, 10);
}

/** 不正解の選択肢を3つ生成（重複・正解と被らないように） */
export function generateWrongChoices(
  correct: QuizQuestion,
  level: Level
): QuizQuestion[] {
  const candidates = generateCandidates(level).filter(
    (q) => !(q.hour === correct.hour && q.minute === correct.minute)
  );
  return shuffle(candidates).slice(0, 3);
}
