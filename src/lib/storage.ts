import type { AppProgress, Level } from "@/types";

const STORAGE_KEY = "studyclock_progress";

export function defaultProgress(): AppProgress {
  return {
    levels: {
      1: { level: 1, stars: 0, bestScore: 0, attempts: 0, unlocked: true },
      2: { level: 2, stars: 0, bestScore: 0, attempts: 0, unlocked: false },
      3: { level: 3, stars: 0, bestScore: 0, attempts: 0, unlocked: false },
      4: { level: 4, stars: 0, bestScore: 0, attempts: 0, unlocked: false },
    },
    lastUpdated: new Date().toISOString(),
  };
}

export function loadProgress(): AppProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return JSON.parse(raw) as AppProgress;
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: AppProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...progress, lastUpdated: new Date().toISOString() })
  );
}

export function scoreToStars(score: number): 0 | 1 | 2 | 3 {
  if (score >= 9) return 3;
  if (score >= 7) return 2;
  if (score >= 5) return 1;
  return 0;
}

export function recordResult(
  progress: AppProgress,
  level: Level,
  score: number
): AppProgress {
  const stars = scoreToStars(score);
  const prev = progress.levels[level];
  const next = nextLevel(level);

  const updated: AppProgress = {
    ...progress,
    levels: {
      ...progress.levels,
      [level]: {
        ...prev,
        stars: Math.max(prev.stars, stars) as 0 | 1 | 2 | 3,
        bestScore: Math.max(prev.bestScore, score),
        attempts: prev.attempts + 1,
      },
    },
  };

  // 星1以上取得でつぎのレベルを解放
  if (stars >= 1 && next && !updated.levels[next].unlocked) {
    updated.levels[next] = { ...updated.levels[next], unlocked: true };
  }

  return updated;
}

function nextLevel(level: Level): Level | null {
  if (level === 4) return null;
  return (level + 1) as Level;
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
