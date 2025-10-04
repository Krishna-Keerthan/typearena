import { Suspense } from "react";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";

const PAGE_SIZE = 10;

function LoadingFallback() {
  return (
    <div className="bg-[#1a1f2e] rounded-xl shadow-xl overflow-hidden border border-[#4fd1c7]/10 animate-pulse">
    {/* Table Header */}
    <div className="bg-[#0f1419] px-4 sm:px-6 py-3 sm:py-4 border-b border-[#4fd1c7]/20">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 font-semibold text-[#00d9b7] text-xs sm:text-sm uppercase tracking-wide">
        <div>Rank</div>
        <div>Name</div>
        <div className="hidden md:block">WPM</div>
        <div className="hidden md:block">Points</div>
        <div className="hidden md:block">Date</div>
      </div>
    </div>

    {/* Table Rows Skeleton */}
    <div className="divide-y divide-[#4fd1c7]/10">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={`px-4 sm:px-6 py-3 sm:py-4 ${
            i % 2 === 0 ? "bg-[#1a1f2e]" : "bg-[#0f1419]/50"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 items-center">
            {/* Rank */}
            <div className="flex items-center">
              <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#2a324b]" />
            </div>
            {/* Name */}
            <div className="flex items-center">
              <div className="h-4 sm:h-5 w-24 sm:w-36 bg-[#2a324b] rounded-md" />
            </div>
            {/* WPM */}
            <div className="hidden md:flex items-center">
              <div className="h-4 w-10 bg-[#2a324b] rounded-md" />
            </div>
            {/* Points */}
            <div className="hidden md:flex items-center">
              <div className="h-4 w-12 bg-[#2a324b] rounded-md" />
            </div>
            {/* Date */}
            <div className="hidden md:flex items-center">
              <div className="h-4 w-20 bg-[#2a324b] rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default async function Leaderboard({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const page = Math.max(1, Number((await searchParams)?.page) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 mt-16 sm:mt-20">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#e6f1ff] mb-2">Leaderboard</h2>
        <p className="text-sm sm:text-base text-[#8892b0]">Top performers ranked by WPM and points</p>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <LeaderboardTable page={page} skip={skip} />
      </Suspense>
    </div>
  );
}
