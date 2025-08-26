import React, { useState } from 'react';
import { Zap, Keyboard, Users, Trophy, User } from 'lucide-react';
export default function header() {
  const [activeTab, setActiveTab] = useState('Type');

  const navigationItems = [
    { name: 'Type', icon: <Keyboard/>, active: true },
    { name: 'Multiplayer', icon: <Users/>, active: false },
    { name: 'Leaderboard', icon: <Trophy/>, active: false },
    { name: 'Profile', icon: <User/>, active: false }
  ];

  return (
   <div>
         {/* Header Navigation */}
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

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.name 
                    ? 'opacity-100 text-[var(--primary)]' 
                    : 'opacity-60 hover:opacity-80 text-[var(--textMuted)]'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>
 </div>
  )
}
