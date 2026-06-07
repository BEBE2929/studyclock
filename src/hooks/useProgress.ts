"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppProgress, Level } from "@/types";
import {
  loadProgress,
  saveProgress,
  recordResult,
  resetProgress,
  defaultProgress,
} from "@/lib/storage";

export function useProgress() {
  const [progress, setProgress] = useState<AppProgress>(defaultProgress);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const saveResult = useCallback(
    (level: Level, score: number) => {
      const updated = recordResult(progress, level, score);
      saveProgress(updated);
      setProgress(updated);
    },
    [progress]
  );

  const reset = useCallback(() => {
    resetProgress();
    setProgress(defaultProgress());
  }, []);

  return { progress, saveResult, reset };
}
