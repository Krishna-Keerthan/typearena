"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Keyboard, Users, Trophy, User, LogOutIcon, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const {data:session} = useSession();
  const user = session?.user;

  const pathname = usePathname();

  console.log(user)

  const navigationItems = [
    { name: "Type", href: "/type", icon: <Keyboard /> },
    { name: "Multiplayer", href: "/multiplayer", icon: <Users /> },
    { name: "Leaderboard", href: "/leaderboard", icon: <Trophy /> },
    { name: "Profile", href: "/profile", icon: <User /> },
  ];

  return (
    <header className="sticky top-0 bg-background z-50 w-full py-4 px-6">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-[var(--primary)]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <Link href="/">
          <span className="text-xl font-bold text-[var(--text)]">
            TypeFast
          </span>
          </Link>
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
          
         {user ? (
            <Button
              className="cursor-pointer bg-red-400 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors"
              onClick={() => signOut()}
              variant="destructive"
              size="sm"
            >
              <LogOutIcon className="w-5 h-5 mr-1 text-gray-100" />
              Logout
            </Button>
          ) : (
            <Link href="/auth">
              <Button className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg bg-[var(--primary)] hover:bg-[var(--primaryHover)] text-white" size="sm">
                <LogIn className="w-5 h-5 mr-1 text-white" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
