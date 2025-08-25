"use client";
import React, { useState } from 'react';
import { Zap, Users, BarChart3, Settings, Minimize2, Trophy, User } from 'lucide-react';

export default function TypeFast() {
  const [activeTab, setActiveTab] = useState('Type');

  const navigationItems = [
    { name: 'Type', icon: '⌨️', active: true },
    { name: 'Multiplayer', icon: <Users/>, active: false },
    { name: 'Leaderboard', icon: <Trophy/>, active: false },
    { name: 'Profile', icon: <User/>, active: false }
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-[var(--primary)]" />,
      title: 'Real-time',
      subtitle: 'Feedback',
      description: 'Get instant feedback on your typing speed and accuracy'
    },
    {
      icon: <Users className="w-8 h-8 text-[var(--secondary)]" />,
      title: 'Challenge',
      subtitle: 'Friends',
      description: 'Compete with friends in real-time typing races'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-[var(--accent)]" />,
      title: 'Detailed',
      subtitle: 'Statistics',
      description: 'Track progress over time with comprehensive stats'
    },
    {
      icon: <Settings className="w-8 h-8 text-[var(--primary)]" />,
      title: 'Customizable',
      subtitle: 'Options',
      description: 'Personalize your typing experience with various settings'
    },
    {
      icon: <Minimize2 className="w-8 h-8 text-[var(--secondary)]" />,
      title: 'Minimalist',
      subtitle: 'Interface',
      description: 'Clean, distraction-free design for focused practice'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-background">
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-[var(--text)]">
            Master Your Typing Skills
            <br />
            with{' '}
            <span className="relative text-[var(--primary)]">
              TypeFast
            </span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-[var(--textMuted)]">
            Practice typing, challenge friends, and track improvements with 
            real-time stats in a sleek, minimalist interface
          </p>

          <button className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg bg-[var(--primary)] hover:bg-[var(--primaryHover)] text-white">
            Start Typing Now →
          </button>
        </div>

        {/* Why Choose TypeFast Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--text)]">
            Why Choose{' '}
            <span className="text-[var(--primary)]">TypeFast</span>?
          </h2>

          {/* First row - 3 vertical cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-[var(--textDark)]/20 transition-all duration-300 hover:scale-105 hover:shadow-xl text-center bg-card"
              >
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-[var(--text)]">
                  {feature.title}
                </h3>
                <h4 className="text-base font-medium mb-3 text-[var(--textMuted)]">
                  {feature.subtitle}
                </h4>
                <p className="text-sm leading-relaxed text-[var(--textDark)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Second row - 2 vertical cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {features.slice(3, 5).map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-[var(--textDark)]/20 transition-all duration-300 hover:scale-105 hover:shadow-xl text-center bg-card"
              >
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-[var(--text)]">
                  {feature.title}
                </h3>
                <h4 className="text-base font-medium mb-3 text-[var(--textMuted)]">
                  {feature.subtitle}
                </h4>
                <p className="text-sm leading-relaxed text-[var(--textDark)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Preview */}
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-card">
              <div className="text-3xl font-bold mb-2 text-[var(--primary)]">
                50K+
              </div>
              <div className="text-[var(--textMuted)]">
                Active Typists
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-card">
              <div className="text-3xl font-bold mb-2 text-[var(--secondary)]">
                1M+
              </div>
              <div className="text-[var(--textMuted)]">
                Tests Completed
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-card">
              <div className="text-3xl font-bold mb-2 text-[var(--accent)]">
                120 WPM
              </div>
              <div className="text-[var(--textMuted)]">
                Average Speed
              </div>
            </div>
          </div>
        </div>
      </main>


      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Geist Mono', monospace;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}