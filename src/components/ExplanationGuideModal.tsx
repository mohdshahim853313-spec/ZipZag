import React from 'react';
import { X, CheckCircle2, AlertTriangle, Lightbulb, Target, Sparkles } from 'lucide-react';

interface ExplanationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayScreenshotPuzzle: () => void;
}

export const ExplanationGuideModal: React.FC<ExplanationGuideModalProps> = ({
  isOpen,
  onClose,
  onPlayScreenshotPuzzle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)] bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-black text-slate-900">
              How ZipZag Works
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content (100% English) */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
          {/* Introduction */}
          <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-orange-950 font-bold text-base mb-1">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <span>What is ZipZag?</span>
            </div>
            <p className="text-orange-950 text-xs sm:text-sm">
              <strong>ZipZag</strong> is a pure logic grid path puzzle game featuring <strong>500 progressive levels</strong>!
              Draw a single continuous line to fill every square on the grid and connect numbered checkpoints in ascending order.
            </p>
          </div>

          {/* Main Objective */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              Core Rules & Objectives
            </h3>
            <div className="grid gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-slate-900">Start at Checkpoint 1:</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Your path always begins at <strong>1</strong> (highlighted with an orange tint on the board).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-slate-900">Connect in Strict Ascending Order:</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Progress through <strong>1 ➔ 2 ➔ 3 ➔ 4...</strong> sequentially. You cannot skip ahead to future checkpoints.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-slate-900">Fill 100% of Cells:</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Connecting checkpoints isn't enough! You must route through the blank cells so that <strong>every single cell</strong> is filled (a Hamiltonian Path).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
                <div>
                  <strong className="text-slate-900">Orthogonal Movement:</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Moves can only be <strong>Up, Down, Left, or Right</strong>. Diagonal steps and self-crossing are not allowed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sequence Error Prevention */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <div className="flex items-center gap-2 text-rose-900 font-bold mb-1">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Avoiding Numerical Sequence Violations</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-950 mb-2">
              If an invalid move is attempted, an error alert appears: <br />
              <code className="font-bold bg-white px-2 py-0.5 rounded border border-rose-300 text-rose-700">
                Oops! Follow the numbers in order.
              </code>
            </p>
            <div className="text-xs text-rose-900 space-y-1">
              <p>• Once you reach <strong>2</strong>, the next mandatory checkpoint is <strong>3</strong>.</p>
              <p>• If the line steps into checkpoint 4 or 5 before reaching 3, the move will be blocked.</p>
            </div>
          </div>

          {/* Pro Strategy Tips */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Winning Strategies & Pro Tips
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li>
                <strong>Focus on Corners:</strong> The 4 outer corners have only 2 possible entry/exit points, making them vital anchors for path planning.
              </li>
              <li>
                <strong>Follow the Perimeter:</strong> Filling central squares prematurely often creates isolated corner pockets and dead ends.
              </li>
              <li>
                <strong>Instant Tap to Rewind:</strong> If trapped, tap any past cell on your trail to instantly rewind back to that position!
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onPlayScreenshotPuzzle();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-full font-semibold text-xs sm:text-sm bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white transition-colors text-center cursor-pointer shadow-xs active:scale-98 flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Play Master Challenge (7×6)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
