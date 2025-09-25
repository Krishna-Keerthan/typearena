'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoom } from '@/context/roomContext';
import TypeArea from '@/components/type-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function clamp(n: number, min = 0, max = 100) { return Math.max(min, Math.min(max, n)); }

const Race: React.FC = () => {
  const { raceText, progressByUser, finishedAtByUser, sendProgress, isStartRace } = useRoom();
  const [userInput, setUserInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const words = useMemo(() => (raceText ? raceText.split(' ') : []), [raceText]);

  useEffect(() => {
    // Reset when a new race starts
    setUserInput('');
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setIsActive(false);
    setIsFinished(false);
  }, [raceText, isStartRace]);

  const onStart = useCallback(() => {
    setIsActive(true);
  }, []);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    const currentWord = words[currentWordIndex] ?? '';

    // If user typed a space, check the word
    if (value.endsWith(' ')) {
      const typed = value.trimEnd();
      const correct = typed === currentWord;

      if (correct) {
        const nextIndex = currentWordIndex + 1;
        setCurrentWordIndex(nextIndex);
        setUserInput('');
        setCurrentCharIndex(0);

        const progress = clamp(Math.round(((nextIndex) / Math.max(words.length, 1)) * 100));
        sendProgress(progress);

        if (nextIndex >= words.length) {
          setIsFinished(true);
        }
      }
    } else {
      // Update char progress for current word
      const idx = value.length;
      setCurrentCharIndex(idx);
      const fraction = (currentWordIndex + Math.min(idx, currentWord.length) / Math.max(currentWord.length, 1)) / Math.max(words.length, 1);
      const progress = clamp(Math.round(fraction * 100));
      sendProgress(progress);
    }
  }, [words, currentWordIndex, sendProgress]);

  const sortedProgress = useMemo(() => {
    return Object.entries(progressByUser)
      .map(([username, p]) => ({ username, progress: clamp(p), finishedAt: finishedAtByUser[username] ?? null }))
      .sort((a, b) => {
        if (a.progress === b.progress && a.progress === 100) {
          // Earlier finish time ranks higher
          if (a.finishedAt && b.finishedAt) return a.finishedAt - b.finishedAt;
          if (a.finishedAt) return -1;
          if (b.finishedAt) return 1;
        }
        return b.progress - a.progress;
      });
  }, [progressByUser, finishedAtByUser]);

  if (!raceText) {
    return null;
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Progress leaderboard */}
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-white font-medium mb-3">Live Progress</h3>
        <div className="space-y-3">
          {sortedProgress.map(({ username, progress }) => {
            const letter = (username?.charAt(0) || '?').toUpperCase()
            const colors = [
              'bg-rose-600','bg-pink-600','bg-fuchsia-600','bg-purple-600','bg-violet-600',
              'bg-indigo-600','bg-blue-600','bg-sky-600','bg-cyan-600','bg-teal-600',
              'bg-emerald-600','bg-green-600','bg-lime-600','bg-yellow-600','bg-amber-600',
              'bg-orange-600','bg-red-600','bg-stone-600','bg-zinc-600','bg-slate-600'
            ]
            let hash = 0
            for (let i = 0; i < username.length; i++) hash = (hash * 31 + username.charCodeAt(i)) >>> 0
            const color = colors[hash % colors.length]
            return (
              <div key={username} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className={`${color} text-white text-[10px] font-semibold`}>{letter}</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-300 text-sm">{username}</span>
                  </div>
                  <span className="text-gray-300 text-sm">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded">
                  <div
                    className="h-2 bg-purple-600 rounded"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )
          })}
          {sortedProgress.length === 0 && (
            <div className="text-gray-500 text-sm">Waiting for participants...</div>
          )}
        </div>
      </div>

      {/* Typing area */}
      <div className="bg-gray-900 rounded-lg p-4">
        <TypeArea
          currentText={raceText}
          userInput={userInput}
          currentWordIndex={currentWordIndex}
          currentCharIndex={currentCharIndex}
          isFinished={isFinished}
          isActive={isActive}
          onInputChange={onInputChange}
          onStart={onStart}
        />
      </div>
    </div>
  );
};

export default Race;


