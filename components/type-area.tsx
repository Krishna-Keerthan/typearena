import React, { useRef, useEffect } from 'react';
import { Difficulty } from '@/components/panel';

interface TypeAreaProps {
  currentText: string;
  userInput: string;
  currentWordIndex: number;
  currentCharIndex: number;
  isFinished: boolean;
  isActive: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStart: () => void;
}

export const wordLists: Record<Difficulty, string[]> = {
  easy: [
    'the', 'and', 'you', 'that', 'was', 'for', 'are', 'with', 'his', 'they', 
    'have', 'this', 'will', 'your', 'from', 'can', 'had', 'her', 'would', 'make', 
    'like', 'time', 'very', 'when', 'come', 'may', 'way', 'work', 'life', 'only', 
    'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'first', 
    'well', 'even', 'new', 'want', 'any', 'these', 'give', 'day', 'most', 'us'
  ],
  medium: [
    'buy', 'too', 'frighten', 'some', 'saw', 'offer', 'possible', 'never', 'cheat', 'between', 
    'through', 'because', 'different', 'important', 'example', 'government', 'without', 'usually', 
    'business', 'something', 'during', 'world', 'school', 'state', 'family', 'student', 'group', 
    'country', 'problem', 'hand', 'right', 'system', 'program', 'question', 'company', 'number', 
    'fact', 'water', 'history', 'money', 'story', 'young', 'month', 'right', 'study', 'book', 
    'eye', 'job', 'word', 'though'
  ],
  hard: [
    'accommodate', 'embarrass', 'millennium', 'occurrence', 'privilege', 'rhythm', 'separate', 
    'tomorrow', 'necessary', 'definitely', 'category', 'beginning', 'immediate', 'environment', 
    'maintenance', 'restaurant', 'guarantee', 'independent', 'experience', 'development', 
    'intelligence', 'achievement', 'explanation', 'temperature', 'particular', 'competition', 
    'organization', 'understand', 'management', 'comfortable', 'knowledge', 'opportunity', 
    'technology', 'information', 'administration', 'responsibility', 'communication', 
    'transportation', 'infrastructure', 'characteristic', 'consciousness', 'recommendation', 
    'acknowledgment', 'disappointment', 'representative', 'classification', 'transformation', 
    'establishment', 'implementation', 'extraordinary'
  ]
};

const TypeArea: React.FC<TypeAreaProps> = ({
  currentText,
  userInput,
  currentWordIndex,
  currentCharIndex,
  isFinished,
  isActive,
  onInputChange,
  onStart
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !isFinished) {
      inputRef.current.focus();
    }
  }, [isFinished]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive && !isFinished) {
      onStart();
    }
    onInputChange(e);
  };

  const renderText = () => {
    if (!currentText) return null;
  
    const words = currentText.split(' ');
  
    return (
      <div className="p-3 sm:p-4 font-mono text-sm sm:text-base lg:text-lg leading-relaxed select-none">
        <div className="text-xs text-gray-500 uppercase tracking-wider font-sans mb-3 sm:mb-4">
          TYPE THE TEXT BELOW
        </div>
  
        <div className="flex flex-wrap">
          {words.map((word, wordIndex) => {
            const isCurrentWord = wordIndex === currentWordIndex;
            const isPastWord = wordIndex < currentWordIndex;
  
            return (
              <span key={`${wordIndex}-${word}`} className="mr-2 mb-1">
                {word.split('').map((char, charIndex) => {
                  let className = 'inline-block transition-colors duration-150';
  
                  if (isPastWord) {
                    className += ' text-gray-600';
                  } else if (isCurrentWord) {
                    if (charIndex < currentCharIndex) {
                      const typedChar = userInput[charIndex];
                      className += typedChar === char
                        ? ' text-[#00d9b7]'
                        : ' text-red-400';
                    } else if (charIndex === currentCharIndex) {
                      className += ' text-white underline'; // subtle cursor
                    } else {
                      className += ' text-gray-400';
                    }
                  } else {
                    className += ' text-gray-500';
                  }
  
                  return (
                    <span key={`${wordIndex}-${charIndex}-${char}`} className={className}>
                      {char}
                    </span>
                  );
                })}
                {/* Space after word */}
                <span className="inline-block w-1">&nbsp;</span>
              </span>
            );
          })}
        </div>
  
        {/* Progress */}
        <div className="text-xs text-gray-500 font-sans text-right mt-2">
          {currentWordIndex + 1} / {words.length} words
        </div>
      </div>
    );
  };
  

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Text Display Area */}
      <div className="bg-gray-900 rounded-lg border-2 border-gray-700 min-h-36 sm:min-h-48 relative">
        {renderText()}
        
        {/* Status indicator */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2">
          {isActive && !isFinished && (
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 bg-[#00d9b7] rounded-full animate-pulse" />
              <span className="text-xs text-gray-400 font-sans hidden sm:inline">TYPING</span>
            </div>
          )}
          {isFinished && (
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-gray-400 font-sans hidden sm:inline">COMPLETED</span>
            </div>
          )}
        </div>
      </div>

      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={isFinished}
          className="w-full p-3 sm:p-4 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-mono text-sm sm:text-base lg:text-lg focus:outline-none focus:border-[#00d9b7] transition-all duration-200 placeholder-gray-500"
          placeholder={
            isFinished 
              ? "Test completed! Check your results below." 
              : isActive 
                ? "Keep typing..." 
                : "Click here and start typing..."
          }
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
        
        {/* Input status indicator */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {isActive && !isFinished && (
            <div className="w-2 h-2 bg-[#00d9b7] rounded-full animate-pulse" />
          )}
          {isFinished && (
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TypeArea;