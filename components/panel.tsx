import React from 'react';
import { RotateCcw } from 'lucide-react';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Mode = 'time' | 'words';

export interface Preferences {
  time: number;
  words: number;
  mode: Mode;
  difficulty: Difficulty;
}

interface PanelProps {
  preferences: Preferences;
  onPreferenceChange: (key: keyof Preferences, value: string | number) => void;
  onReset: () => void;
  isActive: boolean;
}

const Panel: React.FC<PanelProps> = ({ 
  preferences, 
  onPreferenceChange, 
  onReset, 
  isActive 
}) => {
  const handlePreferenceChange = (key: keyof Preferences, value: string | number) => {
    if (!isActive) {
      onPreferenceChange(key, value);
    }
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Main Settings Row */}
      <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        {/* Timer Section */}
        <div className="flex items-center gap-3">
          <span className="text-gray-300 font-medium text-sm">Timer</span>
          <div className="flex gap-1 p-1 bg-gray-800 rounded-md border border-gray-600">
            {[15, 30, 45, 60, 120].map(time => (
              <button
                key={time}
                onClick={() => handlePreferenceChange('time', time)}
                disabled={isActive}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
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

        {/* Mode Section */}
        <div className="flex items-center gap-3">
          <span className="text-gray-300 font-medium text-sm">Mode</span>
          <div className="flex gap-1 p-1 bg-gray-800 rounded-md border border-gray-600">
            {(['time', 'words'] as Mode[]).map(mode => (
              <button
                key={mode}
                onClick={() => handlePreferenceChange('mode', mode)}
                disabled={isActive}
                className={`px-4 py-1.5 rounded text-xs font-medium transition-all duration-200 capitalize ${
                  preferences.mode === mode
                    ? 'bg-[#00d9b7] text-black shadow-sm'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Section */}
        <div className="flex items-center gap-3">
          <span className="text-gray-300 font-medium text-sm">Difficulty</span>
          <div className="flex gap-1 p-1 bg-gray-800 rounded-md border border-gray-600">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(difficulty => (
              <button
                key={difficulty}
                onClick={() => handlePreferenceChange('difficulty', difficulty)}
                disabled={isActive}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 capitalize ${
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
        <div className="flex items-center gap-3">
          <span className="text-gray-300 font-medium text-sm">Word Count</span>
          <div className="flex gap-1 p-1 bg-gray-800 rounded-md border border-gray-600">
            {[10, 25, 50, 100].map(count => (
              <button
                key={count}
                onClick={() => handlePreferenceChange('words', count)}
                disabled={isActive}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
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

      {/* Reset Button */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-all duration-200 font-medium text-white text-sm border border-gray-600 hover:border-gray-500 transform hover:scale-105"
        >
          <RotateCcw size={16} />
          Reset Test
        </button>
      </div>
    </div>
  );
};

export default Panel;