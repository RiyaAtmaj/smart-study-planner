import React, { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Award, Target } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  points: number;
}

interface GamificationData {
  points: number;
  streak: number;
  lastStudyDate: string;
  achievements: Achievement[];
}

const GamificationPage: React.FC = () => {
  const [data, setData] = useState<GamificationData>({
    points: 0,
    streak: 0,
    lastStudyDate: '',
    achievements: [
      {
        id: 'first-study',
        title: 'First Steps',
        description: 'Complete your first study session',
        icon: <Star size={24} />,
        unlocked: false,
        progress: 0,
        maxProgress: 1,
        points: 10
      },
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Study for 7 consecutive days',
        icon: <Flame size={24} />,
        unlocked: false,
        progress: 0,
        maxProgress: 7,
        points: 50
      },
      {
        id: 'note-master',
        title: 'Note Master',
        description: 'Create 10 notes',
        icon: <Award size={24} />,
        unlocked: false,
        progress: 0,
        maxProgress: 10,
        points: 25
      },
      {
        id: 'group-leader',
        title: 'Group Leader',
        description: 'Create a study group',
        icon: <Target size={24} />,
        unlocked: false,
        progress: 0,
        maxProgress: 1,
        points: 30
      }
    ]
  });

  useEffect(() => {
    const saved = localStorage.getItem('studyai-gamification');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const updateProgress = (achievementId: string, increment: number = 1) => {
    setData(prev => {
      const updated = { ...prev };
      const achievement = updated.achievements.find(a => a.id === achievementId);
      if (achievement && !achievement.unlocked) {
        achievement.progress = Math.min(achievement.progress + increment, achievement.maxProgress);
        if (achievement.progress >= achievement.maxProgress) {
          achievement.unlocked = true;
          updated.points += achievement.points;
        }
      }
      localStorage.setItem('studyai-gamification', JSON.stringify(updated));
      return updated;
    });
  };

  const addPoints = (points: number) => {
    setData(prev => {
      const updated = { ...prev, points: prev.points + points };
      localStorage.setItem('studyai-gamification', JSON.stringify(updated));
      return updated;
    });
  };

  // Expose functions globally for other components to use
  React.useEffect(() => {
    (window as any).gamification = { updateProgress, addPoints };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-indigo-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-indigo-700">🎯 Study Achievements</h1>
              <p className="text-gray-600">Track your progress, unlock milestones, and level up your learning game.</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
              <div className="text-5xl font-black text-indigo-600">{data.points}</div>
              <div className="text-sm tracking-wide text-indigo-500">Points</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-5">
            <div className="border border-indigo-100 rounded-xl bg-white p-3 flex items-center gap-2 shadow-sm">
              <Flame className="text-orange-500" size={22} />
              <span className="font-semibold text-sm text-gray-700">{data.streak} Day Streak</span>
            </div>
            <div className="border border-indigo-100 rounded-xl bg-white p-3 flex items-center gap-2 shadow-sm">
              <Trophy className="text-yellow-500" size={22} />
              <span className="font-semibold text-sm text-gray-700">{data.achievements.filter(a => a.unlocked).length} Badges</span>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.achievements.map((achievement) => {
            const completedPercent = Math.round((achievement.progress / achievement.maxProgress) * 100);
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-2xl p-5 shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${achievement.unlocked ? 'ring-2 ring-green-200 border border-green-100' : 'border border-gray-200'}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${achievement.unlocked ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${achievement.unlocked ? 'text-green-700' : 'text-gray-800'}`}>{achievement.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && <span className="text-green-600 text-xs font-bold px-2 py-1 bg-green-100 rounded-full">UNLOCKED</span>}
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-gray-700">{achievement.progress}/{achievement.maxProgress} ({completedPercent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${achievement.unlocked ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${completedPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Reward: {achievement.points} points</span>
                  {achievement.unlocked ? (
                    <span className="text-green-700 font-semibold">✅ Achieved</span>
                  ) : (
                    <span className="text-blue-600 font-medium">{Math.max(1, achievement.maxProgress - achievement.progress)} left</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-indigo-100">
          <h2 className="text-xl font-bold mb-4 text-indigo-700">🎮 Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => addPoints(5)}
              className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Star className="mx-auto mb-1 text-blue-600" size={24} />
              <div className="text-sm font-medium text-gray-700">Study Session</div>
              <div className="text-xs text-gray-500">+5 points</div>
            </button>
            <button
              onClick={() => addPoints(10)}
              className="p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Award className="mx-auto mb-1 text-green-600" size={24} />
              <div className="text-sm font-medium text-gray-700">Complete Task</div>
              <div className="text-xs text-gray-500">+10 points</div>
            </button>
            <button
              onClick={() => addPoints(15)}
              className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Target className="mx-auto mb-1 text-purple-600" size={24} />
              <div className="text-sm font-medium text-gray-700">Group Study</div>
              <div className="text-xs text-gray-500">+15 points</div>
            </button>
            <button
              onClick={() => addPoints(20)}
              className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Flame className="mx-auto mb-1 text-orange-600" size={24} />
              <div className="text-sm font-medium text-gray-700">Streak Bonus</div>
              <div className="text-xs text-gray-500">+20 points</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;