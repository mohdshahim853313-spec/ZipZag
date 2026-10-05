export interface GridPos {
  r: number;
  c: number;
}

export type Difficulty = 'Tutorial' | 'Daily' | 'Easy' | 'Medium' | 'Hard' | 'Custom';

export interface Puzzle {
  id: string;
  name: string;
  subtitle: string;
  levelNumber?: number;
  rows: number;
  cols: number;
  checkpoints: Record<string, number>; // key: "r,c", value: number (1, 2, 3...)
  startPos: GridPos;
  totalCheckpoints: number;
  difficulty: Difficulty;
  difficultyPercent?: number; // 1 to 100%
  tierName?: string;
  solution?: GridPos[]; // full sequence of coordinates if pre-calculated
  targetTimeSeconds?: number;
  maxHints?: number;
}

export interface MoveStep {
  pos: GridPos;
  checkpointPassed?: number;
}
