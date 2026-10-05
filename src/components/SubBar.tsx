import React from 'react';
import { Clock, Sparkles, Target } from 'lucide-react';

interface SubBarProps {
  elapsedSeconds: number;
  cellsVisited: number;
  totalCells: number;
  checkpointsPassed: number;
  totalCheckpoints: number;
  levelNumber?: number;
  difficultyPercent?: number;
  tierName?: string;
}

export const SubBar: React.FC<SubBarProps> = ({
  elapsedSeconds,
  cellsVisited,
  totalCells,
  checkpointsPassed,
  totalCheckpoints,
  levelNumber,
  difficultyPercent,
  tierName,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round((cellsVisited / totalCells) * 100);

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto px-4 py-1.5 select-none">
      {/* Game HUD Status Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-2xs space-y-1.5">
        {/* Top Metric Row: Checkpoints, Tier badge, Timer */}
        <div className="flex items-center justify-between text-xs gap-1.5">
          {/* Checkpoint order tracker */}
          <div className="flex items-center gap-1 sm:gap-1.5 font-bold text-slate-800 shrink-0">
            <Target className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span className="whitespace-nowrap">
              Point <span className="text-orange-600 font-black">{checkpointsPassed}</span>
              <span className="text-slate-400 font-semibold">/{totalCheckpoints}</span>
            </span>
          </div>

          {/* Right side: Difficulty tier & Timer badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            {difficultyPercent !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-md font-bold text-[10px] flex items-center gap-0.5 shrink-0 ${
                  difficultyPercent <= 20
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : difficultyPercent <= 45
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : difficultyPercent <= 70
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
                title={`Level ${levelNumber || 1}: ${difficultyPercent}% difficulty (${tierName || 'Tier'})`}
              >
                <Sparkles className="w-2.5 h-2.5 shrink-0" />
                <span>{difficultyPercent}%</span>
              </span>
            )}

            <div className="flex items-center gap-1 font-black text-slate-700 bg-slate-100/90 px-2 py-0.5 rounded-lg border border-slate-200/70 tabular-nums text-xs shrink-0">
              <Clock className="w-3 h-3 text-slate-500 shrink-0" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Live Animated Grid Coverage Progress Bar */}
        <div className="space-y-1.5 pt-0.5">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/90 shadow-inner">
            <div
              className="bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 h-full rounded-full transition-all duration-300 shadow-sm shadow-orange-500/30"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-0.5">
            <span>Grid Coverage</span>
            <span className="text-orange-600 font-black tabular-nums">{progressPercent}% Filled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
