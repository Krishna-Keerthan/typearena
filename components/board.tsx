'use client'

import React, { useEffect, useCallback } from 'react';
import { Preferences } from '@/components/panel';
import { updateLeaderboard } from '@/actions/leaderboards';
import { useSession } from 'next-auth/react';
import { Difficulty } from '@/types/leaderboard';

interface BoardProps {
  preferences: Preferences;
  timeLeft: number;
  wordsCompleted: number;
  errors: number;
  totalChars: number;
  isActive: boolean;
  isFinished: boolean;
  startTime: number;
}

const Board: React.FC<BoardProps> = ({
  preferences,
  timeLeft,
  wordsCompleted,
  errors,
  totalChars,
  isActive,
  isFinished,
  startTime
}) => {

  const {data:session} = useSession()
  const userId = session?.user.id


  // Calculate precise WPM and accuracy
  const calculateStats = () => {
    let timeElapsed: number;

    // Calculate based on elapsed time from start
    if (isFinished && startTime > 0) {
      timeElapsed = (Date.now() - startTime) / 60000; // Convert to minutes
    } else if (isActive && startTime > 0) {
      timeElapsed = (Date.now() - startTime) / 60000;
    } else {
      // Use time elapsed from timer for more precision
      timeElapsed = (preferences.time - timeLeft) / 60;
    }

    // Ensure minimum time for calculations
    if (timeElapsed < 0.01) timeElapsed = 0.01;

    // Calculate WPM (Words Per Minute)
    const wpm = Math.round(wordsCompleted / timeElapsed);

    // Calculate accuracy percentage
    const accuracy = totalChars > 0 ? Math.round(((totalChars - errors) / totalChars) * 100) : 100;

    // Calculate net WPM (accounting for errors)
    const netWpm = Math.round((wordsCompleted - errors) / timeElapsed);

    return {
      wpm: Math.max(0, wpm),
      accuracy: Math.max(0, Math.min(100, accuracy)),
      netWpm: Math.max(0, netWpm),
      timeElapsed: timeElapsed * 60 
    };
  };



  const { wpm, accuracy, netWpm } = calculateStats();

  const addLeaderboard = useCallback(async () => {

    const difficultyEnum: Difficulty =
      preferences.difficulty.toLowerCase() === "easy"
        ? Difficulty.EASY
        : preferences.difficulty.toLowerCase() === "medium"
          ? Difficulty.MEDIUM
          : Difficulty.HARD;

    if (isFinished) {
      if (!userId) {
        return
      }
      const result = await updateLeaderboard({
        wpm,
        accuracy,
        difficulty: difficultyEnum,
        userId
      });
      console.log(result);
    }

  }, [isFinished, userId, wpm, accuracy, preferences.difficulty]);



  useEffect(() => {
    addLeaderboard()
  }, [isFinished, addLeaderboard])



  // Get time display - always show countdown
  const getTimeDisplay = (): string => {
    return `${timeLeft}s`;
  };

  // Get performance level and color
  const getPerformanceLevel = () => {
    if (accuracy >= 95 && wpm >= 40) return { level: "Expert", color: "text-purple-400", emoji: "🏆" };
    if (accuracy >= 90 && wpm >= 30) return { level: "Advanced", color: "text-green-400", emoji: "🎉" };
    if (accuracy >= 80 && wpm >= 20) return { level: "Good", color: "text-blue-400", emoji: "👍" };
    return { level: "Beginner", color: "text-yellow-400", emoji: "💪" };
  };

  return (
    <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-5">
      {/* Live Stats Display - Compact and Modern */}
      <div className="flex justify-center px-2">
        {/* Mobile Layout - Grid */}
        <div className="sm:hidden grid grid-cols-2 gap-3 w-full max-w-sm">
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 text-center">
            <div className="text-gray-400 text-xs font-medium uppercase mb-1">Time</div>
            <div className="text-[#00d9b7] font-bold text-base tabular-nums">{getTimeDisplay()}</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 text-center">
            <div className="text-gray-400 text-xs font-medium uppercase mb-1">WPM</div>
            <div className="text-[#00d9b7] font-bold text-base tabular-nums">{wpm}</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 text-center">
            <div className="text-gray-400 text-xs font-medium uppercase mb-1">Accuracy</div>
            <div className={`font-bold text-base tabular-nums ${accuracy >= 95 ? 'text-green-400' : accuracy >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>{accuracy}%</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 text-center">
            <div className="text-gray-400 text-xs font-medium uppercase mb-1">Words</div>
            <div className="text-white font-bold text-base tabular-nums">{wordsCompleted}</div>
          </div>
          {errors > 0 && (
            <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 text-center col-span-2">
              <div className="text-gray-400 text-xs font-medium uppercase mb-1">Errors</div>
              <div className="text-red-400 font-bold text-base tabular-nums">{errors}</div>
            </div>
          )}
        </div>
        
        {/* Desktop Layout - Horizontal */}
        <div className="hidden sm:inline-flex items-center gap-4 lg:gap-6 px-4 lg:px-6 py-3 bg-gray-900 rounded-full border border-gray-700 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-medium uppercase">Time</span>
            <span className="text-[#00d9b7] font-bold text-base lg:text-lg tabular-nums min-w-[50px] lg:min-w-[60px] text-center">
              {getTimeDisplay()}
            </span>
          </div>

          <div className="w-px h-4 bg-gray-700" />

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-medium uppercase">WPM</span>
            <span className="text-[#00d9b7] font-bold text-base lg:text-lg tabular-nums min-w-[35px] lg:min-w-[40px] text-center">
              {wpm}
            </span>
          </div>

          <div className="w-px h-4 bg-gray-700" />

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-medium uppercase">Accuracy</span>
            <span className={`font-bold text-base lg:text-lg tabular-nums min-w-[45px] lg:min-w-[50px] text-center ${accuracy >= 95 ? 'text-green-400' :
              accuracy >= 85 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
              {accuracy}%
            </span>
          </div>

          <div className="w-px h-4 bg-gray-700" />

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-medium uppercase">Words</span>
            <span className="text-white font-bold text-base lg:text-lg tabular-nums min-w-[35px] lg:min-w-[40px] text-center">
              {wordsCompleted}
            </span>
          </div>

          {errors > 0 && (
            <>
              <div className="w-px h-4 bg-gray-700" />
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs font-medium uppercase">Errors</span>
                <span className="text-red-400 font-bold text-base lg:text-lg tabular-nums min-w-[25px] lg:min-w-[30px] text-center">
                  {errors}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detailed Results (shown when test is finished) */}
      {isFinished && (
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          {/* Performance Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 rounded-full border border-gray-700 mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">{getPerformanceLevel().emoji}</span>
              <span className={`text-lg sm:text-xl font-bold ${getPerformanceLevel().color}`}>
                {getPerformanceLevel().level}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Test Results
            </h2>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* Gross WPM */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 rounded-xl text-center border border-gray-700 hover:border-[#00d9b7] transition-all duration-200">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#00d9b7] mb-2 tabular-nums">
                {wpm}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wide">
                WPM
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Gross Speed
              </div>
            </div>

            {/* Net WPM */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 rounded-xl text-center border border-gray-700 hover:border-blue-400 transition-all duration-200">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400 mb-2 tabular-nums">
                {netWpm}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wide">
                Net WPM
              </div>
              <div className="text-xs text-gray-500 mt-1">
                After Errors
              </div>
            </div>

            {/* Accuracy */}
            <div className={`bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 rounded-xl text-center border border-gray-700 hover:border-${accuracy >= 95 ? 'green-400' : accuracy >= 85 ? 'yellow-400' : 'red-400'
              } transition-all duration-200`}>
              <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 tabular-nums ${accuracy >= 95 ? 'text-green-400' :
                accuracy >= 85 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                {accuracy}%
              </div>
              <div className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wide">
                Accuracy
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {accuracy >= 95 ? 'Excellent' : accuracy >= 85 ? 'Good' : 'Needs Work'}
              </div>
            </div>

            {/* Words */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 rounded-xl text-center border border-gray-700 hover:border-white transition-all duration-200">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 tabular-nums">
                {wordsCompleted}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wide">
                Words
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Completed
              </div>
            </div>
          </div>

          {/* Additional Stats - Simplified */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <span className="text-gray-400 text-xs sm:text-sm">Characters Typed:</span>
                <span className="text-lg sm:text-xl font-bold text-white tabular-nums">{totalChars}</span>
              </div>
            </div>

            <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <span className="text-gray-400 text-xs sm:text-sm">Total Errors:</span>
                <span className="text-lg sm:text-xl font-bold text-red-400 tabular-nums">{errors}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Board;