import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  RotateCcw,
  Keyboard,
  ShieldCheck,
  Play,
  Wand2,
  HelpCircle,
} from 'lucide-react';
import { sound } from '../utils/sound';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

interface SettingsScreenProps {
  currentLevel: number;
  selectedDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onGenerateNewWithDifficulty?: () => void;
  onResetGame: () => void;
  onGoToGame: () => void;
  onOpenHowToPlay: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentLevel,
  selectedDifficulty,
  onDifficultyChange,
  onGenerateNewWithDifficulty,
  onResetGame,
  onGoToGame,
  onOpenHowToPlay,
}) => {
  const [audioEnabled, setAudioEnabled] = useState(sound.enabled);

  const toggleAudio = () => {
    sound.enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col pb-24 sm:pb-12 select-none">
      {/* Top Header with Mobile Safe Area */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs safe-top-area">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-sm shrink-0">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-black text-slate-900 truncate">
                Settings & Preferences
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                Audio, difficulty, and controls
              </p>
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
      </header>

      {/* Main Settings Sections */}
      <main className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-4 flex-1">
        {/* 1. Audio & Sound Effects */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900">Game Audio & SFX</h2>
                <p className="text-xs text-slate-500">Play ticks, error buzzers, and victory chimes</p>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              onClick={toggleAudio}
              className={`w-13 h-7 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                audioEnabled ? 'bg-orange-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  audioEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Effect Test Buttons */}
          {audioEnabled && (
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Test:</span>
              <button
                onClick={() => sound.playTick(5)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Tick Sound
              </button>
              <button
                onClick={() => sound.playError()}
                className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Error Sound
              </button>
              <button
                onClick={() => sound.playCompletionChime()}
                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Chime ✨
              </button>
            </div>
          )}
        </div>

        {/* 2. Puzzle Difficulty Preferences */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">Random Puzzle Difficulty</h2>
              <p className="text-xs text-slate-500">Applies when generating custom random boards</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((diff) => {
              const isSelected = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  onClick={() => onDifficultyChange(diff)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-500/20 font-black shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold'
                  }`}
                >
                  <div className="text-sm">{diff}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    {diff === 'Easy' ? '4×5 Grid' : diff === 'Medium' ? '5×5 Grid' : '6×6 Grid'}
                  </div>
                </button>
              );
            })}
          </div>

          {onGenerateNewWithDifficulty && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={onGenerateNewWithDifficulty}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Wand2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Generate Random Board ({selectedDifficulty})</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Keyboard Controls Guide (Desktop Reference) */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">PC Keyboard Shortcuts</h2>
              <p className="text-xs text-slate-500">Play seamlessly using your desktop keyboard</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="font-black text-slate-900">Arrows / WASD</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Move path</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="font-black text-slate-900">Z / Backspace</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Undo step</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="font-black text-slate-900">R Key</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Reset board</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="font-black text-slate-900">Mouse Drag</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Free-hand draw</p>
            </div>
          </div>
        </div>

        {/* 4. Reset & Game Rules Actions */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-2xs space-y-3">
          <h2 className="text-sm font-black text-slate-900">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                onResetGame();
                onGoToGame();
              }}
              className="p-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reset Current Puzzle</span>
            </button>

            <button
              onClick={onOpenHowToPlay}
              className="p-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-orange-500" />
              <span>Animated Rules Popup</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 text-center text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-center gap-1 font-bold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>ZipZag v1.0.0 · 500 Progressive Levels</span>
          </div>
          <p className="text-[11px]">All game progress & high scores are safely preserved locally on your device.</p>
        </div>
      </main>
    </div>
  );
};
