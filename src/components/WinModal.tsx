import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, CheckCircle2, Share2, ArrowRight, RotateCcw, Flame, Star, Zap } from 'lucide-react';
import { sound } from '../utils/sound';

interface WinModalProps {
  isOpen: boolean;
  timeSeconds: number;
  totalCells: number;
  moves: number;
  puzzleName: string;
  levelNumber?: number;
  starsEarned?: number;
  currentStreak?: number;
  isPersonalBest?: boolean;
  onNextPuzzle: () => void;
  onReplay: () => void;
  onClose: () => void;
  onGoHome?: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  timeSeconds,
  totalCells,
  moves,
  puzzleName,
  levelNumber,
  starsEarned = 3,
  currentStreak = 1,
  isPersonalBest = false,
  onNextPuzzle,
  onReplay,
  onClose,
  onGoHome,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      sound.playCompletionChime();
      // Burst confetti
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#f59e0b', '#10b981', '#3b82f6'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    const starText = '⭐'.repeat(starsEarned);
    const shareText = `ZipZag - ${puzzleName}\n🏆 Rating: ${starText} (${starsEarned}/3)\n⏱️ Time: ${formatTime(timeSeconds)}\n🔥 Daily Streak: ${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}\nCompleted all ${totalCells} cells in ${moves} moves!\nPlay ZipZag at: ${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)] bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-250 text-center p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Celebration icon badge */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-md ring-4 ring-orange-100">
          <Trophy className="w-8 h-8 text-white drop-shadow-xs" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 text-slate-900 rounded-full flex items-center justify-center font-black shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-slate-900" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {levelNumber ? `Level ${levelNumber} Cleared!` : 'Level Solved!'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            You successfully completed all cells on <strong>{puzzleName}</strong>!
          </p>
        </div>

        {/* Star Rating Animation */}
        <div className="flex items-center justify-center gap-2 py-1">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transform transition-all duration-300 ${
                starsEarned >= starIdx ? 'scale-110' : 'scale-95 opacity-30'
              }`}
            >
              <Star
                className={`w-8 h-8 ${
                  starsEarned >= starIdx
                    ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                    : 'text-slate-300'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Streak Callout */}
        <div className="py-2 px-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-orange-950">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>Daily Streak</span>
          </div>
          <span className="font-extrabold text-orange-700 bg-white px-2 py-0.5 rounded-full border border-orange-200 shadow-2xs">
            {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} 🔥
          </span>
        </div>

        {/* Stats card */}
        <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex flex-col items-center">
            <Clock className="w-4 h-4 text-slate-400 mb-1" />
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {formatTime(timeSeconds)}
              </span>
              {isPersonalBest && (
                <span className="text-[9px] font-black text-amber-700 bg-amber-100 px-1 py-0.2 rounded" title="New Personal Best!">
                  PB ⭐
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Time</span>
          </div>

          <div className="flex flex-col items-center border-x border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-base font-bold text-slate-900">
              100%
            </span>
            <span className="text-[10px] text-slate-400 font-medium">{totalCells} Cells</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
              {moves}
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">Steps</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onNextPuzzle}
            className="w-full py-3 px-4 rounded-full font-bold text-sm bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
          >
            <span>Play Next Level</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="w-full py-2.5 px-4 rounded-full font-medium text-xs border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Copied to Clipboard! ✓' : 'Share ZipZag Victory'}
          </button>

          <div className="flex items-center justify-center gap-3 pt-1">
            {onGoHome && (
              <>
                <button
                  onClick={onGoHome}
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Main Menu
                </button>
                <span className="text-slate-300">·</span>
              </>
            )}
            <button
              onClick={onReplay}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Replay level
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Review board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
