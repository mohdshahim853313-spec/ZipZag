import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Medal, Trash2, Play, Flame } from 'lucide-react';
import { getLeaderboard, formatScoreTime, clearLeaderboard, ScoreEntry } from '../utils/leaderboard';

interface LeaderboardScreenProps {
  currentLevel: number;
  onGoToGame: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  currentLevel,
  onGoToGame,
}) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'current'>('all');

  useEffect(() => {
    const pid = filterMode === 'current' ? `zipzag-level-${currentLevel}` : undefined;
    setScores(getLeaderboard(pid));
  }, [filterMode, currentLevel]);

  const handleClearScores = () => {
    if (window.confirm('Are you sure you want to clear your local high scores?')) {
      clearLeaderboard();
      setScores([]);
    }
  };

  const fastestScore = scores.length > 0 ? Math.min(...scores.map((s) => s.timeSeconds)) : null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col pb-24 sm:pb-12 select-none">
      {/* Top Header with Mobile Safe Area */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs safe-top-area">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-orange-600 text-white flex items-center justify-center font-black shadow-sm shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-black text-slate-900 truncate">
                Leaderboard & Records
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                Personal best completion times
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

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-4 flex-1">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fastest Time</span>
            <div className="text-base sm:text-lg font-black text-orange-600 mt-0.5">
              {fastestScore !== null ? formatScoreTime(fastestScore) : '--:--'}
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Cleared</span>
            <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              {scores.length}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs text-center flex items-center justify-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Storage</span>
              <p className="text-xs font-bold text-slate-700">Saved Locally</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3 border border-slate-200/90 rounded-2xl shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Medal className="w-4 h-4 text-orange-500" />
            <span>Rankings</span>
          </div>

          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setFilterMode('current')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterMode === 'current'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Level {currentLevel}
            </button>
          </div>
        </div>

        {/* Score List */}
        <div className="space-y-2">
          {scores.length === 0 ? (
            <div className="p-12 text-center space-y-3 bg-white border border-slate-200/90 rounded-2xl">
              <Clock className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No completion records yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {filterMode === 'current'
                  ? `Clear Level ${currentLevel} to record your first score!`
                  : 'Solve any level in ZipZag to climb onto your personal leaderboard!'}
              </p>
              <button
                onClick={onGoToGame}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Solving</span>
              </button>
            </div>
          ) : (
            scores.map((score, index) => {
              const rank = index + 1;
              return (
                <div
                  key={score.id}
                  className="flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-2xl hover:border-orange-200 shadow-2xs transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
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
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {score.puzzleName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {score.date} · {score.moves} steps
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className="text-xs sm:text-sm font-black text-orange-600 tabular-nums bg-orange-50 px-3 py-1 rounded-xl border border-orange-200 shadow-2xs">
                      {formatScoreTime(score.timeSeconds)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Clear History Button */}
        {scores.length > 0 && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleClearScores}
              className="text-xs text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
