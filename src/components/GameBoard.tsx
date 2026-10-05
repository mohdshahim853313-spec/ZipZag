import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Lightbulb } from 'lucide-react';
import { GridPos, Puzzle } from '../types';
import { sound } from '../utils/sound';

interface GameBoardProps {
  puzzle: Puzzle;
  path: GridPos[];
  onPathChange: (newPath: GridPos[]) => void;
  onError: (msg: string) => void;
  isCompleted: boolean;
  hintPos: GridPos | null;
  isSolving?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  puzzle,
  path,
  onPathChange,
  onError,
  isCompleted,
  hintPos,
  isSolving = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [shake, setShake] = useState(false);

  const { rows, cols, checkpoints } = puzzle;
  const maxDim = Math.max(rows, cols);
  const badgeSizeClass =
    maxDim <= 4
      ? 'w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base'
      : maxDim <= 5
      ? 'w-7 h-7 sm:w-9 sm:h-9 text-xs sm:text-sm'
      : maxDim <= 6
      ? 'w-6 h-6 sm:w-7 sm:h-7 text-[11px] sm:text-xs'
      : maxDim <= 7
      ? 'w-5 h-5 sm:w-6 sm:h-6 text-[10px] sm:text-[11px]'
      : maxDim <= 8
      ? 'w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] text-[9px] sm:text-[10px]'
      : 'w-4 h-4 sm:w-[19px] sm:h-[19px] text-[8px] sm:text-[9px]';

  // Determine which number is expected next
  const currentCheckpointsPassed = path.reduce((count, p) => {
    const val = checkpoints[`${p.r},${p.c}`];
    return val !== undefined ? Math.max(count, val) : count;
  }, 1);

  const nextExpectedNumber = currentCheckpointsPassed + 1;

  // Map of visited cells for fast lookup
  const visitedMap = React.useMemo(() => {
    const map = new Map<string, number>();
    path.forEach((p, idx) => {
      map.set(`${p.r},${p.c}`, idx);
    });
    return map;
  }, [path]);

  // Current head position
  const currentHead = path[path.length - 1];

  const lastErrorTimestampRef = useRef<number>(0);
  const lastTouchCellRef = useRef<string>('');

  const triggerError = useCallback((msg: string) => {
    const now = Date.now();
    // Prevent spamming errors/shaking during continuous touch drag
    if (now - lastErrorTimestampRef.current < 450) return;
    lastErrorTimestampRef.current = now;

    onError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }, [onError]);

  // Validate and apply a move to target cell (nr, nc)
  const attemptMove = useCallback((targetR: number, targetC: number, isExplicitInput = false) => {
    if (isCompleted || isSolving) return;

    // Check bounds
    if (targetR < 0 || targetR >= rows || targetC < 0 || targetC >= cols) {
      if (isExplicitInput) {
        triggerError('Cannot move outside the grid.');
      }
      return;
    }

    // If clicking on head itself, do nothing
    if (currentHead && currentHead.r === targetR && currentHead.c === targetC) return;

    const targetKey = `${targetR},${targetC}`;

    // If cell is already in path:
    if (visitedMap.has(targetKey)) {
      const idx = visitedMap.get(targetKey)!;
      // If clicking directly on a previous cell, rewind to that point
      if (idx < path.length - 1) {
        sound.playUndo();
        onPathChange(path.slice(0, idx + 1));
      } else if (isExplicitInput) {
        triggerError('Path cannot cross itself or revisit filled cells.');
      }
      return;
    }

    // Must be adjacent (up, down, left, right)
    const dr = Math.abs(targetR - currentHead.r);
    const dc = Math.abs(targetC - currentHead.c);
    const isAdjacent = (dr === 1 && dc === 0) || (dr === 0 && dc === 1);

    if (!isAdjacent) {
      if (isExplicitInput) {
        triggerError('Moves must be to an adjacent cell (up, down, left, right).');
      }
      return; // Ignore non-adjacent drags
    }

    // Check if stepping on a numbered cell
    const targetNumber = checkpoints[targetKey];
    if (targetNumber !== undefined) {
      if (targetNumber !== nextExpectedNumber) {
        triggerError('Oops! Follow the numbers in order.');
        return;
      } else {
        // If this is the final checkpoint, ensure all other cells are filled first
        if (targetNumber === puzzle.totalCheckpoints && path.length < rows * cols - 1) {
          triggerError(`Fill all cells on the board before reaching the final dot (${targetNumber})!`);
          return;
        }
        // Correct checkpoint reached!
        sound.playCheckpoint(targetNumber);
        sound.playTick(path.length);
      }
    } else {
      // Normal cell stepped into - play tactile tick!
      sound.playTick(path.length);
    }

    // Valid move!
    const newPath = [...path, { r: targetR, c: targetC }];
    onPathChange(newPath);
  }, [isCompleted, isSolving, rows, cols, currentHead, visitedMap, path, checkpoints, nextExpectedNumber, onPathChange, triggerError]);

  // Handle pointer events for drag drawing
  const handlePointerDown = (r: number, c: number) => {
    if (isCompleted || isSolving) return;
    setIsPointerDown(true);
    // If pointer down on head, keep drawing
    if (currentHead && currentHead.r === r && currentHead.c === c) return;
    attemptMove(r, c, true);
  };

  const handlePointerEnter = (r: number, c: number) => {
    if (!isPointerDown || isCompleted || isSolving) return;
    attemptMove(r, c, false);
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
    lastTouchCellRef.current = '';
  };

  useEffect(() => {
    const handleGlobalUp = () => {
      setIsPointerDown(false);
      lastTouchCellRef.current = '';
    };
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted || isSolving || !currentHead) return;
      let dr = 0;
      let dc = 0;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dr = -1;
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dr = 1;
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dc = -1;
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') dc = 1;
      else if (e.key === 'Backspace' || e.key === 'z' || e.key === 'Z') {
        if (path.length > 1) {
          sound.playUndo();
          onPathChange(path.slice(0, -1));
        }
        return;
      } else if (e.key === 'r' || e.key === 'R') {
        if (path.length > 1) {
          sound.playUndo();
          onPathChange(path.slice(0, 1));
        }
        return;
      } else {
        return;
      }
      e.preventDefault();
      attemptMove(currentHead.r + dr, currentHead.c + dc, true);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompleted, currentHead, attemptMove, path, onPathChange]);

  // Touch move calculation for mobile drag
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!elem) return;
    const cellElem = elem.closest('[data-cell-pos]') as HTMLElement | null;
    if (cellElem && cellElem.dataset.cellPos) {
      // If finger is still moving within the same cell, don't re-trigger attemptMove
      if (cellElem.dataset.cellPos === lastTouchCellRef.current) return;
      lastTouchCellRef.current = cellElem.dataset.cellPos;

      const [r, c] = cellElem.dataset.cellPos.split(',').map(Number);
      if (!isNaN(r) && !isNaN(c)) {
        attemptMove(r, c);
      }
    }
  };

  const handleTouchEnd = () => {
    lastTouchCellRef.current = '';
  };

  // SVG dimensions for smooth path rendering
  // Grid coordinates mapped to 0..100%
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;

  // Path polyline points in SVG coordinates (0 to 100)
  const pathD = path.length > 1
    ? path.reduce((d, p, idx) => {
        const x = (p.c + 0.5) * cellWidth;
        const y = (p.r + 0.5) * cellHeight;
        return idx === 0 ? `M ${x} ${y}` : `${d} L ${x} ${y}`;
      }, '')
    : '';

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto px-4 py-2 select-none flex flex-col items-center">
      <div
        ref={containerRef}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`relative w-full aspect-[${cols}/${rows}] max-w-[380px] sm:max-w-[420px] bg-white rounded-2xl border-2 border-slate-300/80 shadow-md p-1.5 touch-none transition-transform ${
          shake ? 'animate-shake' : ''
        }`}
        style={{
          aspectRatio: `${cols} / ${rows}`,
        }}
      >
        {/* Underlay: Grid Cells */}
        <div
          className="grid w-full h-full gap-[2px] bg-slate-200/90 rounded-xl overflow-hidden"
          style={{
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const key = `${r},${c}`;
              const isVisited = visitedMap.has(key);
              const isStart = checkpoints[key] === 1;
              const isHead = currentHead && currentHead.r === r && currentHead.c === c;
              const checkpointNum = checkpoints[key];
              const isHint = hintPos && hintPos.r === r && hintPos.c === c;
              const isNextTarget = checkpointNum === nextExpectedNumber;

              return (
                <div
                  key={key}
                  data-cell-pos={key}
                  onPointerDown={() => handlePointerDown(r, c)}
                  onPointerEnter={() => handlePointerEnter(r, c)}
                  className={`relative flex items-center justify-center transition-colors duration-150 cursor-pointer ${
                    isVisited
                      ? 'bg-orange-100/80' // warm sunny orange tint for ZipZag
                      : isStart
                      ? 'bg-orange-200/60' // starting cell subtle orange tint
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  {/* Enhanced Hint Pulsing Animation Indicator */}
                  {isHint && (
                    <>
                      {/* 1. Radar Ping Ripple (Expanding Wave) */}
                      <div className="absolute -inset-1 rounded-xl sm:rounded-2xl border-2 border-amber-400 bg-amber-400/30 animate-ping pointer-events-none z-25" />

                      {/* 2. Concentric Pulsing Aura with Glowing Breathing Animation */}
                      <div className="absolute inset-0 rounded-lg sm:rounded-xl border-[2.5px] border-amber-500 bg-gradient-to-tr from-amber-400/40 via-yellow-300/45 to-orange-400/30 shadow-[0_0_22px_rgba(245,158,11,0.95)] ring-2 ring-amber-400/70 animate-hint-pulse pointer-events-none z-25 flex items-center justify-center">
                        {/* If this cell does NOT have a numbered checkpoint, display an energetic glowing lightbulb beacon */}
                        {checkpointNum === undefined && (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-md animate-bounce">
                            <Lightbulb className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white drop-shadow-xs" />
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Active target pulse ring */}
                  {isNextTarget && !isVisited && !isHint && (
                    <div className="absolute inset-2 rounded-full border-2 border-orange-500/80 animate-ping pointer-events-none z-10" />
                  )}

                  {/* Checkpoint Dot Badge */}
                  {checkpointNum !== undefined && (
                    <div
                      className={`relative z-20 flex items-center justify-center rounded-full font-bold transition-transform shadow-xs ${badgeSizeClass} ${
                        isVisited
                          ? 'bg-slate-900 text-white'
                          : isHint
                          ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white ring-4 ring-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.95)] scale-110 animate-hint-pulse'
                          : isNextTarget
                          ? 'bg-slate-900 text-white ring-2 ring-orange-500 ring-offset-2 scale-105'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      <span className="font-bold tracking-tight">
                        {checkpointNum}
                      </span>
                    </div>
                  )}

                  {/* Head pulse halo if head is not on a number */}
                  {isHead && checkpointNum === undefined && (
                    <div className="relative z-20 w-3 h-3 rounded-full bg-orange-600 ring-4 ring-orange-300 animate-pulse" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Overlay: SVG Continuous Path */}
        <svg
          className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)] pointer-events-none z-15"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {pathD && (
            <>
              {/* Outer soft shadow/glow */}
              <path
                d={pathD}
                fill="none"
                stroke="#ea580c"
                strokeWidth={Math.min(cellWidth, cellHeight) * 0.42}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.2"
              />
              {/* Main vibrant electric orange line */}
              <path
                d={pathD}
                fill="none"
                stroke="#f97316" // ZipZag electric orange
                strokeWidth={Math.min(cellWidth, cellHeight) * 0.34}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Start node dot */}
          {path.length > 0 && (
            <circle
              cx={(path[0].c + 0.5) * cellWidth}
              cy={(path[0].r + 0.5) * cellHeight}
              r={Math.min(cellWidth, cellHeight) * 0.17}
              fill="#f97316"
            />
          )}

          {/* End node / head rounded cap */}
          {path.length > 0 && (
            <circle
              cx={(path[path.length - 1].c + 0.5) * cellWidth}
              cy={(path[path.length - 1].r + 0.5) * cellHeight}
              r={Math.min(cellWidth, cellHeight) * 0.17}
              fill="#f97316"
            />
          )}
        </svg>
      </div>
    </div>
  );
};
