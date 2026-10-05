import { Puzzle } from '../types';

export const TUTORIAL_PUZZLE: Puzzle = {
  id: 'starter-4x5',
  name: 'Starter Circuit',
  subtitle: '4×5 · 6 checkpoints (ZipZag Intro)',
  rows: 4,
  cols: 5,
  checkpoints: {
    '2,0': 1,
    '3,2': 2,
    '2,4': 3,
    '2,2': 4,
    '0,0': 5,
    '1,2': 6,
  },
  startPos: { r: 2, c: 0 },
  totalCheckpoints: 6,
  difficulty: 'Tutorial',
  solution: [
    { r: 2, c: 0 }, { r: 3, c: 0 }, { r: 3, c: 1 }, { r: 3, c: 2 }, { r: 3, c: 3 },
    { r: 3, c: 4 }, { r: 2, c: 4 }, { r: 2, c: 3 }, { r: 2, c: 2 }, { r: 2, c: 1 },
    { r: 1, c: 1 }, { r: 1, c: 0 }, { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
    { r: 0, c: 3 }, { r: 0, c: 4 }, { r: 1, c: 4 }, { r: 1, c: 3 }, { r: 1, c: 2 }
  ],
};

export const MASTER_PUZZLE: Puzzle = {
  id: 'master-7x6',
  name: 'Grand Labyrinth (7×6)',
  subtitle: '7×6 · 9 checkpoints (Master Challenge)',
  rows: 7,
  cols: 6,
  checkpoints: {
    '2,0': 1,
    '0,3': 2,
    '1,4': 3,
    '3,0': 4,
    '4,1': 5,
    '6,3': 6,
    '4,5': 7,
    '3,4': 8,
    '3,2': 9,
  },
  startPos: { r: 2, c: 0 },
  totalCheckpoints: 9,
  difficulty: 'Daily',
  solution: [
    { r: 2, c: 0 }, { r: 1, c: 0 }, { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
    { r: 0, c: 3 }, { r: 0, c: 4 }, { r: 0, c: 5 }, { r: 1, c: 5 }, { r: 1, c: 4 },
    { r: 1, c: 3 }, { r: 1, c: 2 }, { r: 1, c: 1 }, { r: 2, c: 1 }, { r: 3, c: 1 },
    { r: 3, c: 0 }, { r: 4, c: 0 }, { r: 5, c: 0 }, { r: 6, c: 0 }, { r: 6, c: 1 },
    { r: 5, c: 1 }, { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 5, c: 2 }, { r: 6, c: 2 },
    { r: 6, c: 3 }, { r: 5, c: 3 }, { r: 5, c: 4 }, { r: 6, c: 4 }, { r: 6, c: 5 },
    { r: 5, c: 5 }, { r: 4, c: 5 }, { r: 3, c: 5 }, { r: 2, c: 5 }, { r: 2, c: 4 },
    { r: 3, c: 4 }, { r: 4, c: 4 }, { r: 4, c: 3 }, { r: 3, c: 3 }, { r: 2, c: 3 },
    { r: 2, c: 2 }, { r: 3, c: 2 }
  ],
};

// Backward-compatible alias
export const SCREENSHOT_PUZZLE = MASTER_PUZZLE;

export const DAILY_PUZZLES: Puzzle[] = [
  TUTORIAL_PUZZLE,
  MASTER_PUZZLE,
  {
    id: 'daily-quick-5x5',
    name: 'ZipZag Quick #1',
    subtitle: '5×5 · 5 checkpoints',
    rows: 5,
    cols: 5,
    checkpoints: {
      '3,3': 1,
      '3,2': 2,
      '3,0': 3,
      '1,4': 4,
      '3,1': 5,
    },
    startPos: { r: 3, c: 3 },
    totalCheckpoints: 5,
    difficulty: 'Easy',
    solution: [
      { r: 3, c: 3 }, { r: 4, c: 3 }, { r: 4, c: 4 }, { r: 3, c: 4 }, { r: 2, c: 4 },
      { r: 2, c: 3 }, { r: 2, c: 2 }, { r: 3, c: 2 }, { r: 4, c: 2 }, { r: 4, c: 1 },
      { r: 4, c: 0 }, { r: 3, c: 0 }, { r: 2, c: 0 }, { r: 1, c: 0 }, { r: 0, c: 0 },
      { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 }, { r: 1, c: 4 },
      { r: 1, c: 3 }, { r: 1, c: 2 }, { r: 1, c: 1 }, { r: 2, c: 1 }, { r: 3, c: 1 }
    ],
  },
  {
    id: 'daily-quick-6x6',
    name: 'ZipZag Quick #2',
    subtitle: '6×6 · 7 checkpoints',
    rows: 6,
    cols: 6,
    checkpoints: {
      '4,4': 1,
      '5,3': 2,
      '4,0': 3,
      '2,1': 4,
      '1,1': 5,
      '1,5': 6,
      '4,1': 7,
    },
    startPos: { r: 4, c: 4 },
    totalCheckpoints: 7,
    difficulty: 'Medium',
    solution: [
      { r: 4, c: 4 }, { r: 3, c: 4 }, { r: 3, c: 5 }, { r: 4, c: 5 }, { r: 5, c: 5 },
      { r: 5, c: 4 }, { r: 5, c: 3 }, { r: 5, c: 2 }, { r: 5, c: 1 }, { r: 5, c: 0 },
      { r: 4, c: 0 }, { r: 3, c: 0 }, { r: 3, c: 1 }, { r: 3, c: 2 }, { r: 2, c: 2 },
      { r: 2, c: 1 }, { r: 2, c: 0 }, { r: 1, c: 0 }, { r: 0, c: 0 }, { r: 0, c: 1 },
      { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 },
      { r: 0, c: 5 }, { r: 1, c: 5 }, { r: 2, c: 5 }, { r: 2, c: 4 }, { r: 1, c: 4 },
      { r: 1, c: 3 }, { r: 2, c: 3 }, { r: 3, c: 3 }, { r: 4, c: 3 }, { r: 4, c: 2 },
      { r: 4, c: 1 }
    ],
  },
  {
    id: 'daily-core-7x6',
    name: 'Daily Zap #3',
    subtitle: '7×6 · 9 checkpoints',
    rows: 7,
    cols: 6,
    checkpoints: {
      '1,1': 1,
      '0,0': 2,
      '6,0': 3,
      '3,1': 4,
      '2,3': 5,
      '0,5': 6,
      '5,5': 7,
      '4,3': 8,
      '6,5': 9,
    },
    startPos: { r: 1, c: 1 },
    totalCheckpoints: 9,
    difficulty: 'Hard',
    solution: [
      { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 0, c: 2 }, { r: 0, c: 1 }, { r: 0, c: 0 },
      { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 }, { r: 4, c: 0 }, { r: 5, c: 0 },
      { r: 6, c: 0 }, { r: 6, c: 1 }, { r: 5, c: 1 }, { r: 4, c: 1 }, { r: 4, c: 2 },
      { r: 3, c: 2 }, { r: 3, c: 1 }, { r: 2, c: 1 }, { r: 2, c: 2 }, { r: 2, c: 3 },
      { r: 2, c: 4 }, { r: 1, c: 4 }, { r: 1, c: 3 }, { r: 0, c: 3 }, { r: 0, c: 4 },
      { r: 0, c: 5 }, { r: 1, c: 5 }, { r: 2, c: 5 }, { r: 3, c: 5 }, { r: 4, c: 5 },
      { r: 5, c: 5 }, { r: 5, c: 4 }, { r: 4, c: 4 }, { r: 3, c: 4 }, { r: 3, c: 3 },
      { r: 4, c: 3 }, { r: 5, c: 3 }, { r: 5, c: 2 }, { r: 6, c: 2 }, { r: 6, c: 3 },
      { r: 6, c: 4 }, { r: 6, c: 5 }
    ],
  },
];
