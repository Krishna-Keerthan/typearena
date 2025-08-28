import React from 'react';
import { Preferences } from '@/components/panel';

interface LiveStatsProps {
  preferences: Preferences;
  timeLeft: number;
  wordsCompleted: number;
  errors: number;
  totalChars: number;
  isActive: boolean;
  isFinished: boolean;
  currentStats: { wpm: number; accuracy: number };
}

const LiveStats: React.FC<LiveStatsProps> = ({
  preferences,
  timeLeft,
  wordsCompleted,
  errors,
  totalChars,
  isActive,
  isFinished,
  currentStats
}) => {
  // Get time display
  const getTimeDisplay = (): string => {
    return `${timeLeft}s`;
  };

  return (
    <div className="space-y-6 mt-5">
      {/* Live Stats Display - Compact and Modern */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-6 px-6 py-3 bg-gray-900 rounded-full border border-gray-700 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-medium uppercase">Time</span>
            <span className="text-[#00d9b7] font-bold text-lg tabular-nums min-w-[60px] text-center">
              {getTimeDisplay()}
            </span>
          </div>
          
          <div className="w-px h-4 bg-gray-700" />
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-medium uppercase">WPM</span>
            <span className="text-[#00d9b7] font-bold text-lg tabular-nums min-w-[40px] text-center">
              {currentStats.wpm}
            </span>
          </div>
          
          <div className="w-px h-4 bg-gray-700" />
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-medium uppercase">Accuracy</span>
            <span className={`font-bold text-lg tabular-nums min-w-[50px] text-center ${
              currentStats.accuracy >= 95 ? 'text-green-400' : 
              currentStats.accuracy >= 85 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {currentStats.accuracy}%
            </span>
          </div>
          
          <div className="w-px h-4 bg-gray-700" />
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-medium uppercase">Words</span>
            <span className="text-white font-bold text-lg tabular-nums min-w-[40px] text-center">
              {wordsCompleted}
            </span>
          </div>
          
          {errors > 0 && (
            <>
              <div className="w-px h-4 bg-gray-700" />
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs font-medium uppercase">Errors</span>
                <span className="text-red-400 font-bold text-lg tabular-nums min-w-[30px] text-center">
                  {errors}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isActive && (
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round((wordsCompleted / preferences.words) * 100)}%</span>
          </div>
          <div className="bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#00d9b7] to-[#00c4a7] h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, (wordsCompleted / preferences.words) * 100)}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStats;