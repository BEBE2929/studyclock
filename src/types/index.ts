export type Level = 1 | 2 | 3 | 4;

export type LevelProgress = {
  level: Level;
  stars: 0 | 1 | 2 | 3;
  bestScore: number;
  attempts: number;
  unlocked: boolean;
};

export type AppProgress = {
  levels: Record<Level, LevelProgress>;
  lastUpdated: string;
};

export type QuizQuestion = {
  hour: number;   // 1-12
  minute: number; // 0-59
};

export type ClockDisplayConfig = {
  showAllMinuteNumbers: boolean;
  showFiveMinuteNumbers: boolean;
  showColorSections: boolean;
};

export const LEVEL_NAMES: Record<Level, string> = {
  1: "にゅうもん",
  2: "しょきゅう",
  3: "ちゅうきゅう",
  4: "じょうきゅう",
};

export const CLOCK_CONFIG: Record<Level, ClockDisplayConfig> = {
  1: { showAllMinuteNumbers: true,  showFiveMinuteNumbers: true,  showColorSections: true  },
  2: { showAllMinuteNumbers: true,  showFiveMinuteNumbers: true,  showColorSections: true  },
  3: { showAllMinuteNumbers: false, showFiveMinuteNumbers: true,  showColorSections: false },
  4: { showAllMinuteNumbers: false, showFiveMinuteNumbers: false, showColorSections: false },
};

export const QUIZ_SIZE = 10;
