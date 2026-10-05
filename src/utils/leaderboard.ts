export interface ScoreEntry {
  id: string;
  puzzleId: string;
  puzzleName: string;
  timeSeconds: number;
  moves: number;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

const LEADERBOARD_STORAGE_KEY = 'linkedin_zip_leaderboard_v1';

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatScoreTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Retrieve all high scores from localStorage, sorted by completion time (fastest first).
 */
export function getLeaderboard(puzzleId?: string): ScoreEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return [];

    let list: ScoreEntry[] = JSON.parse(raw);

    if (puzzleId && puzzleId !== 'all') {
      const altGridZapId = puzzleId.replace('zipzag-', 'gridzap-');
      const altZipZapId = puzzleId.replace('zipzag-', 'zipzap-');
      list = list.filter((s) => s.puzzleId === puzzleId || s.puzzleId === altGridZapId || s.puzzleId === altZipZapId);
    }

    // Sort: lowest timeSeconds first, then lowest moves
    list.sort((a, b) => {
      if (a.timeSeconds !== b.timeSeconds) {
        return a.timeSeconds - b.timeSeconds;
      }
      return a.moves - b.moves;
    });

    return list;
  } catch {
    return [];
  }
}

/**
 * Save a new completion score into the leaderboard.
 */
export function recordScore(
  puzzleId: string,
  puzzleName: string,
  timeSeconds: number,
  moves: number
): { entry: ScoreEntry; isPersonalBest: boolean } {
  const entry: ScoreEntry = {
    id: `score-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    puzzleId,
    puzzleName,
    timeSeconds,
    moves,
    date: getLocalDateString(),
    timestamp: Date.now(),
  };

  if (typeof window === 'undefined') {
    return { entry, isPersonalBest: true };
  }

  try {
    const existing = getLeaderboard();
    const puzzleScores = existing.filter((s) => s.puzzleId === puzzleId);

    const isPersonalBest =
      puzzleScores.length === 0 ||
      timeSeconds < Math.min(...puzzleScores.map((s) => s.timeSeconds));

    // Keep up to 100 top records overall
    const updated = [...existing, entry];
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated.slice(-100)));

    return { entry, isPersonalBest };
  } catch {
    return { entry, isPersonalBest: false };
  }
}

/**
 * Clear all leaderboard scores.
 */
export function clearLeaderboard(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
  } catch {}
}
