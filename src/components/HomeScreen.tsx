import React from 'react';
import {
  Play,
  Grid,
  Trophy,
  BookOpen,
  Settings,
  HelpCircle,
  Flame,
  Star,
  Zap,
  Volume2,
  VolumeX,
  Shuffle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { UserProgress, TOTAL_LEVELS } from '../utils/levels';
import { StreakData } from '../utils/streak';
import { sound } from '../utils/sound';

interface HomeScreenProps {
  currentLevel: number;
  progress: UserProgress;
  streakData: StreakData;
  onPlayCurrentLevel: () => void;
  onOpenLevelSelect: () => void;
  onOpenLeaderboard: () => void;
  onOpenGuide: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onQuickPlay: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentLevel,
  progress,
  streakData,
  onPlayCurrentLevel,
  onOpenLevelSelect,
  onOpenLeaderboard,
  onOpenGuide,
  onOpenHowToPlay,
  onOpenSettings,
  onQuickPlay,
}) => {
  const [audioEnabled, setAudioEnabled] = React.useState(sound.enabled);

  const toggleAudio = () => {
    sound.enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
  };

  const totalStars = Object.values(progress.completedLevels).reduce(
    (acc, curr) => acc + curr.stars,
    0
  );

  const completedCount = Object.keys(progress.completedLevels).length;
  const progressPercent = Math.min(100, Math.round((completedCount / TOTAL_LEVELS) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-slate-100 text-slate-900 flex flex-col justify-between antialiased selection:bg-orange-200">
      {/* Sticky Pinned Top Header with Mobile Safe Area - Protected from Battery/Status bar */}
      <header className="sticky top-0 z-30 w-full bg-amber-50/95 backdrop-blur-md border-b border-amber-200/50 shadow-2xs safe-top-area">
        <nav className="w-full max-w-md mx-auto px-4 py-2 sm:py-2.5 flex items-center justify-between select-none">
          {/* Streak indicator */}
          <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white border border-slate-200/80 shadow-2xs text-xs font-bold text-slate-800 shrink-0">
            <Flame
              className={`w-4 h-4 ${
                streakData.currentStreak > 0
                  ? 'text-orange-500 fill-orange-500 animate-pulse'
                  : 'text-slate-400'
              }`}
            />
            <span>{streakData.currentStreak} Day Streak</span>
            {streakData.solvedToday && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Completed today" />
            )}
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleAudio}
              className="p-2 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              title={audioEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              title="Settings & Audio"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-md sm:max-w-lg mx-auto px-4 py-2 flex-1 flex flex-col justify-center items-center text-center space-y-4 sm:space-y-5 select-none">
        {/* Hero Branding */}
        <div className="space-y-2">
          {/* Logo Badge */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl shadow-xl shadow-orange-500/20 flex items-center justify-center overflow-hidden ring-4 ring-orange-500/15">
              <img src="/favicon.svg" alt="ZipZag App Icon" className="w-full h-full object-cover rounded-3xl" />
            </div>
            <div className="absolute -bottom-2.5 whitespace-nowrap bg-slate-900 text-yellow-300 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full border border-slate-700 shadow-md pointer-events-none select-none">
              500 Levels
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Zip<span className="text-orange-600">Zag</span>
            </h1>
            <p className="text-xs font-semibold text-slate-500 max-w-[280px] mx-auto mt-1 leading-snug">
              Connect the dots in order & fill every cell on the grid with a single path!
            </p>
          </div>
        </div>

        {/* Player Progress Stats Card */}
        <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm space-y-2.5">
          <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
            <div className="px-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Level</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {currentLevel}
                <span className="text-xs font-semibold text-slate-400 font-normal">/{TOTAL_LEVELS}</span>
              </div>
            </div>

            <div className="px-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Stars</span>
              <div className="text-lg font-black text-amber-500 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{totalStars}</span>
              </div>
            </div>

            <div className="px-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cleared</span>
              <div className="text-lg font-black text-emerald-600 mt-0.5">
                {completedCount}
                <span className="text-xs text-slate-400 font-normal"> lvls</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-3 sm:h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/90 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-sm shadow-orange-500/30"
                style={{ width: `${Math.max(3, progressPercent)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-0.5">
              <span>Overall Progress</span>
              <span className="text-orange-600 font-black tabular-nums">{progressPercent}% Completed</span>
            </div>
          </div>
        </div>

        {/* Big Primary Play Button */}
        <button
          onClick={() => {
            sound.playTick(1);
            onPlayCurrentLevel();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-black text-lg tracking-wide shadow-lg shadow-orange-500/30 flex items-center justify-center gap-3 transition-all transform active:scale-98 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-white text-white drop-shadow-xs" />
          <span>{completedCount === 0 && currentLevel === 1 ? 'START LEVEL 1' : `CONTINUE LEVEL ${currentLevel}`}</span>
        </button>

        {/* Game Navigation Menu Grid */}
        <div className="w-full grid grid-cols-2 gap-2 sm:gap-2.5 text-left">
          {/* 1. All Levels (1 to 500) */}
          <button
            onClick={onOpenLevelSelect}
            className="p-2.5 sm:p-3 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl shadow-2xs transition-all flex flex-col justify-between cursor-pointer group hover:border-orange-300"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
                <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
            <div className="mt-2">
              <h3 className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                Levels (1 - 500)
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-1 sm:line-clamp-none">
                5 Chapters, Map & Pickers
              </p>
            </div>
          </button>

          {/* 2. Leaderboard & Top Scores */}
          <button
            onClick={onOpenLeaderboard}
            className="p-2.5 sm:p-3 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl shadow-2xs transition-all flex flex-col justify-between cursor-pointer group hover:border-amber-300"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
            <div className="mt-2">
              <h3 className="text-xs font-black text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                Leaderboard
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-1 sm:line-clamp-none">
                Top times & Bests
              </p>
            </div>
          </button>

          {/* 3. Game Guide (Rules & Strategies) */}
          <button
            onClick={onOpenGuide}
            className="p-2.5 sm:p-3 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl shadow-2xs transition-all flex flex-col justify-between cursor-pointer group hover:border-amber-300"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
            <div className="mt-2">
              <h3 className="text-xs font-black text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                Game Guide
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-1 sm:line-clamp-none">
                Rules & Strategies
              </p>
            </div>
          </button>

          {/* 4. Quick Endless Random Puzzle */}
          <button
            onClick={onQuickPlay}
            className="p-2.5 sm:p-3 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl shadow-2xs transition-all flex flex-col justify-between cursor-pointer group hover:border-orange-300"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
                <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
            <div className="mt-2">
              <h3 className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                Random Puzzle
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-1 sm:line-clamp-none">
                Easy, Med, Hard
              </p>
            </div>
          </button>
        </div>

        {/* Secondary Quick Action: How to play */}
        <div className="w-full flex items-center justify-between pt-1 text-xs">
          <button
            onClick={onOpenHowToPlay}
            className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-200/50"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How to play preview</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-200/50"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings & Controls</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto px-4 py-3 pb-20 sm:pb-3 text-center text-[11px] text-slate-400 select-none">
        <div className="flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>ZipZag Puzzle · 500 Progressive Solvable Levels</span>
        </div>
      </footer>
    </div>
  );
};
