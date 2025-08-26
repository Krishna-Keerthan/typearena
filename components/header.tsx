"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Keyboard, Users, Trophy, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const navigationItems = [
    { name: "Type", href: "/", icon: <Keyboard /> },
    { name: "Multiplayer", href: "/multiplayer", icon: <Users /> },
    { name: "Leaderboard", href: "/leaderboard", icon: <Trophy /> },
    { name: "Profile", href: "/profile", icon: <User /> },
  ];

  return (
    <header className="w-full py-4 px-6">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-[var(--primary)]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[var(--text)]">
            TypeFast
          </span>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? "opacity-100 text-[var(--primary)]"
                  : "opacity-60 hover:opacity-80 text-[var(--textMuted)]"
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
