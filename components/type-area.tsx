import React, { useRef, useEffect, useLayoutEffect } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const caretAnchorRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current && !isFinished) {
      inputRef.current.focus();
    }
  }, [isFinished]);

  // Keep the hidden input focused so typing is always captured directly.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key.length === 1 || e.key === 'Backspace') {
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished]);

  const focusInput = () => {
    if (!isFinished) inputRef.current?.focus();
  };

  useLayoutEffect(() => {
    const anchor = caretAnchorRef.current;
    const caret = caretRef.current;
    const container = containerRef.current;

    if (!anchor || !caret || !container) return;

    const anchorRect = anchor.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    caret.style.left = `${anchorRect.left - containerRect.left}px`;
    caret.style.top = `${anchorRect.top - containerRect.top}px`;
    caret.style.height = `${anchorRect.height}px`;
  }, [currentText, currentWordIndex, currentCharIndex, userInput]);

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
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-sans">
            {isActive ? 'KEEP TYPING' : 'START TYPING'}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {isActive && !isFinished && (
              <>
                <div className="w-2 h-2 bg-[#00d9b7] rounded-full animate-pulse" />
                <span className="text-xs text-gray-400 font-sans hidden sm:inline">TYPING</span>
              </>
            )}
          </div>
        </div>

        <div ref={containerRef} className="flex flex-wrap relative">
          <div
            ref={caretRef}
            className="absolute w-0.5 bg-[#00d9b7] rounded-full pointer-events-none transition-[left,top,height] duration-75 ease-linear animate-caret"
            style={{ left: 0, top: 0, height: '1.25em' }}
          />
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
                    } else {
                      className += ' text-gray-400';
                    }
                  } else {
                    className += ' text-gray-500';
                  }
  
                  return (
                    <React.Fragment key={`${wordIndex}-${charIndex}-${char}`}>
                      {isCurrentWord && charIndex === currentCharIndex && (
                        <span ref={caretAnchorRef} className="inline-block w-0 h-[1.25em]" aria-hidden />
                      )}
                      <span className={className}>
                        {char}
                      </span>
                    </React.Fragment>
                  );
                })}
                {isCurrentWord && currentCharIndex >= word.length && (
                  <span ref={caretAnchorRef} className="inline-block w-0 h-[1.25em]" aria-hidden />
                )}
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
      <div
        onClick={focusInput}
        className="bg-gray-900 rounded-lg border-2 border-gray-700 min-h-36 sm:min-h-48 relative cursor-text"
      >
        {renderText()}

        {!isActive && !isFinished && (
          <div className="absolute inset-x-0 bottom-3 text-center text-xs text-gray-500 font-sans pointer-events-none">
            Click here or start typing to begin
          </div>
        )}
      </div>

      {/* Hidden input captures direct keyboard typing */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isFinished}
        className="sr-only"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        aria-label="Typing input"
      />
    </div>
  );
};

export default TypeArea;