import React, { useState } from 'react';
import {
  HelpCircle,
  Settings,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Flame,
  Trophy,
  Calendar,
  CheckCircle2,
  Zap,
  Grid,
  Home,
} from 'lucide-react';
import { Puzzle } from '../types';
import { StreakData } from '../utils/streak';
import { TOTAL_LEVELS, UserProgress } from '../utils/levels';

interface HeaderProps {
  currentPuzzle: Puzzle;
  currentLevel: number;
  progress: UserProgress;
  streakData: StreakData;
  onGoHome: () => void;
  onOpenLevelSelect: () => void;
  onOpenLeaderboard: () => void;
  onPrevLevel: () => void;
  onNextLevel: () => void;
  onOpenHowToPlay: () => void;
  onOpenExplanation: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPuzzle,
  currentLevel,
  progress,
  streakData,
  onGoHome,
  onOpenLevelSelect,
  onOpenLeaderboard,
  onPrevLevel,
  onNextLevel,
  onOpenHowToPlay,
  onOpenExplanation,
  onOpenSettings,
}) => {
  const [streakPopoverOpen, setStreakPopoverOpen] = useState(false);

  const canGoPrev = currentLevel > 1;
  const canGoNext =
    progress.unlockedAll || currentLevel < progress.maxUnlockedLevel;

  return (
    <header className="relative w-full max-w-4xl mx-auto px-3 sm:px-6 safe-top-area pb-2 sm:pb-2.5 flex items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-sm sticky top-0 z-30 select-none shadow-2xs">
      {/* Left: Home Button & Brand Logo */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onGoHome}
          className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200/90 hover:border-orange-200 text-slate-700 hover:text-orange-600 shadow-[0_2px_0_0_#e2e8f0] active:shadow-none active:translate-y-0.5 transition-all cursor-pointer items-center justify-center"
          title="Back to Home Menu"
        >
          <Home className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
        </button>

        <div
          className="flex items-center gap-1.5 cursor-pointer"
          onClick={onGoHome}
          title="ZipZag Home Menu"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 text-white rounded-xl flex items-center justify-center font-black shadow-sm ring-2 ring-orange-500/20 active:scale-95 transition-transform">
            <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
          <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-slate-900 bg-clip-text text-transparent hidden min-[360px]:inline">
            ZipZag
          </span>
        </div>
      </div>

      {/* Center: Level Switcher & Level Picker */}
      <div className="flex items-center bg-white rounded-2xl p-0.5 sm:p-1 border border-slate-200/90 shadow-[0_2px_0_0_#e2e8f0] shrink-0">
        <button
          onClick={onPrevLevel}
          disabled={!canGoPrev}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50/70 transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center active:scale-90"
          title="Previous Level"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          onClick={onOpenLevelSelect}
          className="px-2 sm:px-2.5 py-0.5 text-xs font-black text-slate-800 hover:text-orange-600 flex items-center gap-1 cursor-pointer transition-colors"
          title="Select Level (1 - 500)"
        >
          <span>Level {currentLevel}</span>
          <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">/{TOTAL_LEVELS}</span>
        </button>

        <button
          onClick={onNextLevel}
          disabled={!canGoNext}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50/70 transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center active:scale-90"
          title="Next Level"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Right: Daily Streak & Action Icons */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        {/* Daily Streak Badge */}
        <div className="relative">
          <button
            onClick={() => setStreakPopoverOpen(!streakPopoverOpen)}
            className={`flex items-center gap-1 py-1 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              streakData.currentStreak > 0
                ? streakData.solvedToday
                  ? 'bg-orange-50 border-orange-300 text-orange-700 shadow-[0_2px_0_0_#fdba74] hover:bg-orange-100'
                  : 'bg-amber-50 border-amber-300 text-amber-800 shadow-[0_2px_0_0_#fde68a] hover:bg-amber-100'
                : 'bg-slate-50 border-slate-200 text-slate-600 shadow-[0_2px_0_0_#e2e8f0] hover:bg-slate-100'
            } active:shadow-none active:translate-y-0.5`}
            title="Daily Streak - Click for details"
          >
            <Flame
              className={`w-3.5 h-3.5 ${
                streakData.currentStreak > 0
                  ? 'text-orange-500 fill-orange-500 animate-pulse'
                  : 'text-slate-400'
              }`}
            />
            <span className="tabular-nums text-xs">{streakData.currentStreak}</span>
            {streakData.solvedToday && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            )}
          </button>

          {/* Streak Details Popover */}
          {streakPopoverOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setStreakPopoverOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 text-center animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    Daily Streak
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      streakData.solvedToday
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {streakData.solvedToday ? 'Solved Today ✓' : 'Pending Today'}
                  </span>
                </div>

                <div className="py-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-black text-slate-900 tabular-nums">
                      {streakData.currentStreak}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 text-left leading-tight">
                      Days<br />Streak
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    {streakData.solvedToday
                      ? 'Awesome! You continued your ZipZag daily streak today.'
                      : 'Complete any level today to continue your streak!'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-slate-100 text-left">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      Best Streak
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      {streakData.maxStreak} {streakData.maxStreak === 1 ? 'Day' : 'Days'}
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      Total Solved
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      {streakData.totalSolved} {streakData.totalSolved === 1 ? 'Level' : 'Levels'}
                    </div>
                  </div>
                </div>

                {streakData.lastCompletedDate && (
                  <div className="mt-3 pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1 border-t border-slate-100">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Last solved: {streakData.lastCompletedDate}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons Toolbar (Desktop only; on Mobile these are pinned at bottom nav) */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100/70 p-0.5 sm:p-1 rounded-2xl border border-slate-200/70">
          {/* All Levels Grid icon */}
          <button
            onClick={onOpenLevelSelect}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white hover:bg-orange-50 border border-slate-200/80 hover:border-orange-200 text-slate-700 hover:text-orange-600 shadow-[0_2px_0_0_#e2e8f0] active:shadow-none active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
            title="All 500 Levels"
          >
            <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </button>

          {/* Leaderboard icon */}
          <button
            onClick={onOpenLeaderboard}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white hover:bg-amber-50 border border-slate-200/80 hover:border-amber-200 text-amber-600 hover:text-amber-700 shadow-[0_2px_0_0_#e2e8f0] active:shadow-none active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
            title="Leaderboard & High Scores"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </button>

          {/* Guide */}
          <button
            onClick={onOpenExplanation}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white hover:bg-orange-50 border border-slate-200/80 hover:border-orange-200 text-orange-600 hover:text-orange-700 shadow-[0_2px_0_0_#e2e8f0] active:shadow-none active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
            title="Game Rules & Strategy Guide"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 text-slate-600 hover:text-slate-900 shadow-[0_2px_0_0_#e2e8f0] active:shadow-none active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
            title="Settings & Audio"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </header>
  );
};
