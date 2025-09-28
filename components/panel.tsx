import React from 'react';
import { RotateCcw, RefreshCw } from 'lucide-react';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Preferences {
  time: number;
  words: number;
  difficulty: Difficulty;
}

interface PanelProps {
  preferences: Preferences;
  onPreferenceChange: (key: keyof Preferences, value: string | number) => void;
  onReset: () => void;
  onTryAgain: () => void;
  isActive: boolean;
  isFinished: boolean;
}

const Panel: React.FC<PanelProps> = ({ 
  preferences, 
  onPreferenceChange, 
  onReset, 
  onTryAgain,
  isActive,
  isFinished 
}) => {
  const handlePreferenceChange = (key: keyof Preferences, value: string | number) => {
    if (!isActive) {
      onPreferenceChange(key, value);
    }
  };

  return (
    <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
      {/* Main Settings Row */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 sm:gap-6 p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-700">
        {/* Timer Section */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center">
          <span className="text-gray-300 font-medium text-xs sm:text-sm whitespace-nowrap">Timer</span>
          <div className="flex gap-1 p-1 bg-gray-800 rounded-md border border-gray-600">
            {[15, 30, 60,].map(time => (
              <button
                key={time}
                onClick={() => handlePreferenceChange('time', time)}
                disabled={isActive}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                  preferences.time === time
                    ? 'bg-[#00d9b7] text-black shadow-sm'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {time}s
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Section */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center">
          <span className="text-gray-300 font-medium text-xs sm:text-sm whitespace-nowrap">Difficulty</span>
          <div className="flex gap-1 p-1 bg-gray-800 rounded-md border border-gray-600">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(difficulty => (
              <button
                key={difficulty}
                onClick={() => handlePreferenceChange('difficulty', difficulty)}
                disabled={isActive}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-medium transition-all duration-200 capitalize ${
                  preferences.difficulty === difficulty
                    ? 'bg-[#00d9b7] text-black shadow-sm'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Word Count Section */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center">
          <span className="text-gray-300 font-medium text-xs sm:text-sm whitespace-nowrap">Word Count</span>
          <div className="flex gap-1 p-1 bg-gray-800 rounded-md border border-gray-600">
            {[10, 25, 50].map(count => (
              <button
                key={count}
                onClick={() => handlePreferenceChange('words', count)}
                disabled={isActive}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                  preferences.words === count
                    ? 'bg-[#00d9b7] text-black shadow-sm'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-all duration-200 font-medium text-white text-sm border border-gray-600 hover:border-gray-500 transform hover:scale-105"
        >
          <RotateCcw size={16} />
          Reset Test
        </button>

        {isFinished && (
          <button
            onClick={onTryAgain}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-[#00d9b7] to-[#00c4a7] text-black rounded-md hover:from-[#00c4a7] hover:to-[#00b399] transition-all duration-200 font-medium text-sm transform hover:scale-105 shadow-md"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Panel;