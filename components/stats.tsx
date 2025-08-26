"use client";
import React from 'react';
import {XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Target, Clock, TrendingUp, BarChart3, Zap, Award, Users, LucideIcon } from 'lucide-react';

// TypeScript interfaces
interface UserStats {
  wpm: number;
  accuracy: number;
  time: number;
  charactersTyped: number;
  correctChars: number;
  incorrectChars: number;
  wordsCompleted: number;
  consistencyScore: number;
  rank?: number;
  totalPlayers?: number;
}

interface SessionData {
  wpmHistory?: number[];
  accuracyHistory?: number[];
}

interface PerformanceDataPoint {
  time: number;
  wpm: number;
  accuracy: number;
}

interface TypingStatsPageProps {
  userStats?: UserStats | null;
  isMultiplayer?: boolean;
  sessionData?: SessionData | null;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  unit: string;
  colorClass?: string;
}

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: boolean;
}

const TypingStatsPage: React.FC<TypingStatsPageProps> = ({ 
  userStats = null, 
  isMultiplayer = false,
  sessionData = null 
}) => {
  // Default stats structure for demonstration
  const defaultStats: UserStats = {
    wpm: 47,
    accuracy: 100.00,
    time: 41,
    charactersTyped: 235,
    correctChars: 235,
    incorrectChars: 0,
    wordsCompleted: 47,
    consistencyScore: 85,
    rank: 1,
    totalPlayers: 1
  };

  // Use provided stats or defaults
  const stats: UserStats = userStats || defaultStats;

  // Generate performance chart data
  const generatePerformanceData = (sessionData: SessionData | null): PerformanceDataPoint[] => {
    if (sessionData && sessionData.wpmHistory) {
      return sessionData.wpmHistory.map((wpm: number, index: number) => ({
        time: index + 1,
        wpm: wpm,
        accuracy: sessionData.accuracyHistory?.[index] || 100
      }));
    }

    // Generate realistic sample data that shows improvement curve
    const dataPoints = Math.max(20, Math.floor(stats.time / 2));
    const targetWpm = stats.wpm;
    const data: PerformanceDataPoint[] = [];
    
    for (let i = 0; i < dataPoints; i++) {
      const progress = i / (dataPoints - 1);
      // Create realistic typing curve - slow start, rapid improvement, then plateau
      let wpmMultiplier: number;
      if (progress < 0.1) {
        wpmMultiplier = 0.3 + progress * 2; // Slow start
      } else if (progress < 0.6) {
        wpmMultiplier = 0.5 + (progress - 0.1) * 1.0; // Rapid improvement
      } else {
        wpmMultiplier = 1.0 + (progress - 0.6) * 0.1; // Plateau with slight improvement
      }
      
      const currentWpm = Math.max(15, targetWpm * wpmMultiplier + (Math.random() - 0.5) * 8);
      const currentAccuracy = Math.max(85, stats.accuracy - (Math.random() * 10) + (progress * 5));
      
      data.push({
        time: i + 1,
        wpm: Math.round(currentWpm),
        accuracy: Math.round(currentAccuracy * 10) / 10
      });
    }
    
    return data;
  };

  const performanceData: PerformanceDataPoint[] = generatePerformanceData(sessionData);
  const avgWpm: number = Math.round(performanceData.reduce((sum, point) => sum + point.wpm, 0) / performanceData.length);

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, unit, colorClass = "text-[var(--primary)]" }) => (
    <div className="bg-[var(--cardBackground)] rounded-lg p-4 border border-[var(--textDark)]">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <span className="text-[var(--textMuted)] text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-[var(--text)]">{value}</span>
        <span className={`text-sm ${colorClass}`}>{unit}</span>
      </div>
    </div>
  );

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon: Icon, trend = false }) => (
    <div className="bg-[var(--cardBackground)] rounded-lg p-4 border border-[var(--textDark)] hover:border-[var(--textMuted)] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[var(--textMuted)]" />
          <span className="text-[var(--textMuted)] text-xs uppercase tracking-wide">{title}</span>
        </div>
        {trend && (
          <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
        )}
      </div>
      <div className="text-xl font-bold text-[var(--text)] mb-1">{value}</div>
      {subtitle && <div className="text-xs text-[var(--textDark)]">{subtitle}</div>}
    </div>
  );

  const getPerformanceGrade = (wpm: number): string => {
    if (wpm >= 60) return 'A+';
    if (wpm >= 45) return 'A';
    if (wpm >= 35) return 'B+';
    if (wpm >= 25) return 'B';
    return 'C';
  };

  const getPerformanceLabel = (wpm: number): string => {
    if (wpm >= 60) return 'Excellent';
    if (wpm >= 45) return 'Great';
    if (wpm >= 35) return 'Good';
    if (wpm >= 25) return 'Average';
    return 'Needs Practice';
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] p-6 font-['Geist_Mono']">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[var(--text)]">Performance Analysis</h1>
          {isMultiplayer && stats.rank && stats.totalPlayers && (
            <div className="flex items-center gap-2 text-[var(--textMuted)]">
              <Users className="w-4 h-4" />
              <span>Multiplayer Session • Rank {stats.rank} of {stats.totalPlayers}</span>
            </div>
          )}
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Zap}
            label="WPM"
            value={stats.wpm}
            unit=""
            colorClass="text-[var(--primary)]"
          />
          <StatCard
            icon={Target}
            label="ACCURACY"
            value={stats.accuracy.toFixed(2)}
            unit="%"
            colorClass="text-[var(--secondary)]"
          />
          <StatCard
            icon={Clock}
            label="TIME"
            value={stats.time}
            unit="s"
            colorClass="text-[var(--accent)]"
          />
        </div>

        {/* Performance Chart */}
        <div className="bg-[var(--cardBackground)] rounded-lg p-6 border border-[var(--textDark)] mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--primary)]" />
              Performance Analysis
            </h2>
            <div className="text-right">
              <div className="text-sm text-[var(--textMuted)]">Average</div>
              <div className="font-bold text-[var(--primary)]">{avgWpm} WPM</div>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--textMuted)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--textMuted)', fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="wpm"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#wpmGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="bg-[var(--background)] px-4 py-2 rounded-lg">
              <div className="text-xs text-[var(--textMuted)] mb-1">AVERAGE WPM</div>
              <div className="font-bold text-[var(--text)]">{avgWpm}</div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Characters"
            value={stats.charactersTyped}
            subtitle={`${stats.correctChars} correct, ${stats.incorrectChars} errors`}
            icon={BarChart3}
          />
          <MetricCard
            title="Words Completed"
            value={stats.wordsCompleted}
            subtitle={`${Math.round((stats.wordsCompleted / stats.time) * 60)} WPM`}
            icon={Target}
            trend={true}
          />
          <MetricCard
            title="Consistency"
            value={`${stats.consistencyScore}%`}
            subtitle="Typing rhythm"
            icon={Activity}
          />
          <MetricCard
            title="Error Rate"
            value={`${((stats.incorrectChars / stats.charactersTyped) * 100).toFixed(1)}%`}
            subtitle={`${stats.incorrectChars} mistakes`}
            icon={Target}
          />
        </div>

        {/* Achievement/Rank Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Summary */}
          <div className="bg-[var(--cardBackground)] rounded-lg p-6 border border-[var(--textDark)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--accent)]" />
              Session Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[var(--textMuted)]">Peak WPM</span>
                <span className="font-semibold text-[var(--text)]">{Math.max(...performanceData.map((d: PerformanceDataPoint) => d.wpm))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--textMuted)]">Lowest WPM</span>
                <span className="font-semibold text-[var(--text)]">{Math.min(...performanceData.map((d: PerformanceDataPoint) => d.wpm))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--textMuted)]">Total Keystrokes</span>
                <span className="font-semibold text-[var(--text)]">{stats.charactersTyped + stats.incorrectChars}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--textMuted)]">Time per Word</span>
                <span className="font-semibold text-[var(--text)]">{(stats.time / stats.wordsCompleted).toFixed(1)}s</span>
              </div>
            </div>
          </div>

          {/* Performance Grade */}
          <div className="bg-[var(--cardBackground)] rounded-lg p-6 border border-[var(--textDark)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--primary)]" />
              Performance Grade
            </h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-[var(--primary)] mb-2">
                {getPerformanceGrade(stats.wpm)}
              </div>
              <div className="text-[var(--textMuted)] mb-4">
                {getPerformanceLabel(stats.wpm)}
              </div>
              <div className="bg-[var(--background)] rounded-full h-2 mb-2">
                <div 
                  className="bg-[var(--primary)] h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (stats.wpm / 80) * 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-[var(--textDark)]">
                {stats.wpm < 80 ? `${80 - stats.wpm} WPM to next level` : 'Maximum level reached!'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <button className="bg-[var(--primary)] hover:bg-[var(--primaryHover)] text-[var(--background)] px-6 py-3 rounded-lg font-semibold transition-colors">
            Try Again
          </button>
          <button className="bg-[var(--cardBackground)] hover:bg-[var(--textDark)] text-[var(--text)] px-6 py-3 rounded-lg font-semibold transition-colors">
            View Leaderboard
          </button>
          <button className="border border-[var(--textDark)] hover:border-[var(--textMuted)] text-[var(--text)] px-6 py-3 rounded-lg font-semibold transition-colors">
            Share Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypingStatsPage;