import { useState, useEffect, useRef, useCallback } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { Header } from './components/Header';
import { SubBar } from './components/SubBar';
import { GameBoard } from './components/GameBoard';
import { Controls } from './components/Controls';
import { ErrorToast } from './components/ErrorToast';
import { HowToPlayDrawer } from './components/HowToPlayDrawer';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ExplanationGuideModal } from './components/ExplanationGuideModal';
import { SettingsModal } from './components/SettingsModal';
import { WinModal } from './components/WinModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { MobileBottomNav, NavTab } from './components/MobileBottomNav';
import { LevelsScreen } from './screens/LevelsScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { GuideScreen } from './screens/GuideScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SCREENSHOT_PUZZLE, TUTORIAL_PUZZLE } from './data/puzzles';
import { generateRandomPuzzle } from './utils/generator';
import { GridPos, Puzzle } from './types';
import { sound } from './utils/sound';
import { getStreakData, recordPuzzleCompletion, StreakData } from './utils/streak';
import { recordScore } from './utils/leaderboard';
import {
  getLevel,
  getUserProgress,
  saveUserProgress,
  saveLevelCompletion,
  getMaxHintsForLevel,
  TOTAL_LEVELS,
  UserProgress,
} from './utils/levels';

export default function App() {
  // Navigation Screen State: 'home' | 'game' | 'levels' | 'scores' | 'guide' | 'settings'
  const [currentScreen, setCurrentScreen] = useState<NavTab>('home');

  // ZipZag Level Progress (Levels 1 to 500)
  const [progress, setProgress] = useState<UserProgress>(() => getUserProgress());
  const [currentLevel, setCurrentLevel] = useState<number>(() => progress.currentLevel || 1);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(() => getLevel(progress.currentLevel || 1));
  const [starsEarned, setStarsEarned] = useState<number>(3);

  // Dynamic hints remaining for current level based on tier
  const [hintsRemaining, setHintsRemaining] = useState<number>(() =>
    currentPuzzle.maxHints !== undefined ? currentPuzzle.maxHints : getMaxHintsForLevel(progress.currentLevel || 1)
  );

  // Daily puzzle streak state
  const [streakData, setStreakData] = useState<StreakData>(() => getStreakData());
  const [isPersonalBest, setIsPersonalBest] = useState<boolean>(false);

  // Selected generator difficulty (Easy, Medium, Hard)
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zip_generator_difficulty');
      if (saved === 'Easy' || saved === 'Medium' || saved === 'Hard') return saved;
    }
    return 'Medium';
  });

  const handleDifficultyChange = (diff: 'Easy' | 'Medium' | 'Hard') => {
    setSelectedDifficulty(diff);
    if (typeof window !== 'undefined') {
      localStorage.setItem('zip_generator_difficulty', diff);
    }
  };

  // Path state: begins at starting cell
  const [path, setPath] = useState<GridPos[]>([currentPuzzle.startPos]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hintPos, setHintPos] = useState<GridPos | null>(null);

  // Modals state
  const [isLevelSelectModalOpen, setIsLevelSelectModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);

  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Solution preview animation refs & state
  const isShowingSolutionRef = useRef(false);
  const [isShowingSolution, setIsShowingSolution] = useState(false);
  const solveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const solveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopSolutionPreview = useCallback(() => {
    if (solveIntervalRef.current) {
      clearInterval(solveIntervalRef.current);
      solveIntervalRef.current = null;
    }
    if (solveTimeoutRef.current) {
      clearTimeout(solveTimeoutRef.current);
      solveTimeoutRef.current = null;
    }
    isShowingSolutionRef.current = false;
    setIsShowingSolution(false);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      stopSolutionPreview();
    };
  }, [stopSolutionPreview]);

  // Select a specific level (1 to 500)
  const handleSelectLevel = useCallback((levelNum: number) => {
    stopSolutionPreview();
    const safeNum = Math.max(1, Math.min(TOTAL_LEVELS, levelNum));
    const newPuzzle = getLevel(safeNum);
    setCurrentLevel(safeNum);
    setCurrentPuzzle(newPuzzle);
    setHintsRemaining(newPuzzle.maxHints !== undefined ? newPuzzle.maxHints : getMaxHintsForLevel(safeNum));
    setPath([newPuzzle.startPos]);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setIsCompleted(false);
    setErrorMsg(null);
    setHintPos(null);
    setIsPersonalBest(false);
    setCurrentScreen('game');

    setProgress((prev) => {
      const nextProg = { ...prev, currentLevel: safeNum };
      saveUserProgress(nextProg);
      return nextProg;
    });
  }, []);

  // Select custom / tutorial puzzle
  const handleSelectPuzzle = useCallback((newPuzzle: Puzzle) => {
    stopSolutionPreview();
    setCurrentPuzzle(newPuzzle);
    setHintsRemaining(
      newPuzzle.maxHints !== undefined
        ? newPuzzle.maxHints
        : newPuzzle.levelNumber
        ? getMaxHintsForLevel(newPuzzle.levelNumber)
        : 3
    );
    setPath([newPuzzle.startPos]);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setIsCompleted(false);
    setErrorMsg(null);
    setHintPos(null);
    setIsPersonalBest(false);
    setCurrentScreen('game');
  }, []);

  // Timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isCompleted) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isCompleted]);

  // Check victory condition
  useEffect(() => {
    if (isCompleted || isShowingSolutionRef.current) return;
    const totalCells = currentPuzzle.rows * currentPuzzle.cols;
    if (path.length === totalCells) {
      // Check if all checkpoints visited
      const visitedCheckpoints = new Set<number>();
      path.forEach((p) => {
        const val = currentPuzzle.checkpoints[`${p.r},${p.c}`];
        if (val !== undefined) visitedCheckpoints.add(val);
      });

      if (visitedCheckpoints.size === currentPuzzle.totalCheckpoints) {
        setIsCompleted(true);
        setIsTimerRunning(false);
        setIsWinModalOpen(true);

        // Record level stars & unlocked progression
        if (currentPuzzle.levelNumber) {
          const { stars } = saveLevelCompletion(
            currentPuzzle.levelNumber,
            elapsedSeconds,
            path.length
          );
          setStarsEarned(stars);
          setProgress(getUserProgress());
        }

        // Record daily puzzle completion in local storage streak system
        const { streakData: updatedStreak } = recordPuzzleCompletion(
          currentPuzzle.id,
          currentPuzzle.name,
          elapsedSeconds,
          path.length
        );
        setStreakData(updatedStreak);

        // Record high score in local storage leaderboard
        const { isPersonalBest: pb } = recordScore(
          currentPuzzle.id,
          currentPuzzle.name,
          elapsedSeconds,
          path.length
        );
        setIsPersonalBest(pb);
      }
    }
  }, [path, currentPuzzle, elapsedSeconds]);

  // Handle path change
  const handlePathChange = (newPath: GridPos[]) => {
    if (!isTimerRunning && !isCompleted && newPath.length > 1) {
      setIsTimerRunning(true);
    }
    setPath(newPath);
    // Clear error message if player made a valid move
    if (errorMsg) setErrorMsg(null);
    if (hintPos) setHintPos(null);
  };

  // Handle error with auto dismiss and error sound
  const handleError = (msg: string) => {
    sound.playError();
    setErrorMsg(msg);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => {
      setErrorMsg(null);
    }, 3800);
  };

  // Undo last move
  const handleUndo = () => {
    if (path.length > 1) {
      sound.playUndo();
      setPath((prev) => prev.slice(0, -1));
      setErrorMsg(null);
      setHintPos(null);
    }
  };

  // Reset current board
  const handleReset = () => {
    stopSolutionPreview();
    sound.playUndo();
    setPath([currentPuzzle.startPos]);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setIsCompleted(false);
    setErrorMsg(null);
    setHintPos(null);
    setHintsRemaining(
      currentPuzzle.maxHints !== undefined
        ? currentPuzzle.maxHints
        : getMaxHintsForLevel(currentLevel)
    );
  };

  // Smart Hint using puzzle's pre-calculated solution
  const handleHint = () => {
    if (isCompleted) return;

    if (hintsRemaining <= 0) {
      handleError('No hints left for this level! Try Undo or Reset.');
      return;
    }

    if (currentPuzzle.solution) {
      const sol = currentPuzzle.solution;
      let matchLen = 0;
      for (let i = 0; i < path.length; i++) {
        if (i < sol.length && path[i].r === sol[i].r && path[i].c === sol[i].c) {
          matchLen++;
        } else {
          break;
        }
      }

      if (matchLen === path.length && matchLen < sol.length) {
        // Path is on the right track! Show next step with pulsing animation
        const nextStep = sol[matchLen];
        sound.playHint();
        setHintPos(nextStep);
        setHintsRemaining((prev) => Math.max(0, prev - 1));
        if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = setTimeout(() => setHintPos(null), 5000);
        return;
      } else {
        // Current path diverged, advise to rewind
        handleError('Path diverged from solution! Rewinding back to last correct step...');
        if (matchLen > 0) {
          setPath(path.slice(0, matchLen));
        } else {
          setPath([currentPuzzle.startPos]);
        }
        setHintsRemaining((prev) => Math.max(0, prev - 1));
        return;
      }
    }

    // Fallback: look for adjacent unvisited cell that is the next checkpoint
    const head = path[path.length - 1];
    const visitedSet = new Set(path.map((p) => `${p.r},${p.c}`));
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const candidates: GridPos[] = [];

    const passed = path.reduce((count, p) => {
      const val = currentPuzzle.checkpoints[`${p.r},${p.c}`];
      return val !== undefined ? Math.max(count, val) : count;
    }, 1);
    const targetNext = passed + 1;

    for (const [dr, dc] of dirs) {
      const nr = head.r + dr;
      const nc = head.c + dc;
      const key = `${nr},${nc}`;
      if (
        nr >= 0 &&
        nr < currentPuzzle.rows &&
        nc >= 0 &&
        nc < currentPuzzle.cols &&
        !visitedSet.has(key)
      ) {
        const val = currentPuzzle.checkpoints[key];
        if (val === undefined || val === targetNext) {
          candidates.push({ r: nr, c: nc });
        }
      }
    }

    if (candidates.length > 0) {
      sound.playHint();
      setHintPos(candidates[0]);
      setHintsRemaining((prev) => Math.max(0, prev - 1));
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => setHintPos(null), 5000);
    } else {
      handleError('Stuck in a dead end! Click Undo or Reset to try another route.');
    }
  };

  // Show quick solution preview animation (completes then disappears without passing level)
  const handleSolve = () => {
    if (isCompleted || isShowingSolutionRef.current || !currentPuzzle.solution) return;

    stopSolutionPreview();

    const sol = currentPuzzle.solution;
    isShowingSolutionRef.current = true;
    setIsShowingSolution(true);

    let step = 0;
    // Fast snappy animation: ~18-24ms per step
    const stepDuration = Math.max(16, Math.min(25, Math.floor(1500 / sol.length)));

    solveIntervalRef.current = setInterval(() => {
      if (step < sol.length) {
        setPath(sol.slice(0, step + 1));
        if (step % 2 === 0) {
          sound.playTick(step);
        }
        step++;
      } else {
        // Complete path reached
        if (solveIntervalRef.current) {
          clearInterval(solveIntervalRef.current);
          solveIntervalRef.current = null;
        }
        sound.playHint();

        // Keep solution visible briefly (750ms) so user can see it,
        // then clear back to start cell so the user must solve it themselves!
        solveTimeoutRef.current = setTimeout(() => {
          setPath([currentPuzzle.startPos]);
          isShowingSolutionRef.current = false;
          setIsShowingSolution(false);
          solveTimeoutRef.current = null;
        }, 750);
      }
    }, stepDuration);
  };

  // Generate new random puzzle using selected difficulty
  const handleGenerateNew = (overrideDifficulty?: 'Easy' | 'Medium' | 'Hard') => {
    const diffToUse = overrideDifficulty || selectedDifficulty;
    const newPuz = generateRandomPuzzle(diffToUse);
    handleSelectPuzzle(newPuz);
  };

  // Switch to next level
  const handleNextLevel = () => {
    const nextLevel = Math.min(TOTAL_LEVELS, currentLevel + 1);
    handleSelectLevel(nextLevel);
    setIsWinModalOpen(false);
  };

  // Switch to prev level
  const handlePrevLevel = () => {
    if (currentLevel > 1) {
      handleSelectLevel(currentLevel - 1);
    }
  };

  // Toggle unlock all
  const handleToggleUnlockAll = () => {
    setProgress((prev) => {
      const updated = { ...prev, unlockedAll: !prev.unlockedAll };
      saveUserProgress(updated);
      return updated;
    });
  };

  // Checkpoints passed count
  const checkpointsPassed = path.reduce((count, p) => {
    const val = currentPuzzle.checkpoints[`${p.r},${p.c}`];
    return val !== undefined ? Math.max(count, val) : count;
  }, 1);

  return (
    <>
      {currentScreen === 'home' ? (
        <HomeScreen
          currentLevel={currentLevel}
          progress={progress}
          streakData={streakData}
          onPlayCurrentLevel={() => {
            sound.playTick(1);
            setCurrentScreen('game');
          }}
          onOpenLevelSelect={() => setCurrentScreen('levels')}
          onOpenLeaderboard={() => setCurrentScreen('scores')}
          onOpenGuide={() => setCurrentScreen('guide')}
          onOpenHowToPlay={() => setIsHowToPlayModalOpen(true)}
          onOpenSettings={() => setCurrentScreen('settings')}
          onQuickPlay={() => {
            handleGenerateNew();
            setCurrentScreen('game');
          }}
        />
      ) : currentScreen === 'levels' ? (
        <LevelsScreen
          currentLevel={currentLevel}
          progress={progress}
          onSelectLevel={handleSelectLevel}
          onToggleUnlockAll={handleToggleUnlockAll}
          onGoToGame={() => setCurrentScreen('game')}
        />
      ) : currentScreen === 'scores' ? (
        <LeaderboardScreen
          currentLevel={currentLevel}
          onGoToGame={() => setCurrentScreen('game')}
        />
      ) : currentScreen === 'guide' ? (
        <GuideScreen
          currentLevel={currentLevel}
          onGoToGame={() => setCurrentScreen('game')}
          onPlayScreenshotPuzzle={() => handleSelectPuzzle(SCREENSHOT_PUZZLE)}
        />
      ) : currentScreen === 'settings' ? (
        <SettingsScreen
          currentLevel={currentLevel}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={handleDifficultyChange}
          onGenerateNewWithDifficulty={() => handleGenerateNew(selectedDifficulty)}
          onResetGame={handleReset}
          onGoToGame={() => setCurrentScreen('game')}
          onOpenHowToPlay={() => setIsHowToPlayModalOpen(true)}
        />
      ) : (
        <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col justify-between antialiased selection:bg-orange-200">
          {/* Top Header: ZipZag Branding, Home & Level Switcher */}
          <Header
            currentPuzzle={currentPuzzle}
            currentLevel={currentLevel}
            progress={progress}
            streakData={streakData}
            onGoHome={() => setCurrentScreen('home')}
            onOpenLevelSelect={() => setCurrentScreen('levels')}
            onOpenLeaderboard={() => setCurrentScreen('scores')}
            onPrevLevel={handlePrevLevel}
            onNextLevel={handleNextLevel}
            onOpenHowToPlay={() => setIsHowToPlayModalOpen(true)}
            onOpenExplanation={() => setCurrentScreen('guide')}
            onOpenSettings={() => setCurrentScreen('settings')}
          />

          {/* Main Play Area */}
          <main className="flex-1 flex flex-col items-center justify-start w-full py-1 sm:py-3 pb-24 sm:pb-8">
            {/* Game HUD Status & Coverage Bar */}
            <SubBar
              elapsedSeconds={elapsedSeconds}
              cellsVisited={path.length}
              totalCells={currentPuzzle.rows * currentPuzzle.cols}
              checkpointsPassed={checkpointsPassed}
              totalCheckpoints={currentPuzzle.totalCheckpoints}
              levelNumber={currentPuzzle.levelNumber}
              difficultyPercent={currentPuzzle.difficultyPercent}
              tierName={currentPuzzle.tierName}
            />

            {/* Error Toast: Floating overlay (zero layout shift/jerk) */}
            <ErrorToast message={errorMsg} />

            {/* Interactive Board */}
            <GameBoard
              puzzle={currentPuzzle}
              path={path}
              onPathChange={handlePathChange}
              onError={handleError}
              isCompleted={isCompleted}
              hintPos={hintPos}
              isSolving={isShowingSolution}
            />

            {/* Controls (Undo, Reset, Hint, Solve, New Puzzle) */}
            <Controls
              canUndo={path.length > 1 && !isCompleted && !isShowingSolution}
              onUndo={handleUndo}
              onReset={handleReset}
              onHint={handleHint}
              onSolve={handleSolve}
              onGenerateNew={() => handleGenerateNew()}
              hasSolution={!!currentPuzzle.solution}
              difficulty={selectedDifficulty}
              hintsRemaining={hintsRemaining}
              maxHints={currentPuzzle.maxHints || getMaxHintsForLevel(currentLevel)}
              isSolving={isShowingSolution}
            />

            {/* Original Strategy & Keyboard Tips Strip */}
            <HowToPlayDrawer onOpenExplanation={() => setCurrentScreen('guide')} />
          </main>
        </div>
      )}

      {/* Native Mobile App Pinned Bottom Navigation (Hidden on PC/Desktop via sm:hidden) */}
      <MobileBottomNav
        currentTab={currentScreen}
        onNavigate={(tab) => setCurrentScreen(tab)}
      />

      {/* Global Modals: Accessible from both Home Screen & Game Board */}

      {/* Level Select Modal (Levels 1 to 500) */}
      <LevelSelectModal
        isOpen={isLevelSelectModalOpen}
        onClose={() => setIsLevelSelectModalOpen(false)}
        currentLevel={currentLevel}
        progress={progress}
        onSelectLevel={handleSelectLevel}
        onToggleUnlockAll={handleToggleUnlockAll}
      />

      {/* Leaderboard & High Scores Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={() => setIsLeaderboardModalOpen(false)}
        currentLevel={currentLevel}
      />

      {/* How to play Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayModalOpen}
        onClose={() => setIsHowToPlayModalOpen(false)}
        onPlayTutorial={() => handleSelectLevel(1)}
      />

      {/* Explanation Guide Modal */}
      <ExplanationGuideModal
        isOpen={isExplanationModalOpen}
        onClose={() => setIsExplanationModalOpen(false)}
        onPlayScreenshotPuzzle={() => handleSelectPuzzle(SCREENSHOT_PUZZLE)}
      />

      {/* Settings & Audio Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onResetGame={handleReset}
        onOpenHowToPlay={() => setIsHowToPlayModalOpen(true)}
        currentPuzzleId={currentPuzzle.id}
        currentPuzzleName={currentPuzzle.name}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={handleDifficultyChange}
        onGenerateNewWithDifficulty={() => {
          handleGenerateNew();
          setIsSettingsModalOpen(false);
          setCurrentScreen('game');
        }}
      />

      {/* Victory Celebration Modal */}
      <WinModal
        isOpen={isWinModalOpen}
        timeSeconds={elapsedSeconds}
        totalCells={currentPuzzle.rows * currentPuzzle.cols}
        moves={path.length}
        puzzleName={currentPuzzle.name}
        levelNumber={currentPuzzle.levelNumber}
        starsEarned={starsEarned}
        currentStreak={streakData.currentStreak}
        isPersonalBest={isPersonalBest}
        onNextPuzzle={handleNextLevel}
        onReplay={handleReset}
        onClose={() => setIsWinModalOpen(false)}
        onGoHome={() => {
          setIsWinModalOpen(false);
          setCurrentScreen('home');
        }}
      />
    </>
  );
}
