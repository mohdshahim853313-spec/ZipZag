import React, { useState, useMemo } from 'react';
import { X, Lock, Star, Grid, Search, Unlock, ArrowRight } from 'lucide-react';
import { TOTAL_LEVELS, UserProgress } from '../utils/levels';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  progress: UserProgress;
  onSelectLevel: (levelNum: number) => void;
  onToggleUnlockAll: () => void;
}

const CHAPTERS = [
  { name: 'Beginner', start: 1, end: 50 },
  { name: 'Novice', start: 51, end: 100 },
  { name: 'Apprentice', start: 101, end: 200 },
  { name: 'Expert', start: 201, end: 350 },
  { name: 'Master', start: 351, end: 500 },
];

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  progress,
  onSelectLevel,
  onToggleUnlockAll,
}) => {
  // Current active chapter range
  const initialChapterIndex = useMemo(() => {
    const idx = CHAPTERS.findIndex(
      (c) => currentLevel >= c.start && currentLevel <= c.end
    );
    return idx !== -1 ? idx : 0;
  }, [currentLevel]);

  const [activeChapter, setActiveChapter] = useState(initialChapterIndex);
  const [jumpInput, setJumpInput] = useState('');

  if (!isOpen) return null;

  const currentChapter = CHAPTERS[activeChapter];

  // List of levels for current chapter
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
        onClose();
      } else {
        alert(`Level ${num} is locked! Complete level ${progress.maxUnlockedLevel} first, or enable "Unlock All Levels".`);
      }
    }
  };

  const totalStarsEarned = Object.values(progress.completedLevels).reduce(
    (sum, record) => sum + record.stars,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)] bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 bg-orange-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white flex items-center justify-center font-black shadow-sm">
              <Grid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                ZipZag Levels <span className="text-xs text-orange-600 font-bold bg-orange-100 px-1.5 py-0.5 rounded-full">1 - 500</span>
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-0.5 text-amber-600">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  {totalStarsEarned} Stars
                </span>
                <span>·</span>
                <span>Max Unlocked: Level {progress.maxUnlockedLevel}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Jump & Unlock All Bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-3 text-xs shrink-0">
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                min="1"
                max={TOTAL_LEVELS}
                placeholder="Jump to 1-500..."
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                className="w-32 pl-7 pr-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-2xs transition-colors"
            >
              Go
            </button>
          </form>

          {/* Unlock all toggle */}
          <button
            onClick={onToggleUnlockAll}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs border transition-colors cursor-pointer ${
              progress.unlockedAll
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
            title="Toggle whether all 500 levels are freely playable"
          >
            <Unlock className="w-3 h-3" />
            <span>{progress.unlockedAll ? 'All Unlocked ✓' : 'Unlock All'}</span>
          </button>
        </div>

        {/* Chapter Tabs */}
        <div className="flex items-center px-4 py-2 bg-white border-b border-slate-100 overflow-x-auto gap-1.5 shrink-0 no-scrollbar">
          {CHAPTERS.map((chap, idx) => {
            const isActive = activeChapter === idx;
            return (
              <button
                key={chap.name}
                onClick={() => setActiveChapter(idx)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* Level Grid */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
            {levelsInChapter.map((num) => {
              const isLocked = !progress.unlockedAll && num > progress.maxUnlockedLevel;
              const isCurrent = num === currentLevel;
              const completed = progress.completedLevels[num];
              const stars = completed?.stars || 0;

              return (
                <button
                  key={num}
                  disabled={isLocked}
                  onClick={() => {
                    onSelectLevel(num);
                    onClose();
                  }}
                  className={`relative p-2.5 rounded-2xl flex flex-col items-center justify-between text-center transition-all cursor-pointer min-h-[74px] border ${
                    isLocked
                      ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                      : isCurrent
                      ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/30 text-orange-950 font-black shadow-sm'
                      : completed
                      ? 'bg-white border-slate-200 hover:border-orange-300 text-slate-900 hover:shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  {/* Top: Level number or lock */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-black tabular-nums">{num}</span>
                      <span className="text-[8px] font-semibold text-slate-400 tabular-nums">
                        {Math.min(100, Math.max(1, Math.round((num / TOTAL_LEVELS) * 100)))}%
                      </span>
                    </div>
                    {isLocked ? (
                      <Lock className="w-3 h-3 text-slate-400" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                    ) : null}
                  </div>

                  {/* Center: Star Rating */}
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

                  {/* Bottom: Best time or status */}
                  <div className="text-[10px] text-slate-400 font-medium">
                    {completed ? (
                      <span className="text-emerald-700 font-semibold tabular-nums">
                        {Math.floor(completed.bestTime / 60)}:
                        {(completed.bestTime % 60).toString().padStart(2, '0')}
                      </span>
                    ) : isLocked ? (
                      'Locked'
                    ) : (
                      'Play'
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Complete levels to earn 3 stars and unlock the next!</span>
          <button
            onClick={() => {
              if (progress.unlockedAll || currentLevel < progress.maxUnlockedLevel) {
                onSelectLevel(Math.min(TOTAL_LEVELS, currentLevel + 1));
                onClose();
              }
            }}
            disabled={!progress.unlockedAll && currentLevel >= progress.maxUnlockedLevel}
            className="flex items-center gap-1 text-orange-600 font-bold hover:text-orange-700 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <span>Next Level</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
