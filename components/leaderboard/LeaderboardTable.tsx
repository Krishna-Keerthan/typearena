"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import type { LeaderboardEntry } from "@/types/room";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";

const displayDate = (date: string) => {
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

interface LeaderboardTableProps {
  initialEntries: LeaderboardEntry[];
  page: number;
  totalPages: number;
  live: boolean;
}

export default function LeaderboardTable({
  initialEntries,
  page,
  totalPages,
  live,
}: LeaderboardTableProps) {
  const [entries, setEntries] = useState(initialEntries);
  const { status } = useSession();

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  useEffect(() => {
    if (!live || status !== "authenticated") return;

    let cancelled = false;
    let socket: Socket | null = null;

    const connect = async () => {
      try {
        socket = io(SOCKET_URL, {
          auth: (callback) => {
            fetch("/api/socket-token", { cache: "no-store" })
              .then((response) => (response.ok ? response.json() : null))
              .then((data: { token?: string } | null) => {
                callback(data?.token ? { token: data.token } : {});
              })
              .catch(() => callback({}));
          },
        });

        socket.on("connect", () => {
          socket?.timeout(5000).emit(
            "watch_leaderboard",
            (
              error: Error | null,
              response?: { ok: boolean; entries?: LeaderboardEntry[] }
            ) => {
              if (cancelled || error) return;
              if (response?.ok && Array.isArray(response.entries)) {
                setEntries(response.entries);
              }
            }
          );
        });

        socket.on(
          "leaderboard_updated",
          (payload: { entries?: LeaderboardEntry[] }) => {
            if (cancelled) return;
            if (Array.isArray(payload?.entries)) {
              setEntries(payload.entries);
            }
          }
        );

        socket.on("connect_error", (error) => {
          if (error.message === "Unauthorized") {
            socket?.disconnect();
          }
        });
      } catch {
        // The server-rendered leaderboard remains usable without live updates.
      }
    };

    void connect();

    return () => {
      cancelled = true;
      if (socket) {
        socket.emit("unwatch_leaderboard");
        socket.disconnect();
        socket = null;
      }
    };
  }, [live, status]);

  return (
    <>
      <div className="bg-[#1a1f2e] rounded-xl shadow-xl overflow-x-scroll md:overflow-hidden border border-[#4fd1c7]/10">
        <div className="overflow-x-auto min-w-[600px]">
          <table className="min-w-full text-left text-sm text-[#e6f1ff]">
            <thead className="bg-[#0f1419] text-[#00d9b7] uppercase text-xs sm:text-sm">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-semibold">Rank</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Username</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">WPM</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Points</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4fd1c7]/10">
              {entries.map((entry, index) => {
                const rank = page === 1 ? entry.rank : (page - 1) * 10 + index + 1;
                return (
                  <tr
                    key={entry.userId}
                    className={index % 2 === 0 ? "bg-[#1a1f2e]" : "bg-[#0f1419]/50"}
                  >
                    <td className="px-4 sm:px-6 py-3">
                      <span className={`inline-flex items-center justify-center w-7 sm:w-8 h-7 sm:h-8 rounded-full text-xs sm:text-sm font-bold ${getRankBadge(rank)}`}>
                        {rank}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className="font-medium truncate text-sm sm:text-base">
                        {entry.name}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className="text-[#4fd1c7] font-semibold">{entry.wpm}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className="text-[#e6f1ff] font-semibold">{entry.points}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className="text-[#e6f1ff] font-semibold">
                        {displayDate(entry.updatedAt)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-[#8892b0]">
                    No leaderboard entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center py-6">
        <Pagination>
          <PaginationContent className="flex gap-4">
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${page - 1}`}
                className={`bg-secondary text-[#ffffff] ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
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
                      ? "border-[#4fd1c7] text-[#00d9b7] bg-[#1a1f2e]"
                      : "text-[#8892b0] bg-[#1a1f2e]"
                  }
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`?page=${page + 1}`}
                className={`bg-secondary text-[#ffffff] ${page === totalPages ? "pointer-events-none opacity-50" : ""}`}
                aria-disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
