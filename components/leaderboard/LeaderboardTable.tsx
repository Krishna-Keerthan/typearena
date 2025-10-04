import prisma from "@/lib/prisma";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { redirect } from "next/navigation";

const PAGE_SIZE = 10;

const displayDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};



const getRankBadge = (rank: number): string => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900";
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900";
    case 3:
      return "bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100";
    default:
      return "bg-[#1a1f2e] text-[#8892b0] border border-[#4fd1c7]/20";
  }
};

interface LeaderboardEntry {
  id: string;
  wpm: number;
  difficulty: string;
  points: number;
  user: {
    id: string;
    name: string | null;
    updatedAt: Date;
  };
}

export default async function LeaderboardTable({ page, skip }: { page: number; skip: number }) {
  const totalCount = await prisma.leaderBoard.count();
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  if (page > totalPages && totalPages > 0) redirect(`/leaderboard?page=${totalPages}`);

  const leaderboard: LeaderboardEntry[] = await prisma.leaderBoard.findMany({
    skip,
    take: PAGE_SIZE,
    orderBy: [{ points: "desc" }],
    include: { user: true },
  });

  return (
    <>
      <div className="bg-[#1a1f2e] rounded-xl shadow-xl overflow-hidden border border-[#4fd1c7]/10">
        <div className="overflow-x-auto min-w-[600px]">
          <table className="min-w-full text-left text-sm text-[#e6f1ff]">
            <thead className="bg-[#0f1419] text-[#00d9b7] uppercase text-xs sm:text-sm">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-semibold">Rank</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Name</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">WPM</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Points</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4fd1c7]/10">
              {leaderboard.map((user, index) => {
                const rank = skip + index + 1;
                return (
                  <tr
                    key={user.id}
                    className={index % 2 === 0 ? "bg-[#1a1f2e]" : "bg-[#0f1419]/50"}
                  >
                    <td className="px-4 sm:px-6 py-3">
                      <span className={`inline-flex items-center justify-center w-7 sm:w-8 h-7 sm:h-8 rounded-full text-xs sm:text-sm font-bold ${getRankBadge(rank)}`}>
                        {rank}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className="font-medium truncate text-sm sm:text-base">
                        {user.user.name}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className="text-[#4fd1c7] font-semibold">{user.wpm}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className="text-[#e6f1ff] font-semibold">{user.points}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className="text-[#e6f1ff] font-semibold">{displayDate(user.user.updatedAt)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="bg-[#0f1419] px-4 sm:px-6 py-3 sm:py-4 border-t border-[#4fd1c7]/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs sm:text-sm text-[#8892b0]">
            <span>Showing {leaderboard.length} users</span>
            <span>Updated just now</span>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-center  py-6">
        <Pagination>
          <PaginationContent className="flex gap-4">
            <PaginationItem>
              <PaginationPrevious 
                href={`?page=${page - 1}`}
                className={`bg-secondary text-[#ffffff] ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={page === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`?page=${i + 1}`}
                  isActive={page === i + 1}
                  className={
                    page === i + 1
                      ? 'border-[#4fd1c7] text-[#00d9b7] bg-[#1a1f2e]'
                      : 'text-[#8892b0] bg-[#1a1f2e]'
                  }
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href={`?page=${page + 1}`}
                className={`bg-secondary text-[#ffffff] ${page === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

