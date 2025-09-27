"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Panel, { Preferences } from '@/components/panel';
import TypeArea, { wordLists } from '@/components/type-area';
import Board from '@/components/board';

const TypingTest: React.FC = () => {
  // Preferences state (removed mode)
  const [preferences, setPreferences] = useState<Preferences>({
    time: 30,
    words: 25,
    difficulty: 'medium'
  });

  // Test state
  const [currentText, setCurrentText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(preferences.time);
  const [wordsCompleted, setWordsCompleted] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [errors, setErrors] = useState<number>(0);
  const [totalChars, setTotalChars] = useState<number>(0);

  // Refs for timing
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Generate text based on current preferences
  const generateText = useCallback((): string => {
    const words = wordLists[preferences.difficulty];
    const wordCount = preferences.words;
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selectedWords: string[] = [];
    
    for (let i = 0; i < wordCount; i++) {
      selectedWords.push(shuffled[i % shuffled.length]);
    }
    
    return selectedWords.join(' ');
  }, [preferences.difficulty, preferences.words]);

  // Initialize/Reset test
  const initializeTest = useCallback((): void => {
    // Clear any existing timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Reset all state
    const text = generateText();
    setCurrentText(text);
    setUserInput('');
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setTimeLeft(preferences.time);
    setWordsCompleted(0);
    setIsActive(false);
    setIsFinished(false);
    setErrors(0);
    setTotalChars(0);
    startTimeRef.current = 0;
  }, [preferences, generateText]);

  // Start the test
  const startTest = (): void => {
    if (!isActive && !isFinished) {
      setIsActive(true);
      startTimeRef.current = Date.now();
      
      // Start timer - always use time mode now
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Finish the test
  const finishTest = (): void => {
    setIsActive(false);
    setIsFinished(true);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Handle preference changes
  const handlePreferenceChange = (key: keyof Preferences, value: string | number) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (isFinished) return;

    const value = e.target.value;
    setUserInput(value);
    
    // Increment total characters typed (for accuracy calculation)
    if (value.length > userInput.length) {
      setTotalChars(prev => prev + 1);
    }

    const words = currentText.split(' ');
    const currentWord = words[currentWordIndex] || '';
    
    // Check if user completed a word (pressed space)
    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      
      // Check for errors in the completed word
      if (typedWord !== currentWord) {
        setErrors(prev => prev + 1);
      }
      
      // Move to next word
      setWordsCompleted(prev => prev + 1);
      setCurrentWordIndex(prev => prev + 1);
      setCurrentCharIndex(0);
      setUserInput('');
      
      // Check if all words are completed
      if (wordsCompleted + 1 >= preferences.words) {
        finishTest();
        return;
      }
    } else {
      // Update character index for current word
      setCurrentCharIndex(value.length);
      
      // Check for character-level errors
      const currentChar = currentWord[value.length - 1];
      const typedChar = value[value.length - 1];
      
      if (typedChar && currentChar && typedChar !== currentChar) {
        setErrors(prev => prev + 1);
      }
    }
  };

  // Reset test when preferences change
  useEffect(() => {
    initializeTest();
  }, [preferences, initializeTest]);

  // Initialize on component mount
  useEffect(() => {
    initializeTest();
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [initializeTest]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 pt-28">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#00d9b7] mb-2">
            Typing Speed Test
          </h1>
          <p className="text-gray-400 text-lg">
            Test your typing speed and accuracy
          </p>
        </div>

        {/* Preference Panel */}
        <Panel
          preferences={preferences}
          onPreferenceChange={handlePreferenceChange}
          onReset={initializeTest}
          onTryAgain={initializeTest}
          isActive={isActive}
          isFinished={isFinished}
        />

        {/* Type Area */}
        <TypeArea
          currentText={currentText}
          userInput={userInput}
          currentWordIndex={currentWordIndex}
          currentCharIndex={currentCharIndex}
          isFinished={isFinished}
          isActive={isActive}
          onInputChange={handleInputChange}
          onStart={startTest}
        />

        {/* Stats Board */}
        <Board
          preferences={preferences}
          timeLeft={timeLeft}
          wordsCompleted={wordsCompleted}
          errors={errors}
          totalChars={totalChars}
          isActive={isActive}
          isFinished={isFinished}
          startTime={startTimeRef.current}
        />
      </div>
    </div>
  );
};

export default TypingTest;