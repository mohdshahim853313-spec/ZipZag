export interface SolveRecord {
  date: string; // YYYY-MM-DD
  timestamp: number;
  puzzleId: string;
  puzzleName: string;
  timeSeconds: number;
  moves: number;
}

export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  lastCompletedDate: string | null;
  totalSolved: number;
  solvedToday: boolean;
  history: SolveRecord[];
}

const STORAGE_KEY = 'linkedin_zip_streak_data_v1';

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaysBetween(dateStr1: string, dateStr2: string): number {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  const diffTime = date2.getTime() - date1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  maxStreak: 0,
  lastCompletedDate: null,
  totalSolved: 0,
  solvedToday: false,
  history: [],
};

/**
 * Get the current streak data from localStorage, evaluating whether streak is active today.
 */
export function getStreakData(): StreakData {
  if (typeof window === 'undefined') return DEFAULT_STREAK;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STREAK;

    const data: StreakData = JSON.parse(raw);
    const today = getLocalDateString();

    if (!data.lastCompletedDate) {
      return { ...data, solvedToday: false, currentStreak: 0 };
    }

    const daysDiff = getDaysBetween(data.lastCompletedDate, today);

    if (daysDiff === 0) {
      // Solved today!
      return { ...data, solvedToday: true };
    } else if (daysDiff === 1) {
      // Solved yesterday, streak still alive if solved today
      return { ...data, solvedToday: false };
    } else {
      // More than 1 day missed, streak is broken
      return { ...data, currentStreak: 0, solvedToday: false };
    }
  } catch {
    return DEFAULT_STREAK;
  }
}

/**
 * Record a puzzle completion and update daily streak.
 */
export function recordPuzzleCompletion(
  puzzleId: string,
  puzzleName: string,
  timeSeconds: number,
  moves: number
): { streakData: StreakData; streakIncreased: boolean } {
  if (typeof window === 'undefined') {
    return { streakData: DEFAULT_STREAK, streakIncreased: false };
  }

  try {
    const current = getStreakData();
    const today = getLocalDateString();
    let newCurrentStreak = current.currentStreak;
    let streakIncreased = false;

    if (!current.lastCompletedDate) {
      // First ever puzzle solved!
      newCurrentStreak = 1;
      streakIncreased = true;
    } else {
      const daysDiff = getDaysBetween(current.lastCompletedDate, today);
      if (daysDiff === 0) {
        // Already solved one today: keep current streak (or initialize to 1 if it was 0)
        if (newCurrentStreak === 0) {
          newCurrentStreak = 1;
          streakIncreased = true;
        }
      } else if (daysDiff === 1) {
        // Solved yesterday -> streak increments!
        newCurrentStreak += 1;
        streakIncreased = true;
      } else {
        // Missed one or more days -> streak restarts at 1
        newCurrentStreak = 1;
        streakIncreased = true;
      }
    }

    const newMaxStreak = Math.max(current.maxStreak, newCurrentStreak);
    const newTotalSolved = current.totalSolved + 1;

    const newRecord: SolveRecord = {
      date: today,
      timestamp: Date.now(),
      puzzleId,
      puzzleName,
      timeSeconds,
      moves,
    };

    const updatedData: StreakData = {
      currentStreak: newCurrentStreak,
      maxStreak: newMaxStreak,
      lastCompletedDate: today,
      totalSolved: newTotalSolved,
      solvedToday: true,
      history: [newRecord, ...(current.history || []).slice(0, 49)], // store up to 50 recent records
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return { streakData: updatedData, streakIncreased };
  } catch {
    return { streakData: DEFAULT_STREAK, streakIncreased: false };
  }
}
