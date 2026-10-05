import React, { useState, useMemo } from 'react';
import { Lock, Star, Grid, Search, Unlock, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { TOTAL_LEVELS, UserProgress } from '../utils/levels';

interface LevelsScreenProps {
  currentLevel: number;
  progress: UserProgress;
  onSelectLevel: (levelNum: number) => void;
  onToggleUnlockAll: () => void;
  onGoToGame: () => void;
}

const CHAPTERS = [
  { name: 'Beginner', start: 1, end: 50 },
  { name: 'Novice', start: 51, end: 100 },
  { name: 'Apprentice', start: 101, end: 200 },
  { name: 'Expert', start: 201, end: 350 },
  { name: 'Master', start: 351, end: 500 },
];

export const LevelsScreen: React.FC<LevelsScreenProps> = ({
  currentLevel,
  progress,
  onSelectLevel,
  onToggleUnlockAll,
  onGoToGame,
}) => {
  const initialChapterIndex = useMemo(() => {
    const idx = CHAPTERS.findIndex(
      (c) => currentLevel >= c.start && currentLevel <= c.end
    );
    return idx !== -1 ? idx : 0;
  }, [currentLevel]);

  const [activeChapter, setActiveChapter] = useState(initialChapterIndex);
  const [jumpInput, setJumpInput] = useState('');

  const currentChapter = CHAPTERS[activeChapter];
  const levelsInChapter = Array.from(
    { length: currentChapter.end - currentChapter.start + 1 },
    (_, i) => currentChapter.start + i
  );

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpInput.trim(), 10);
    if (!isNaN(num) && num >= 1 && num <= TOTAL_LEVELS) {
      if (progress.unlockedAll || num <= progress.maxUnlockedLevel) {
        onSelectLevel(num);
      } else {
        alert(`Level ${num} is locked! Complete level ${progress.maxUnlockedLevel} first, or enable "Unlock All".`);
      }
    }
  };

  const totalStarsEarned = Object.values(progress.completedLevels).reduce(
    (sum, record) => sum + record.stars,
    0
  );

  const completedCount = Object.keys(progress.completedLevels).length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col pb-24 sm:pb-12 select-none">
      {/* Top Page Header with Mobile Safe Area */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs safe-top-area">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white flex items-center justify-center font-black shadow-sm shrink-0">
              <Grid className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-black text-slate-900 flex items-center gap-1.5 truncate">
                <span>Levels</span>
                <span className="text-[10px] sm:text-xs text-orange-600 font-bold bg-orange-100 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                  1-500
                </span>
              </h1>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-500" />
                  {totalStarsEarned}
                </span>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  {completedCount} Cleared
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onGoToGame}
            className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white shrink-0" />
            <span className="whitespace-nowrap">Play Lvl {currentLevel}</span>
          </button>
        </div>

        {/* Quick Jump & Controls Bar */}
        <div className="bg-slate-50/90 border-t border-slate-100 px-3 sm:px-4 py-1.5 sm:py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 text-xs">
            <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5 min-w-0 flex-1">
              <div className="relative flex-1 max-w-[130px] sm:max-w-[170px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  min="1"
                  max={TOTAL_LEVELS}
                  placeholder="Jump (1-500)"
                  value={jumpInput}
                  onChange={(e) => setJumpInput(e.target.value)}
                  className="w-full pl-6.5 sm:pl-7 pr-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors shadow-2xs shrink-0"
              >
                Go
              </button>
            </form>

            <button
              onClick={onToggleUnlockAll}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-lg font-bold text-xs border transition-colors cursor-pointer shrink-0 ${
                progress.unlockedAll
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Unlock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{progress.unlockedAll ? 'Unlocked ✓' : 'Unlock All'}</span>
            </button>
          </div>
        </div>

        {/* Chapter Category Pills */}
        <div className="px-3 sm:px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar">
          <div className="max-w-4xl mx-auto flex items-center gap-1.5 sm:gap-2">
            {CHAPTERS.map((chap, idx) => {
              const isActive = activeChapter === idx;
              return (
                <button
                  key={chap.name}
                  onClick={() => setActiveChapter(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {chap.name} ({chap.start}-{chap.end})
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Levels Grid */}
      <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 flex-1">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-3.5">
          {levelsInChapter.map((num) => {
            const isLocked = !progress.unlockedAll && num > progress.maxUnlockedLevel;
            const isCurrent = num === currentLevel;
            const completed = progress.completedLevels[num];
            const stars = completed?.stars || 0;

            return (
              <button
                key={num}
                disabled={isLocked}
                onClick={() => onSelectLevel(num)}
                className={`relative p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all cursor-pointer min-h-[82px] border ${
                  isLocked
                    ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                    : isCurrent
                    ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/30 text-orange-950 font-black shadow-md'
                    : completed
                    ? 'bg-white border-slate-200 hover:border-orange-300 text-slate-900 hover:shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                {/* Level number or lock */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black tabular-nums">{num}</span>
                  {isLocked ? (
                    <Lock className="w-3 h-3 text-slate-400" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                  ) : null}
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-0.5 my-1">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-3 h-3 ${
                        stars >= starIdx
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Best time or play status */}
                <div className="text-[10px] text-slate-400 font-medium">
                  {completed ? (
                    <span className="text-emerald-700 font-semibold tabular-nums">
                      {Math.floor(completed.bestTime / 60)}:
                      {(completed.bestTime % 60).toString().padStart(2, '0')}
                    </span>
                  ) : isLocked ? (
                    'Locked'
                  ) : (
                    <span className="text-orange-600 font-bold">Play</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
