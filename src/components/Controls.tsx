import React from 'react';
import { Undo2, RotateCcw, Lightbulb, Sparkles, Wand2 } from 'lucide-react';

interface ControlsProps {
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
  onHint: () => void;
  onSolve: () => void;
  onGenerateNew: () => void;
  hasSolution: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  hintsRemaining?: number;
  maxHints?: number;
  isSolving?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  canUndo,
  onUndo,
  onReset,
  onHint,
  onSolve,
  onGenerateNew,
  hasSolution,
  difficulty = 'Medium',
  hintsRemaining,
  maxHints,
  isSolving = false,
}) => {
  const isOutOfHints = hintsRemaining !== undefined && hintsRemaining <= 0;

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto px-4 py-2 select-none space-y-2.5">
      {/* Integrated 3-Button Game Controller Console */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center justify-between gap-1.5 sm:gap-2.5">
        {/* 1. Undo Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo || isSolving}
          className={`flex-1 min-w-0 py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            canUndo && !isSolving
              ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-[0_3px_0_0_#cbd5e1] hover:shadow-[0_4px_0_0_#94a3b8] active:shadow-none active:translate-y-0.5 cursor-pointer'
              : 'bg-slate-50/50 text-slate-300 border border-slate-100 shadow-none cursor-not-allowed opacity-50'
          }`}
          title="Rewind one step (Shortcut: Z or Backspace)"
        >
          <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
          <span className="truncate">Undo</span>
        </button>

        {/* 2. Reset / Restart Button */}
        <button
          onClick={onReset}
          disabled={isSolving}
          className={`flex-1 min-w-0 py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm border transition-all flex items-center justify-center gap-1.5 ${
            !isSolving
              ? 'bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200 hover:border-rose-200 shadow-[0_3px_0_0_#cbd5e1] hover:shadow-[0_3px_0_0_#fecdd3] active:shadow-none active:translate-y-0.5 cursor-pointer'
              : 'bg-slate-50/50 text-slate-300 border-slate-100 shadow-none cursor-not-allowed opacity-50'
          }`}
          title="Clear path and start over (Shortcut: R)"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
          <span className="truncate">Reset</span>
        </button>

        {/* 3. Hint Power Button */}
        <button
          onClick={onHint}
          disabled={isOutOfHints || isSolving}
          className={`flex-[1.25] min-w-0 py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
            !isOutOfHints && !isSolving
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border border-amber-300/60 shadow-[0_3px_0_0_#9a3412] hover:shadow-[0_4px_0_0_#7c2d12] active:shadow-none active:translate-y-0.5 cursor-pointer'
              : 'bg-slate-100 text-slate-400 border border-slate-200/80 shadow-none cursor-not-allowed opacity-60'
          }`}
          title={
            hintsRemaining !== undefined
              ? hintsRemaining > 0
                ? `Reveal next logical checkpoint move (${hintsRemaining}/${maxHints || hintsRemaining} left)`
                : `No hints left for this level (${maxHints || 0} used)`
              : 'Reveal next logical checkpoint move'
          }
        >
          <Lightbulb
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0 ${
              !isOutOfHints && !isSolving ? 'fill-amber-200 text-white' : 'text-slate-400'
            }`}
          />
          <span className="truncate">Hint</span>
          {hintsRemaining !== undefined && (
            <span
              className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full font-black tabular-nums shrink-0 leading-none ${
                !isOutOfHints && !isSolving
                  ? 'bg-white/30 text-white shadow-2xs'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {hintsRemaining}
            </span>
          )}
        </button>
      </div>

      {/* Secondary utility actions: Symmetrical balanced buttons that never wrap badly */}
      <div className={`grid ${hasSolution ? 'grid-cols-2' : 'grid-cols-1 max-w-[220px]'} gap-2 w-full max-w-sm mx-auto pt-0.5`}>
        {hasSolution && (
          <button
            onClick={onSolve}
            disabled={isSolving}
            className={`w-full text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl shadow-2xs truncate ${
              isSolving
                ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-none cursor-not-allowed'
                : 'text-slate-600 hover:text-orange-600 bg-white hover:bg-orange-50/70 border border-slate-200 hover:border-orange-200 active:scale-95 cursor-pointer'
            }`}
            title={isSolving ? 'Preview in progress...' : 'Show quick preview of solution'}
          >
            <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isSolving ? 'text-amber-600 animate-spin' : 'text-orange-500'}`} />
            <span className="truncate">{isSolving ? 'Previewing...' : 'Show Solution'}</span>
          </button>
        )}

        <button
          onClick={onGenerateNew}
          disabled={isSolving}
          className={`w-full text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl shadow-2xs truncate ${
            !isSolving
              ? 'text-slate-600 hover:text-orange-600 bg-white hover:bg-orange-50/70 border border-slate-200 hover:border-orange-200 active:scale-95 cursor-pointer'
              : 'text-slate-300 bg-slate-50 border border-slate-100 shadow-none cursor-not-allowed'
          }`}
          title={`Generate a brand new ${difficulty} puzzle`}
        >
          <Wand2 className={`w-3.5 h-3.5 shrink-0 ${!isSolving ? 'text-orange-500' : 'text-slate-300'}`} />
          <span className="truncate">New ({difficulty})</span>
        </button>
      </div>
    </div>
  );
};
