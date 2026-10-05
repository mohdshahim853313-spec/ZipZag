import { GridPos, Puzzle, Difficulty } from '../types';

/**
 * Generate a Hamiltonian path on an R x C grid using randomized Warnsdorff's heuristic
 */
export function generateHamiltonianPath(rows: number, cols: number, maxAttempts: number = 80): GridPos[] | null {
  const totalCells = rows * cols;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const path: GridPos[] = [];

    const getDegree = (r: number, c: number) => {
      let deg = 0;
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
          deg++;
        }
      }
      return deg;
    };

    const dfs = (r: number, c: number): boolean => {
      visited[r][c] = true;
      path.push({ r, c });

      if (path.length === totalCells) {
        return true;
      }

      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      const neighbors: { r: number; c: number; deg: number; rnd: number }[] = [];

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
          neighbors.push({
            r: nr,
            c: nc,
            deg: getDegree(nr, nc),
            rnd: Math.random(),
          });
        }
      }

      // Sort by Warnsdorff's heuristic: lowest degree first, randomized ties
      neighbors.sort((a, b) => a.deg === b.deg ? a.rnd - b.rnd : a.deg - b.deg);

      for (const n of neighbors) {
        if (dfs(n.r, n.c)) return true;
      }

      visited[r][c] = false;
      path.pop();
      return false;
    };

    // Pick a starting point (often an edge or corner is ideal, or random)
    const sr = Math.floor(Math.random() * rows);
    const sc = Math.floor(Math.random() * cols);

    if (dfs(sr, sc)) {
      return path;
    }
  }

  return null;
}

/**
 * Generate a complete, verified solvable Zip Puzzle
 */
export function createPuzzleFromPath(
  path: GridPos[],
  rows: number,
  cols: number,
  numCheckpoints: number,
  name: string,
  difficulty: Difficulty
): Puzzle {
  const checkpoints: Record<string, number> = {};
  const total = path.length;

  // Number 1 is always the start of the path
  checkpoints[`${path[0].r},${path[0].c}`] = 1;

  // Distribute remaining checkpoints evenly along the path
  // E.g. for N checkpoints, pick intermediate indices
  const step = Math.floor((total - 1) / (numCheckpoints - 1));
  const chosenIndices = [0];

  for (let k = 1; k < numCheckpoints - 1; k++) {
    const rawIndex = k * step;
    // Add small jitter of +/- 1 or 2
    const jitter = Math.floor(Math.random() * 3) - 1;
    const finalIndex = Math.max(1, Math.min(total - 2, rawIndex + jitter));
    if (!chosenIndices.includes(finalIndex)) {
      chosenIndices.push(finalIndex);
    }
  }

  // Last checkpoint near or at end of path
  chosenIndices.push(total - 1);
  chosenIndices.sort((a, b) => a - b);

  chosenIndices.forEach((pathIdx, orderIdx) => {
    const pos = path[pathIdx];
    checkpoints[`${pos.r},${pos.c}`] = orderIdx + 1;
  });

  return {
    id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    subtitle: `${rows}×${cols} · ${chosenIndices.length} checkpoints`,
    rows,
    cols,
    checkpoints,
    startPos: path[0],
    totalCheckpoints: chosenIndices.length,
    difficulty,
    solution: path,
  };
}

/**
 * Procedurally generate a new puzzle with guaranteed solution
 */
export function generateRandomPuzzle(
  difficulty: 'Easy' | 'Medium' | 'Hard'
): Puzzle {
  let rows = 5;
  let cols = 5;
  let numCheckpoints = 5;

  if (difficulty === 'Easy') {
    rows = 4;
    cols = 5;
    numCheckpoints = 5;
  } else if (difficulty === 'Medium') {
    rows = 5;
    cols = 5;
    numCheckpoints = 6;
  } else if (difficulty === 'Hard') {
    rows = 6;
    cols = 6;
    numCheckpoints = 8;
  }

  const path = generateHamiltonianPath(rows, cols);
  if (!path) {
    // Fallback simple zigzag path
    const fallbackPath: GridPos[] = [];
    for (let r = 0; r < rows; r++) {
      if (r % 2 === 0) {
        for (let c = 0; c < cols; c++) fallbackPath.push({ r, c });
      } else {
        for (let c = cols - 1; c >= 0; c--) fallbackPath.push({ r, c });
      }
    }
    return createPuzzleFromPath(
      fallbackPath,
      rows,
      cols,
      numCheckpoints,
      `${difficulty} Challenge`,
      difficulty
    );
  }

  return createPuzzleFromPath(
    path,
    rows,
    cols,
    numCheckpoints,
    `${difficulty} Challenge`,
    difficulty
  );
}
