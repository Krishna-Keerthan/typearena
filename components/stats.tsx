"use client";
import React from 'react';
import { XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Target, Clock, TrendingUp, BarChart3, Zap, Award, RotateCcw, RefreshCw } from 'lucide-react';

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

interface DetailedStatsProps {
  userStats: UserStats;
  sessionData?: SessionData | null;
  onTryAgain: () => void;
  onReset: () => void;
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  unit: string;
  colorClass?: string;
}

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: boolean;
}

const DetailedStats: React.FC<DetailedStatsProps> = ({ 
  userStats, 
  sessionData = null,
  onTryAgain,
  onReset
}) => {
  // Generate performance chart data
  const generatePerformanceData = (sessionData: SessionData | null): PerformanceDataPoint[] => {
    if (sessionData && sessionData.wpmHistory && sessionData.wpmHistory.length > 0) {
      return sessionData.wpmHistory.map((wpm: number, index: number) => ({
        time: index + 1,
        wpm: wpm,
        accuracy: sessionData.accuracyHistory?.[index] || 100
      }));
    }

    // Generate sample data based on user stats
    const dataPoints = Math.max(10, Math.floor(userStats.time / 3));
    const targetWpm = userStats.wpm;
    const data: PerformanceDataPoint[] = [];
    
    for (let i = 0; i < dataPoints; i++) {
      const progress = i / (dataPoints - 1);
      let wpmMultiplier: number;
      
      if (progress < 0.1) {
        wpmMultiplier = 0.3 + progress * 2;
      } else if (progress < 0.6) {
        wpmMultiplier = 0.5 + (progress - 0.1) * 1.0;
      } else {
        wpmMultiplier = 1.0 + (progress - 0.6) * 0.1;
      }
      
      const currentWpm = Math.max(15, targetWpm * wpmMultiplier + (Math.random() - 0.5) * 8);
      const currentAccuracy = Math.max(85, userStats.accuracy - (Math.random() * 10) + (progress * 5));
      
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

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, unit, colorClass = "text-[#00d9b7]" }) => (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <span className="text-gray-400 text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className={`text-sm ${colorClass}`}>{unit}</span>
      </div>
    </div>
  );

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon: Icon, trend = false }) => (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-xs uppercase tracking-wide">{title}</span>
        </div>
        {trend && (
          <TrendingUp className="w-4 h-4 text-[#00d9b7]" />
        )}
      </div>
      <div className="text-xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
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

  const getPerformanceLevel = () => {
    const { wpm, accuracy } = userStats;
    if (accuracy >= 95 && wpm >= 40) return { level: "Expert", color: "text-purple-400" };
    if (accuracy >= 90 && wpm >= 30) return { level: "Advanced", color: "text-green-400" };
    if (accuracy >= 80 && wpm >= 20) return { level: "Good", color: "text-blue-400" };
    return { level: "Beginner", color: "text-yellow-400" };
  };

  const netWpm = Math.max(0, Math.round(userStats.wpm - (userStats.incorrectChars / (userStats.time / 60))));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 rounded-full border border-gray-700 mb-4">
          <Award className="w-6 h-6 text-[#00d9b7]" />
          <span className={`text-xl font-bold ${getPerformanceLevel().color}`}>
            {getPerformanceLevel().level}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Test Results</h2>
        <p className="text-gray-400">Your typing performance analysis</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Zap}
          label="WPM"
          value={userStats.wpm}
          unit=""
          colorClass="text-[#00d9b7]"
        />
        <StatCard
          icon={Target}
          label="ACCURACY"
          value={userStats.accuracy.toFixed(1)}
          unit="%"
          colorClass="text-green-400"
        />
        <StatCard
          icon={Clock}
          label="TIME"
          value={userStats.time}
          unit="s"
          colorClass="text-blue-400"
        />
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00d9b7]" />
            Performance Over Time
          </h3>
          <div className="text-right">
            <div className="text-sm text-gray-400">Average</div>
            <div className="font-bold text-[#00d9b7]">{avgWpm} WPM</div>
          </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d9b7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d9b7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="wpm"
                stroke="#00d9b7"
                strokeWidth={2}
                fill="url(#wpmGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Net WPM"
          value={netWpm}
          subtitle="After error penalty"
          icon={TrendingUp}
          trend={true}
        />
        <MetricCard
          title="Characters"
          value={userStats.charactersTyped}
          subtitle={`${userStats.correctChars} correct, ${userStats.incorrectChars} errors`}
          icon={BarChart3}
        />
        <MetricCard
          title="Words Completed"
          value={userStats.wordsCompleted}
          subtitle={`${Math.round((userStats.wordsCompleted / userStats.time) * 60)} WPM rate`}
          icon={Target}
        />
        <MetricCard
          title="Error Rate"
          value={`${((userStats.incorrectChars / userStats.charactersTyped) * 100).toFixed(1)}%`}
          subtitle={`${userStats.incorrectChars} mistakes`}
          icon={Target}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Summary */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Session Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Peak WPM</span>
              <span className="font-semibold text-white">{Math.max(...performanceData.map(d => d.wpm))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Lowest WPM</span>
              <span className="font-semibold text-white">{Math.min(...performanceData.map(d => d.wpm))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Keystrokes</span>
              <span className="font-semibold text-white">{userStats.charactersTyped + userStats.incorrectChars}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Time per Word</span>
              <span className="font-semibold text-white">{(userStats.time / userStats.wordsCompleted).toFixed(1)}s</span>
            </div>
          </div>
        </div>

        {/* Performance Grade */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#00d9b7]" />
            Performance Grade
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#00d9b7] mb-2">
              {getPerformanceGrade(userStats.wpm)}
            </div>
            <div className="text-gray-400 mb-4">
              {getPerformanceLabel(userStats.wpm)}
            </div>
            <div className="bg-gray-800 rounded-full h-2 mb-2">
              <div 
                className="bg-[#00d9b7] h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (userStats.wpm / 80) * 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {userStats.wpm < 80 ? `${80 - userStats.wpm} WPM to next level` : 'Maximum level reached!'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-6">
        <button 
          onClick={onTryAgain}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00d9b7] to-[#00c4a7] text-black rounded-lg hover:from-[#00c4a7] hover:to-[#00b399] transition-all duration-200 font-semibold transform hover:scale-105 shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-semibold border border-gray-600 hover:border-gray-500"
        >
          <RotateCcw className="w-4 h-4" />
          New Test
        </button>
      </div>
    </div>
  );
};

export default DetailedStats;