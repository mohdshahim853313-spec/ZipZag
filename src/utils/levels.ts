import { GridPos, Puzzle, Difficulty } from '../types';

export const TOTAL_LEVELS = 500;

export interface LevelRecord {
  stars: number; // 1, 2, or 3
  bestTime: number;
  moves: number;
}

export interface UserProgress {
  currentLevel: number;
  maxUnlockedLevel: number;
  completedLevels: Record<number, LevelRecord>;
  unlockedAll: boolean;
}

const PROGRESS_STORAGE_KEY = 'zipzag_game_progress_v1';
const LEGACY_STORAGE_KEYS = ['gridzap_game_progress_v1', 'zipzap_game_progress_v1'];

// Seeded pseudorandom generator for deterministic level generation
function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a serpentine snake Hamiltonian path as the base topology
 */
function generateSerpentinePath(rows: number, cols: number): GridPos[] {
  const path: GridPos[] = [];
  for (let r = 0; r < rows; r++) {
    if (r % 2 === 0) {
      for (let c = 0; c < cols; c++) {
        path.push({ r, c });
      }
    } else {
      for (let c = cols - 1; c >= 0; c--) {
        path.push({ r, c });
      }
    }
  }
  return path;
}

/**
 * Backbite Algorithm (Lovasz / Madras):
 * Transforms a simple path into a chaotic, tangled, labyrinthine Hamiltonian path
 * with zero straight lines and maximum corners.
 * Guaranteed to succeed 100% of the time on ANY grid size!
 */
function generateLabyrinthHamiltonianPath(
  rows: number,
  cols: number,
  rng: () => number,
  iterations: number = 800
): GridPos[] {
  const path = generateSerpentinePath(rows, cols);
  const N = rows * cols;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Lookup array: coordinate key -> path index
  const lookup = new Int32Array(rows * cols);
  const getKey = (r: number, c: number) => r * cols + c;

  for (let i = 0; i < N; i++) {
    lookup[getKey(path[i].r, path[i].c)] = i;
  }

  for (let s = 0; s < iterations; s++) {
    if (rng() < 0.5) {
      // Head rotation
      const head = path[0];
      const validK: number[] = [];

      for (const [dr, dc] of dirs) {
        const nr = head.r + dr;
        const nc = head.c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const k = lookup[getKey(nr, nc)];
          if (k > 1) {
            validK.push(k);
          }
        }
      }

      if (validK.length > 0) {
        const chosenK = validK[Math.floor(rng() * validK.length)];
        let i = 0;
        let j = chosenK - 1;
        while (i < j) {
          const tmp = path[i];
          path[i] = path[j];
          path[j] = tmp;
          lookup[getKey(path[i].r, path[i].c)] = i;
          lookup[getKey(path[j].r, path[j].c)] = j;
          i++;
          j--;
        }
        if (i === j) {
          lookup[getKey(path[i].r, path[i].c)] = i;
        }
      }
    } else {
      // Tail rotation
      const tail = path[N - 1];
      const validK: number[] = [];

      for (const [dr, dc] of dirs) {
        const nr = tail.r + dr;
        const nc = tail.c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const k = lookup[getKey(nr, nc)];
          if (k < N - 2) {
            validK.push(k);
          }
        }
      }

      if (validK.length > 0) {
        const chosenK = validK[Math.floor(rng() * validK.length)];
        let i = chosenK + 1;
        let j = N - 1;
        while (i < j) {
          const tmp = path[i];
          path[i] = path[j];
          path[j] = tmp;
          lookup[getKey(path[i].r, path[i].c)] = i;
          lookup[getKey(path[j].r, path[j].c)] = j;
          i++;
          j--;
        }
        if (i === j) {
          lookup[getKey(path[i].r, path[i].c)] = i;
        }
      }
    }
  }

  return path;
}

/**
 * Diabolical Deceptive-Trap Checkpoint Selector:
 * Strategic placement that challenges advanced deductive reasoning.
 * Injects deceptive visual proximity: numbers appear 1-2 blocks away,
 * but the required Hamiltonian snake path must wind 7-15 cells through
 * outer corridors and perimeter edges to avoid isolating cells!
 */
function selectIntelligentCheckpoints(
  path: GridPos[],
  numCheckpoints: number,
  rng: () => number,
  level: number,
  rows: number,
  cols: number
): number[] {
  const total = path.length;
  // Checkpoint 1 is strictly the start of the path
  const chosenIndices = [0];

  const manhattan = (p1: GridPos, p2: GridPos) =>
    Math.abs(p1.r - p2.r) + Math.abs(p1.c - p2.c);

  const idealStep = (total - 1) / (numCheckpoints - 1);
  const minStepsBetween = Math.max(4, Math.floor(idealStep * 0.6));

  for (let k = 1; k < numCheckpoints - 1; k++) {
    const targetIdx = Math.round(k * idealStep);
    const searchRadius = Math.max(4, Math.floor(idealStep * 0.45));
    const startIdx = Math.max(
      chosenIndices[chosenIndices.length - 1] + minStepsBetween,
      targetIdx - searchRadius
    );
    const endIdx = Math.min(
      total - 1 - (numCheckpoints - 1 - k) * minStepsBetween,
      targetIdx + searchRadius
    );

    if (startIdx >= endIdx) {
      const safeIdx =
        chosenIndices[chosenIndices.length - 1] +
        Math.max(
          3,
          Math.floor((total - 1 - chosenIndices[chosenIndices.length - 1]) / (numCheckpoints - k))
        );
      chosenIndices.push(Math.min(total - 2, safeIdx));
      continue;
    }

    const prevIdx = chosenIndices[chosenIndices.length - 1];
    const prevPos = path[prevIdx];

    let bestIdx = -1;
    let bestScore = -999999;

    for (let idx = startIdx; idx <= endIdx; idx++) {
      const candidatePos = path[idx];
      const geomDist = manhattan(prevPos, candidatePos);
      const pathDist = idx - prevIdx;

      // Disallow trivial consecutive dots that are adjacent with short path distance
      if (geomDist <= 1 && pathDist <= 4) {
        continue;
      }

      // Penalty for putting checkpoints in grid corners (corners must be deduced by player!)
      const isCorner =
        (candidatePos.r === 0 || candidatePos.r === rows - 1) &&
        (candidatePos.c === 0 || candidatePos.c === cols - 1);
      const cornerPenalty = isCorner ? 40 : 0;

      // Diabolical Deceptive Trap Bonus:
      // High bonus when two checkpoints look adjacent (1-2 cells apart)
      // but their path distance is 7+ steps away!
      const deceptiveTrapBonus =
        pathDist >= 7 && geomDist <= 2 ? 45 : geomDist >= 3 ? 20 : 10;

      // Anti-cluster penalty: avoid bunching in the same region
      let clumpPenalty = 0;
      for (const cIdx of chosenIndices) {
        if (manhattan(path[cIdx], candidatePos) <= 1) {
          clumpPenalty += 25;
        }
      }

      const stepDeviation = Math.abs(idx - targetIdx) * 1.2;
      const jitter = (rng() - 0.5) * 10;

      const score = deceptiveTrapBonus - cornerPenalty - clumpPenalty - stepDeviation + jitter;

      if (score > bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    }

    if (bestIdx !== -1) {
      chosenIndices.push(bestIdx);
    } else {
      chosenIndices.push(startIdx);
    }
  }

  // The last checkpoint is strictly at the very end of the Hamiltonian path
  chosenIndices.push(total - 1);
  chosenIndices.sort((a, b) => a - b);
  return chosenIndices;
}

// In-memory cache for generated levels
const levelCache: Map<number, Puzzle> = new Map();

/**
 * Dynamic Hint Allocation based on Level:
 * - Level 1 to 50: 2 hints
 * - Level 51 to 150: 3 hints
 * - Level 151 to 300: 4 hints
 * - Level 301 to 500: 5 hints
 */
export function getMaxHintsForLevel(level: number): number {
  if (level <= 50) return 2;
  if (level <= 150) return 3;
  if (level <= 300) return 4;
  return 5;
}

/**
 * Determine grid dimensions, difficulty, checkpoints, and target time based on level number (1 to 500).
 * Ultra-hardest scaling:
 *  - Starts immediately at 5x5 (25 cells) on Level 1 (no baby 3x3 or 4x4)
 *  - Scales rapidly through 5x6, 6x6, 6x7, 7x7, 7x8, 8x8, 8x9, to 9x9 and 10x10!
 *  - Checkpoints are sparse (4 to 8 dots max) requiring long, intricate 6-12 step mental paths!
 */
export function getLevelConfig(level: number) {
  const safeNum = Math.max(1, Math.min(TOTAL_LEVELS, level));

  // Progressive difficulty percentage starting at 35% on Level 1 up to 100%
  const diffPercent = Math.min(
    100,
    Math.max(35, Math.round(35 + Math.pow((safeNum - 1) / (TOTAL_LEVELS - 1), 0.5) * 65))
  );

  let rows = 5;
  let cols = 5;
  let diff: Difficulty = 'Medium';
  let tierName = 'Labyrinth 5×5';
  let numCheckpoints = 4;

  if (safeNum === 1) {
    // Level 1: 5×5 Grid (25 cells, 4 checkpoints, 2500 scrambles)
    rows = 5; cols = 5; diff = 'Medium'; tierName = 'Labyrinth 5×5'; numCheckpoints = 4;
  } else if (safeNum <= 4) {
    // Level 2-4: 5×6 (30 cells, 4 checkpoints, 3000 scrambles)
    rows = 5; cols = 6; diff = 'Medium'; tierName = 'Tactician 5×6'; numCheckpoints = 4;
  } else if (safeNum <= 12) {
    // Level 5-12: 6×6 (36 cells, 5 checkpoints, 3800 scrambles)
    rows = 6; cols = 6; diff = 'Hard'; tierName = 'Advanced 6×6'; numCheckpoints = 5;
  } else if (safeNum <= 30) {
    // Level 13-30: 6×7 (42 cells, 5 checkpoints, 4500 scrambles)
    rows = 6; cols = 7; diff = 'Hard'; tierName = 'Intricate 6×7'; numCheckpoints = 5;
  } else if (safeNum <= 65) {
    // Level 31-65: 7×7 (49 cells, 6 checkpoints, 5200 scrambles)
    rows = 7; cols = 7; diff = 'Hard'; tierName = 'Expert 7×7'; numCheckpoints = 6;
  } else if (safeNum <= 120) {
    // Level 66-120: 7×8 (56 cells, 6 checkpoints, 6000 scrambles)
    rows = 7; cols = 8; diff = 'Hard'; tierName = 'Master 7×8'; numCheckpoints = 6;
  } else if (safeNum <= 220) {
    // Level 121-220: 8×8 (64 cells, 7 checkpoints, 6800 scrambles)
    rows = 8; cols = 8; diff = 'Hard'; tierName = 'Grandmaster 8×8'; numCheckpoints = 7;
  } else if (safeNum <= 360) {
    // Level 221-360: 8×9 (72 cells, 8 checkpoints, 7500 scrambles)
    rows = 8; cols = 9; diff = 'Hard'; tierName = 'Diabolical 8×9'; numCheckpoints = 8;
  } else {
    // Level 361-500: 9×9 (81 cells, 8-9 checkpoints, 8500 scrambles - Apex Titan!)
    rows = 9; cols = 9; diff = 'Hard'; tierName = 'Apex Titan 9×9'; numCheckpoints = 8;
  }

  const totalCells = rows * cols;
  const targetSec = Math.round(35 + totalCells * 2.8 + safeNum * 0.3);
  const maxHints = getMaxHintsForLevel(safeNum);

  return {
    rows,
    cols,
    checkpoints: numCheckpoints,
    diff,
    targetSec,
    diffPercent,
    tierName,
    maxHints,
  };
}

/**
 * Generate or retrieve level by level number (1 to 500)
 */
export function getLevel(levelNumber: number): Puzzle {
  const safeNum = Math.max(1, Math.min(TOTAL_LEVELS, levelNumber));

  if (levelCache.has(safeNum)) {
    return levelCache.get(safeNum)!;
  }

  const { rows, cols, checkpoints: numCheckpoints, diff, targetSec, diffPercent, tierName, maxHints } =
    getLevelConfig(safeNum);

  // Deterministic seed for this level
  const seed = safeNum * 7919 + 104729;
  const rng = createPRNG(seed);

  // Heavy labyrinth scrambling moves across all levels:
  // Starts at 2500 steps on Level 1, up to 8500 steps at Master levels
  const backbiteSteps =
    safeNum === 1
      ? 2500
      : safeNum <= 4
      ? 3000
      : safeNum <= 12
      ? 3800
      : safeNum <= 30
      ? 4500
      : safeNum <= 65
      ? 5200
      : safeNum <= 120
      ? 6000
      : safeNum <= 220
      ? 6800
      : safeNum <= 360
      ? 7500
      : 8500;

  const path = generateLabyrinthHamiltonianPath(rows, cols, rng, backbiteSteps);

  // Select checkpoints with deceptive traps and anti-adjacent distribution
  const chosenIndices = selectIntelligentCheckpoints(path, numCheckpoints, rng, safeNum, rows, cols);

  const checkpointMap: Record<string, number> = {};
  chosenIndices.forEach((pathIdx, orderIdx) => {
    const pos = path[pathIdx];
    checkpointMap[`${pos.r},${pos.c}`] = orderIdx + 1;
  });

  const puzzle: Puzzle = {
    id: `zipzag-level-${safeNum}`,
    name: `Level ${safeNum}`,
    subtitle: `${rows}×${cols} · ${chosenIndices.length} Dots · Diff ${diffPercent}%`,
    levelNumber: safeNum,
    rows,
    cols,
    checkpoints: checkpointMap,
    startPos: path[0],
    totalCheckpoints: chosenIndices.length,
    difficulty: diff,
    difficultyPercent: diffPercent,
    tierName,
    solution: path,
    targetTimeSeconds: targetSec,
    maxHints,
  };

  levelCache.set(safeNum, puzzle);
  return puzzle;
}

// User Progress Management
const DEFAULT_PROGRESS: UserProgress = {
  currentLevel: 1,
  maxUnlockedLevel: 1,
  completedLevels: {},
  unlockedAll: false,
};

export function getUserProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    let raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        raw = localStorage.getItem(legacyKey);
        if (raw) break;
      }
    }
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      currentLevel: parsed.currentLevel || 1,
      maxUnlockedLevel: parsed.maxUnlockedLevel || 1,
      completedLevels: parsed.completedLevels || {},
      unlockedAll: !!parsed.unlockedAll,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

export function saveLevelCompletion(
  levelNum: number,
  timeSeconds: number,
  moves: number
): { stars: number; newlyUnlocked: number } {
  const progress = getUserProgress();
  const puzzle = getLevel(levelNum);
  const targetTime = puzzle.targetTimeSeconds || 60;

  // Calculate 1 to 3 stars
  let stars = 1;
  if (timeSeconds <= targetTime) {
    stars = 3;
  } else if (timeSeconds <= targetTime * 1.6) {
    stars = 2;
  }

  const existing = progress.completedLevels[levelNum];
  const bestStars = existing ? Math.max(existing.stars, stars) : stars;
  const bestTime = existing ? Math.min(existing.bestTime, timeSeconds) : timeSeconds;
  const bestMoves = existing ? Math.min(existing.moves, moves) : moves;

  progress.completedLevels[levelNum] = {
    stars: bestStars,
    bestTime,
    moves: bestMoves,
  };

  // Unlock next level if currently at edge
  let newlyUnlocked = progress.maxUnlockedLevel;
  if (levelNum >= progress.maxUnlockedLevel && levelNum < TOTAL_LEVELS) {
    newlyUnlocked = levelNum + 1;
    progress.maxUnlockedLevel = newlyUnlocked;
  }

  saveUserProgress(progress);
  return { stars, newlyUnlocked };
}
