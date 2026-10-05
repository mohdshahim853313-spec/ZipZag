import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Keyboard,
  HelpCircle,
  Trophy,
  Clock,
  Trash2,
  Medal,
  SlidersHorizontal,
  Wand2,
} from 'lucide-react';
import { sound } from '../utils/sound';
import { getLeaderboard, formatScoreTime, clearLeaderboard, ScoreEntry } from '../utils/leaderboard';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetGame: () => void;
  onOpenHowToPlay: () => void;
  currentPuzzleId?: string;
  currentPuzzleName?: string;
  selectedDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onGenerateNewWithDifficulty?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetGame,
  onOpenHowToPlay,
  currentPuzzleId,
  currentPuzzleName,
  selectedDifficulty,
  onDifficultyChange,
  onGenerateNewWithDifficulty,
}) => {
  const [audioEnabled, setAudioEnabled] = useState(sound.enabled);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'current'>('all');

  // Load scores when modal opens or filter changes
  useEffect(() => {
    if (isOpen) {
      const pid = filterMode === 'current' && currentPuzzleId ? currentPuzzleId : undefined;
      setScores(getLeaderboard(pid));
    }
  }, [isOpen, filterMode, currentPuzzleId]);

  if (!isOpen) return null;

  const toggleAudio = () => {
    sound.enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
  };

  const handleClearScores = () => {
    if (window.confirm('Are you sure you want to clear your high scores?')) {
      clearLeaderboard();
      setScores([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)] bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Settings & Scores</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-700">
          {/* Top Scores / Leaderboard Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <Medal className="w-4 h-4 text-orange-500" />
                <span>Top Scores</span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-medium">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterMode('current')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    filterMode === 'current'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={currentPuzzleName ? `Filter by ${currentPuzzleName}` : 'This Level'}
                >
                  This Level
                </button>
              </div>
            </div>

            {/* Scores List */}
            {scores.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center space-y-1">
                <Clock className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No scores recorded yet</p>
                <p className="text-[11px] text-slate-400">
                  {filterMode === 'current'
                    ? `Complete ${currentPuzzleName || 'this puzzle'} to set your first time!`
                    : 'Solve any puzzle to record your completion time!'}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {scores.slice(0, 10).map((score, index) => {
                  const rank = index + 1;
                  return (
                    <div
                      key={score.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl hover:bg-slate-100/70 transition-colors"
                    >
                      {/* Rank & Name */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                            rank === 1
                              ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                              : rank === 2
                              ? 'bg-slate-200 text-slate-800'
                              : rank === 3
                              ? 'bg-amber-50 text-amber-900 border border-amber-200'
                              : 'text-slate-400 font-semibold'
                          }`}
                        >
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
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

                      {/* Time */}
                      <div className="text-right shrink-0 pl-2">
                        <span className="text-xs font-extrabold text-orange-600 tabular-nums bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                          {formatScoreTime(score.timeSeconds)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {scores.length > 0 && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleClearScores}
                      className="text-[10px] text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear scores
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Puzzle Generator Difficulty Dropdown */}
          <div className="space-y-2 py-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                <div>
                  <span className="font-semibold text-slate-800">Puzzle Difficulty</span>
                  <p className="text-[11px] text-slate-400">For newly generated puzzles</p>
                </div>
              </div>

              {/* Native Accessible Select Dropdown */}
              <select
                value={selectedDifficulty}
                onChange={(e) => onDifficultyChange(e.target.value as DifficultyLevel)}
                className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-2xs"
              >
                <option value="Easy">Easy (4×5)</option>
                <option value="Medium">Medium (5×5)</option>
                <option value="Hard">Hard (6×6)</option>
              </select>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                {selectedDifficulty === 'Easy' && '4×5 grid with 5 numbered checkpoints.'}
                {selectedDifficulty === 'Medium' && '5×5 grid with 6 numbered checkpoints.'}
                {selectedDifficulty === 'Hard' && '6×6 grid with 8 numbered checkpoints.'}
              </div>

              {onGenerateNewWithDifficulty && (
                <button
                  onClick={onGenerateNewWithDifficulty}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs shrink-0 ml-2"
                >
                  <Wand2 className="w-3 h-3 text-orange-600" />
                  Generate Now
                </button>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Audio toggle */}
          <div className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2.5">
              {audioEnabled ? (
                <Volume2 className="w-5 h-5 text-slate-700" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <span className="font-semibold text-slate-800">Sound Effects</span>
                <p className="text-[11px] text-slate-400">Ticks, chimes, and error sounds</p>
              </div>
            </div>
            <button
              onClick={toggleAudio}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                audioEnabled ? 'bg-orange-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  audioEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Preview Buttons */}
          {audioEnabled && (
            <div className="flex items-center gap-2 pt-0.5 pb-0.5">
              <span className="text-[11px] text-slate-400 font-medium">Test:</span>
              <button
                onClick={() => sound.playTick(5)}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
                title="Preview Path Tick Sound"
              >
                Tick
              </button>
              <button
                onClick={() => sound.playError()}
                className="px-2.5 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors cursor-pointer"
                title="Preview Error Sound"
              >
                Error
              </button>
              <button
                onClick={() => sound.playCompletionChime()}
                className="px-2.5 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors cursor-pointer"
                title="Preview Victory Completion Chime"
              >
                Chime ✨
              </button>
            </div>
          )}

          <hr className="border-slate-100" />

          {/* Controls instructions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs tracking-wider uppercase">
              <Keyboard className="w-4 h-4 text-slate-600" />
              Keyboard Controls
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-800">Arrows / WASD:</span>
                <p className="text-[11px] text-slate-500">Move path</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-800">Z / Backspace:</span>
                <p className="text-[11px] text-slate-500">Undo last step</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Reset button */}
          <button
            onClick={() => {
              onResetGame();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Current Puzzle
          </button>

          {/* How to play button */}
          <button
            onClick={() => {
              onClose();
              onOpenHowToPlay();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            View Game Rules
          </button>
        </div>
      </div>
    </div>
  );
};
