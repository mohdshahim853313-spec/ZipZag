import React, { useState, useEffect } from 'react';
import { X, Trophy, Clock, Medal, Trash2, Zap, Star } from 'lucide-react';
import { getLeaderboard, formatScoreTime, clearLeaderboard, ScoreEntry } from '../utils/leaderboard';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel?: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
}) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'current'>('all');

  useEffect(() => {
    if (isOpen) {
      const pid = filterMode === 'current' && currentLevel ? `zipzag-level-${currentLevel}` : undefined;
      setScores(getLeaderboard(pid));
    }
  }, [isOpen, filterMode, currentLevel]);

  if (!isOpen) return null;

  const handleClearScores = () => {
    if (window.confirm('Are you sure you want to clear your local high scores?')) {
      clearLeaderboard();
      setScores([]);
    }
  };

  const fastestScore = scores.length > 0 ? Math.min(...scores.map((s) => s.timeSeconds)) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)] bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 bg-orange-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white flex items-center justify-center font-black shadow-sm">
              <Trophy className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                Leaderboard & Scores
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Track your fastest completion times in ZipZag
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 p-3 bg-slate-50 border-b border-slate-100 text-center text-xs shrink-0 divide-x divide-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fastest Time</span>
            <div className="text-sm font-black text-orange-600 mt-0.5">
              {fastestScore !== null ? formatScoreTime(fastestScore) : '--:--'}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Records</span>
            <div className="text-sm font-black text-slate-800 mt-0.5">
              {scores.length}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Medal className="w-4 h-4 text-orange-500" />
            <span>Rankings</span>
          </div>

          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setFilterMode('current')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterMode === 'current'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Level {currentLevel || 1}
            </button>
          </div>
        </div>

        {/* Scores List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {scores.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No completion records yet</p>
              <p className="text-xs text-slate-400 max-w-[220px] mx-auto">
                {filterMode === 'current'
                  ? `Clear Level ${currentLevel || 1} to record your first score!`
                  : 'Solve any level in ZipZag to climb onto your personal leaderboard!'}
              </p>
            </div>
          ) : (
            scores.map((score, index) => {
              const rank = index + 1;
              return (
                <div
                  key={score.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        rank === 1
                          ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-300'
                          : rank === 2
                          ? 'bg-slate-200 text-slate-800'
                          : rank === 3
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : 'text-slate-400 font-bold'
                      }`}
                    >
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {score.puzzleName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {score.date} · {score.moves} steps
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className="text-xs font-black text-orange-600 tabular-nums bg-white px-2.5 py-1 rounded-lg border border-orange-200 shadow-2xs">
                      {formatScoreTime(score.timeSeconds)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
          {scores.length > 0 ? (
            <button
              onClick={handleClearScores}
              className="text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          ) : (
            <span className="text-slate-400 text-[11px]">Rankings are saved locally on your device</span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
