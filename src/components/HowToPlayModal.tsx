import React from 'react';
import { X } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayTutorial: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  onPlayTutorial,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)] bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            How to play <span className="text-orange-600">ZipZag</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Illustration: ZipZag Tutorial Circuit */}
        <div className="px-6 py-2">
          <div className="w-full aspect-[5/4] bg-white rounded-2xl border-2 border-slate-200 p-2 shadow-xs flex items-center justify-center relative">
            {/* Grid 4 rows x 5 cols */}
            <div className="grid grid-rows-4 grid-cols-5 gap-1 w-full h-full bg-slate-100 rounded-xl overflow-hidden relative">
              {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 5 }).map((_, c) => {
                  const isCheckpoint =
                    (r === 2 && c === 0) ||
                    (r === 3 && c === 2) ||
                    (r === 2 && c === 4) ||
                    (r === 2 && c === 2) ||
                    (r === 0 && c === 0) ||
                    (r === 1 && c === 2);

                  let checkpointNum = 0;
                  if (r === 2 && c === 0) checkpointNum = 1;
                  else if (r === 3 && c === 2) checkpointNum = 2;
                  else if (r === 2 && c === 4) checkpointNum = 3;
                  else if (r === 2 && c === 2) checkpointNum = 4;
                  else if (r === 0 && c === 0) checkpointNum = 5;
                  else if (r === 1 && c === 2) checkpointNum = 6;

                  return (
                    <div
                      key={`${r}-${c}`}
                      className="relative flex items-center justify-center bg-orange-100/70"
                    >
                      {isCheckpoint && (
                        <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center z-10 shadow-xs">
                          {checkpointNum}
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Path SVG overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 80">
                <path
                  d="M 10 50 V 70 H 90 V 50 H 30 V 30 H 10 V 10 H 90 V 30 H 50"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="px-6 py-4 space-y-3 text-sm text-slate-700">
          <p className="leading-snug">
            Create a single unbroken path that visits every cell in the grid.
          </p>
          <p className="leading-snug">
            The numbered cells must be visited in order: <strong>1 ➔ 2 ➔ 3...</strong>
          </p>
          <p className="text-xs text-slate-500">
            Use the hint button if you get stuck on tricky corners.
          </p>
        </div>

        {/* Action Button */}
        <div className="p-6 pt-1 flex flex-col gap-2">
          <button
            onClick={() => {
              onClose();
            }}
            className="w-full py-3 px-4 rounded-full font-bold text-sm bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white transition-all text-center cursor-pointer shadow-md active:scale-98"
          >
            Play ZipZag!
          </button>
          <button
            onClick={() => {
              onPlayTutorial();
              onClose();
            }}
            className="w-full py-2 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors text-center cursor-pointer"
          >
            Play Level 1 (Starter)
          </button>
        </div>
      </div>
    </div>
  );
};
