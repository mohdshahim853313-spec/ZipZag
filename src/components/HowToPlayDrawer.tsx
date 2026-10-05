import React, { useState } from 'react';
import { Lightbulb, Keyboard, ChevronRight, X, Sparkles } from 'lucide-react';

interface HowToPlayDrawerProps {
  onOpenExplanation?: () => void;
}

export const HowToPlayDrawer: React.FC<HowToPlayDrawerProps> = ({ onOpenExplanation }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="w-full max-w-md sm:max-w-lg mx-auto px-4 mt-1 mb-3 flex justify-center select-none">
        <button
          onClick={() => setDismissed(false)}
          className="text-[11px] font-bold text-slate-400 hover:text-orange-600 flex items-center gap-1 transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Show Game Strategy Tips</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto px-4 mt-2 mb-4 select-none">
      <div className="bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-white border border-orange-200/70 rounded-2xl p-3 shadow-2xs">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Lightbulb className="w-4 h-4 fill-amber-200 stroke-[2.2]" />
            </div>
            <div className="min-w-0 text-left">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span>ZipZag Pro Strategy</span>
                <span className="text-[9px] font-extrabold bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  Tips
                </span>
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Draw through cells to connect <strong>1 ➔ 2 ➔ 3...</strong> in order. Tap any past cell on your path to rewind!
              </p>

              {/* Desktop keyboard shortcut hints */}
              <div className="hidden sm:flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60">
                  <Keyboard className="w-3 h-3 text-slate-400" />
                  <span><strong>Arrows / WASD</strong> to move · <strong>Z</strong> Undo · <strong>R</strong> Reset</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onOpenExplanation && (
              <button
                onClick={onOpenExplanation}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-white hover:bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-xl shadow-2xs transition-all flex items-center gap-0.5 cursor-pointer active:scale-95"
                title="Open full interactive rules"
              >
                <span>Rules</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Hide tips"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
