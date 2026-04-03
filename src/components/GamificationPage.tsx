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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-200/10 to-purple-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto p-4 relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white/20 relative overflow-hidden">
          {/* Header background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="text-white" size={24} />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Study Achievements
                </h1>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                Track your progress, unlock milestones, and level up your learning game with exciting rewards and achievements.
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="text-6xl font-black text-white mb-1">{data.points.toLocaleString()}</div>
                <div className="text-sm tracking-wider text-indigo-100 font-medium">TOTAL POINTS</div>
                <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <div className="group bg-white/70 backdrop-blur-sm border border-orange-200/50 rounded-2xl p-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Flame className="text-white" size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg">{data.streak}</div>
                <div className="text-xs text-gray-600 font-medium">Day Streak</div>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm border border-yellow-200/50 rounded-2xl p-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Award className="text-white" size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg">{data.achievements.filter(a => a.unlocked).length}</div>
                <div className="text-xs text-gray-600 font-medium">Badges Earned</div>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm border border-green-200/50 rounded-2xl p-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Target className="text-white" size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg">{Math.round((data.achievements.filter(a => a.unlocked).length / data.achievements.length) * 100)}%</div>
                <div className="text-xs text-gray-600 font-medium">Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {data.achievements.map((achievement, index) => {
            const completedPercent = Math.round((achievement.progress / achievement.maxProgress) * 100);
            return (
              <div
                key={achievement.id}
                className={`group bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border relative overflow-hidden ${
                  achievement.unlocked
                    ? 'ring-2 ring-green-300/50 border-green-200/50 shadow-green-100/50'
                    : 'border-gray-200/50 hover:border-indigo-200/50'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Achievement background glow for unlocked */}
                {achievement.unlocked && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-emerald-400/5 to-teal-400/10 rounded-3xl"></div>
                )}

                {/* Achievement icon and content */}
                <div className="flex items-start gap-4 mb-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transform transition-all duration-300 group-hover:scale-110 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-green-200'
                      : 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 group-hover:from-indigo-200 group-hover:to-purple-200'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-xl mb-1 ${
                      achievement.unlocked ? 'text-green-700' : 'text-gray-800'
                    }`}>{achievement.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-green-600 text-xs font-bold px-3 py-1 bg-green-100 rounded-full shadow-sm animate-pulse">
                        ✓ UNLOCKED
                      </span>
                      <div className="text-xs text-green-600 font-medium">
                        +{achievement.points} pts
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress section */}
                <div className="mb-4 relative z-10">
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span className={`font-bold ${
                      achievement.unlocked ? 'text-green-600' : 'text-indigo-600'
                    }`}>
                      {achievement.progress}/{achievement.maxProgress} ({completedPercent}%)
                    </span>
                  </div>

                  {/* Enhanced progress bar */}
                  <div className="relative">
                    <div className="w-full h-3 bg-gray-200/50 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                          achievement.unlocked
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                            : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                        }`}
                        style={{
                          width: `${completedPercent}%`,
                          boxShadow: achievement.unlocked ? '0 0 10px rgba(34, 197, 94, 0.3)' : 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Achievement status */}
                <div className="flex justify-between items-center text-sm relative z-10">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500" size={16} />
                    <span className="text-gray-600 font-medium">{achievement.points} points reward</span>
                  </div>
                  {achievement.unlocked ? (
                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      <span>Achieved!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-indigo-600 font-medium">
                      <Target size={16} />
                      <span>{Math.max(1, achievement.maxProgress - achievement.progress)} to go</span>
                    </div>
                  )}
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Quick Actions
              </h2>
            </div>

            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Earn points instantly by completing study activities. Click any action to add points to your total score!
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => addPoints(5)}
                className="group relative bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 p-5 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 border border-blue-200/50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-indigo-500/0 group-hover:from-blue-400/10 group-hover:to-indigo-500/10 transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Star className="text-white" size={24} />
                  </div>
                  <div className="text-sm font-bold text-gray-800 mb-1">Study Session</div>
                  <div className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full inline-block">+5 points</div>
                </div>
              </button>

              <button
                onClick={() => addPoints(10)}
                className="group relative bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 p-5 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 border border-green-200/50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-emerald-500/0 group-hover:from-green-400/10 group-hover:to-emerald-500/10 transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Award className="text-white" size={24} />
                  </div>
                  <div className="text-sm font-bold text-gray-800 mb-1">Complete Task</div>
                  <div className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full inline-block">+10 points</div>
                </div>
              </button>

              <button
                onClick={() => addPoints(15)}
                className="group relative bg-gradient-to-br from-purple-50 to-violet-100 hover:from-purple-100 hover:to-violet-200 p-5 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 border border-purple-200/50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-violet-500/0 group-hover:from-purple-400/10 group-hover:to-violet-500/10 transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Target className="text-white" size={24} />
                  </div>
                  <div className="text-sm font-bold text-gray-800 mb-1">Group Study</div>
                  <div className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full inline-block">+15 points</div>
                </div>
              </button>

              <button
                onClick={() => addPoints(20)}
                className="group relative bg-gradient-to-br from-orange-50 to-red-100 hover:from-orange-100 hover:to-red-200 p-5 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 border border-orange-200/50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-red-500/0 group-hover:from-orange-400/10 group-hover:to-red-500/10 transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Flame className="text-white" size={24} />
                  </div>
                  <div className="text-sm font-bold text-gray-800 mb-1">Streak Bonus</div>
                  <div className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded-full inline-block">+20 points</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;