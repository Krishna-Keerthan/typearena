'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoom } from '@/context/roomContext';
import TypeArea from '@/components/type-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Medal } from "lucide-react";
import { Confetti,ConfettiRef } from "@/components/ui/confetti";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { updateLeaderboard } from "@/actions/leaderboards";
import { Difficulty } from "@/types/leaderboard";


function clamp(n: number, min = 0, max = 100) { return Math.max(min, Math.min(max, n)); }

const Race: React.FC = () => {
  const {
    raceText,
    progressByUser,
    finishedAtByUser,
    sendProgress,
    isStartRace,
    participants,
    currentRoom,
  } = useRoom();
  const { data: session } = useSession();
  const [userInput, setUserInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const words = useMemo(() => (raceText ? raceText.split(' ') : []), [raceText]);
  const confettiRef = useRef<ConfettiRef>(null);
  const startTimeRef = useRef(0);
  const errorsRef = useRef(0);
  const submittedRef = useRef(false);

  const nameByUserId = useMemo(() => {
    const lookup = new Map<string, string>();
    for (const participant of participants) {
      lookup.set(participant.id, participant.username);
    }
    return lookup;
  }, [participants]);

  useEffect(() => {
    // Reset when a new race starts
    setUserInput('');
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setIsActive(false);
    setIsFinished(false);
    startTimeRef.current = 0;
    errorsRef.current = 0;
    submittedRef.current = false;
  }, [raceText, isStartRace]);

  const submitRaceResult = useCallback(() => {
    if (submittedRef.current) return;

    const userId = session?.user?.id;
    if (!userId) return;

    submittedRef.current = true;

    const elapsedMinutes = Math.max(
      (Date.now() - startTimeRef.current) / 60000,
      0.01
    );
    const totalWords = Math.max(words.length, 1);
    const wpm = Math.max(0, Math.round(words.length / elapsedMinutes));
    const accuracy = Math.max(
      0,
      Math.min(100, 100 - Math.round((errorsRef.current / totalWords) * 100))
    );
    const wordCount = Number(
      (currentRoom?.mondeOption ?? '').match(/\d+/)?.[0] ?? 25
    );
    const difficulty =
      wordCount <= 10
        ? Difficulty.EASY
        : wordCount <= 25
          ? Difficulty.MEDIUM
          : Difficulty.HARD;

    updateLeaderboard({ userId, wpm, accuracy, difficulty }).catch(() => {
      // Keep the race result local if the leaderboard write fails.
    });
  }, [session?.user?.id, words.length, currentRoom?.mondeOption]);

  useEffect(() => {
    if (isFinished && confettiRef.current) {
      (confettiRef.current as ConfettiRef & { fire: () => void }).fire();
    }
  }, [isFinished]);

  const onStart = useCallback(() => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
    setIsActive(true);
  }, []);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

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
          submitRaceResult();
        }
      } else {
        errorsRef.current += 1;
      }
    } else {
      // Update char progress for current word
      const idx = value.length;
      setCurrentCharIndex(idx);
      const fraction = (currentWordIndex + Math.min(idx, currentWord.length) / Math.max(currentWord.length, 1)) / Math.max(words.length, 1);
      const progress = clamp(Math.round(fraction * 100));
      sendProgress(progress);
    }
  }, [words, currentWordIndex, sendProgress, submitRaceResult]);

  const sortedProgress = useMemo(() => {
    return Object.entries(progressByUser)
      .map(([userId, p]) => ({
        userId,
        username: nameByUserId.get(userId) ?? userId,
        progress: clamp(p),
        finishedAt: finishedAtByUser[userId] ?? null,
      }))
      .sort((a, b) => {
        if (a.progress === b.progress && a.progress === 100) {
          // Earlier finish time ranks higher
          if (a.finishedAt && b.finishedAt) return a.finishedAt - b.finishedAt;
          if (a.finishedAt) return -1;
          if (b.finishedAt) return 1;
        }
        return b.progress - a.progress;
      });
  }, [progressByUser, finishedAtByUser, nameByUserId]);

  if (!raceText) {
    return null;
  }

  return (
    <div className="flex flex-row-reverse  flex-wrap sm:flex-nowrap gap-4 space-y-6">
      <Confetti ref={confettiRef} manualstart style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 50 }} />
      {/* Progress leaderboard */}
      <div className="bg-gray-900 rounded-lg p-4 w-full sm:w-[500px]">
        <h3 className="text-white font-medium mb-3">Live Progress</h3>
        <div className="space-y-3">

{sortedProgress.map(({ userId, username, progress }, index) => {
  const letter = (username?.charAt(0) || '?').toUpperCase();
  const colors = [
    'bg-rose-600','bg-pink-600','bg-fuchsia-600','bg-purple-600','bg-violet-600',
    'bg-indigo-600','bg-blue-600','bg-sky-600','bg-cyan-600','bg-teal-600',
    'bg-emerald-600','bg-green-600','bg-lime-600','bg-yellow-600','bg-amber-600',
    'bg-orange-600','bg-red-600','bg-stone-600','bg-zinc-600','bg-slate-600'
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash * 31 + username.charCodeAt(i)) >>> 0;
  }
  const color = colors[hash % colors.length];

  // Badge styling for top 3
  const badgeStyles = [
    "bg-yellow-400 text-yellow-900",  // 🥇 Gold
    "bg-gray-300 text-gray-800",      // 🥈 Silver
    "bg-amber-700 text-white",        // 🥉 Bronze
  ];

  return (
    <div key={userId} className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarFallback className={`${color} text-white text-[10px] font-semibold`}>
              {letter}
            </AvatarFallback>
          </Avatar>
          <span className="text-gray-300 text-sm flex items-center gap-2">
            {username}
            {index < 3 && (
              <span
                className={`flex items-center justify-center rounded-full w-5 h-5 ${badgeStyles[index]}`}
              >
                <Medal size={14} strokeWidth={2.5} />
              </span>
            )}
          </span>
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
  );
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


