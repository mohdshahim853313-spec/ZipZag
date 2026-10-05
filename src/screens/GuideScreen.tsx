import React from 'react';
import { Sparkles, Target, AlertTriangle, Lightbulb, Play, Keyboard, CheckCircle2 } from 'lucide-react';

interface GuideScreenProps {
  currentLevel: number;
  onGoToGame: () => void;
  onPlayScreenshotPuzzle: () => void;
}

export const GuideScreen: React.FC<GuideScreenProps> = ({
  currentLevel,
  onGoToGame,
  onPlayScreenshotPuzzle,
}) => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col pb-24 sm:pb-12 select-none">
      {/* Top Header with Mobile Safe Area */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs safe-top-area">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white flex items-center justify-center font-black shadow-sm shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-black text-slate-900 truncate">
                Game Rules & Guide
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                How to play and master ZipZag
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

      {/* Main Content Area (100% English) */}
      <main className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1">
        {/* Introduction Card */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50/50 to-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-orange-950 font-black text-sm sm:text-base mb-1.5">
            <Sparkles className="w-5 h-5 text-orange-600 shrink-0" />
            <span>What is ZipZag?</span>
          </div>
          <p className="text-orange-950 text-xs sm:text-sm leading-relaxed">
            <strong>ZipZag</strong> is an engaging logic path puzzle featuring <strong>500 hand-crafted progressive levels</strong>!
            Your mission is to draw an unbroken continuous line that connects every numbered checkpoint in strict sequential order (1 ➔ 2 ➔ 3...) while traversing and filling <strong>every single cell on the board</strong>.
          </p>
        </div>

        {/* Core Rules Section */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
          <h2 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600 shrink-0" />
            <span>4 Fundamental Rules</span>
          </h2>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
              <div>
                <strong className="text-xs sm:text-sm text-slate-900">Start at Checkpoint 1:</strong>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  The path always starts from <strong>1</strong>. The starting cell is highlighted with a warm orange tint.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
              <div>
                <strong className="text-xs sm:text-sm text-slate-900">Connect in Strict Numerical Order:</strong>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  Follow <strong>1 ➔ 2 ➔ 3 ➔ 4...</strong> in exact ascending order. You cannot skip ahead to any later number.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
              <div>
                <strong className="text-xs sm:text-sm text-slate-900">100% Grid Cell Coverage:</strong>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  No empty square can be left behind. Your line must snake through every single cell on the board to clear the level.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
              <div>
                <strong className="text-xs sm:text-sm text-slate-900">Orthogonal Steps Only:</strong>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  Moves must be Up, Down, Left, or Right. Diagonal steps are not permitted, and the path cannot cross itself.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Avoiding Errors Section */}
        <div className="p-4 sm:p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
          <div className="flex items-center gap-2 font-black text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>How to Avoid Sequence Violations</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">
            If you attempt to enter a higher checkpoint prematurely, the move is rejected.
            For instance, after connecting 1 to 2, the next target is strictly <strong>checkpoint 3</strong>. Entering checkpoint 4 or 5 before 3 will trigger an error warning.
          </p>
        </div>

        {/* Pro Strategy Tips */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
          <h2 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
            <span>Pro Strategies & Tactics</span>
          </h2>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-2 list-disc list-inside">
            <li><strong>Analyze the Corners:</strong> Corner squares only have 2 available adjacent exits. Plan how your path will visit corners early to avoid creating traps.</li>
            <li><strong>Instant Tap-to-Rewind:</strong> If you reach a dead end, simply tap or click any previous cell along your path to instantly rewind back to that spot!</li>
            <li><strong>Reset Option:</strong> Tap the Reset button in the controls toolbar to clear the board back to the start cell in one tap.</li>
          </ul>

          {/* Desktop keyboard shortcuts */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <Keyboard className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Keyboard shortcuts: <strong>WASD / Arrow Keys</strong> to draw · <strong>Z</strong> Undo · <strong>R</strong> Reset</span>
          </div>
        </div>

        {/* Master Challenge Button */}
        <div className="pt-2">
          <button
            onClick={onPlayScreenshotPuzzle}
            className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 fill-white shrink-0" />
            <span>Play 7×6 Master Challenge Puzzle</span>
          </button>
        </div>
      </main>
    </div>
  );
};
