"use client";

export default function LeaderBox({ leaderboard }: any) {
  return (
    <div className="border p-2 rounded mt-4">
      <h2 className="font-bold">Leaderboard</h2>
      {leaderboard.map((p: any, i: number) => (
        <div key={p.id} className="flex justify-between">
          <span>{i + 1}. {p.username}</span>
          <span>{p.wpm} WPM</span>
          <span>{p.accuracy}%</span>
        </div>
      ))}
    </div>
  );
}
