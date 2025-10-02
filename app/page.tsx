import React from 'react';
import { Zap, Users, BarChart3, Settings, Minimize2 } from 'lucide-react';
import { Highlighter } from "@/components/ui/highlighter";
import Footer from '@/components/footer';
import Link from 'next/link';

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

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-background pt-20">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-[var(--text)] px-2">
            Master Your Typing Skills
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>with{' '}
            <Highlighter action="underline" color="#00d9b7">
              TypeFast
            </Highlighter>
          </h1>

          <p className="text-sm sm:text-base md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed text-[var(--textMuted)] px-4">
            Practice typing, challenge friends, and track improvements with
            real-time stats in a sleek, minimalist interface
          </p>

          <Link href={'/auth'}>
            <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg bg-[var(--primary)] hover:bg-[var(--primaryHover)] text-white">
              Start Typing Now →
            </button>
          </Link>
        </div>

        {/* Why Choose TypeFast Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-[var(--text)] px-4">
            Why Choose{' '}
            <span className="text-[var(--primary)]">TypeFast</span>?
          </h2>

          {/* First row - 3 vertical cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 px-2">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 rounded-xl border border-[var(--textDark)]/20 transition-all duration-300 hover:scale-105 hover:shadow-xl text-center bg-card"
              >
                <div className="mb-3 sm:mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2 text-[var(--text)]">
                  {feature.title}
                </h3>
                <h4 className="text-sm sm:text-base font-medium mb-2 sm:mb-3 text-[var(--textMuted)]">
                  {feature.subtitle}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--textDark)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Second row - 2 vertical cards centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto px-2">
            {features.slice(3, 5).map((feature, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 rounded-xl border border-[var(--textDark)]/20 transition-all duration-300 hover:scale-105 hover:shadow-xl text-center bg-card"
              >
                <div className="mb-3 sm:mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2 text-[var(--text)]">
                  {feature.title}
                </h3>
                <h4 className="text-sm sm:text-base font-medium mb-2 sm:mb-3 text-[var(--textMuted)]">
                  {feature.subtitle}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--textDark)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Preview */}
        <div className="text-center px-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
            <div className="p-4 sm:p-6 rounded-xl bg-card">
              <div className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--primary)]">
                50K+
              </div>
              <div className="text-sm sm:text-base text-[var(--textMuted)]">
                Active Typists
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl bg-card">
              <div className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--secondary)]">
                1M+
              </div>
              <div className="text-sm sm:text-base text-[var(--textMuted)]">
                Tests Completed
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl bg-card">
              <div className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--accent)]">
                120 WPM
              </div>
              <div className="text-sm sm:text-base text-[var(--textMuted)]">
                Average Speed
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>

  );
}