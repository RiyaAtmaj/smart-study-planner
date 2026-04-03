import React, { useState, useEffect } from 'react';
import { Brain, Clock, TrendingUp, Lightbulb, Calendar, Target } from 'lucide-react';

interface StudySession {
  subject: string;
  duration: number;
  timestamp: string;
  effectiveness: number; // 1-5 rating
}

interface AIRecommendation {
  type: 'time' | 'subject' | 'method' | 'break';
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

const AIRecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [studyData, setStudyData] = useState<StudySession[]>([]);

  useEffect(() => {
    // Load study data from localStorage
    const savedSessions = localStorage.getItem('studyai-sessions');
    if (savedSessions) {
      setStudyData(JSON.parse(savedSessions));
    }

    // Generate AI recommendations based on patterns
    generateRecommendations();
  }, []);

  const generateRecommendations = () => {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    const recs: AIRecommendation[] = [];

    // Time-based recommendations
    if (hour >= 9 && hour <= 11) {
      recs.push({
        type: 'time',
        title: 'Peak Focus Time',
        description: 'Your study data shows you perform best in the morning. Consider tackling difficult subjects now.',
        icon: <Clock size={24} />,
        priority: 'high'
      });
    } else if (hour >= 14 && hour <= 16) {
      recs.push({
        type: 'time',
        title: 'Afternoon Study Session',
        description: 'This is a good time for review and practice. Your focus tends to be stable in the afternoon.',
        icon: <Clock size={24} />,
        priority: 'medium'
      });
    }

    // Subject-based recommendations
    const subjectCounts = studyData.reduce((acc, session) => {
      acc[session.subject] = (acc[session.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const leastStudied = Object.entries(subjectCounts)
      .sort(([,a], [,b]) => a - b)
      .slice(0, 2)
      .map(([subject]) => subject);

    if (leastStudied.length > 0) {
      recs.push({
        type: 'subject',
        title: 'Balance Your Studies',
        description: `You've been focusing less on ${leastStudied.join(' and ')}. Consider dedicating time to these subjects.`,
        icon: <Target size={24} />,
        priority: 'medium'
      });
    }

    // Study method recommendations
    const avgEffectiveness = studyData.reduce((sum, session) => sum + session.effectiveness, 0) / studyData.length || 0;

    if (avgEffectiveness < 3) {
      recs.push({
        type: 'method',
        title: 'Improve Study Techniques',
        description: 'Your self-reported effectiveness is below average. Try the Pomodoro technique or active recall methods.',
        icon: <Lightbulb size={24} />,
        priority: 'high'
      });
    }

    // Break recommendations
    const recentSessions = studyData
      .filter(session => new Date(session.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .reduce((sum, session) => sum + session.duration, 0);

    if (recentSessions > 4 * 60) { // More than 4 hours today
      recs.push({
        type: 'break',
        title: 'Take a Break',
        description: 'You\'ve studied for over 4 hours today. Take a 15-20 minute break to maintain effectiveness.',
        icon: <Calendar size={24} />,
        priority: 'high'
      });
    }

    // Weekly pattern recommendations
    if (dayOfWeek === 1) { // Monday
      recs.push({
        type: 'time',
        title: 'Weekly Planning',
        description: 'Start your week strong! Review your goals and plan your study schedule.',
        icon: <TrendingUp size={24} />,
        priority: 'medium'
      });
    }

    // Default recommendations if no data
    if (recs.length === 0) {
      recs.push(
        {
          type: 'method',
          title: 'Start Tracking',
          description: 'Begin logging your study sessions to get personalized AI recommendations.',
          icon: <Brain size={24} />,
          priority: 'low'
        },
        {
          type: 'time',
          title: 'Consistent Schedule',
          description: 'Establish a regular study routine. Consistency leads to better learning outcomes.',
          icon: <Clock size={24} />,
          priority: 'low'
        }
      );
    }

    setRecommendations(recs);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6" style={{ border: '1px solid var(--border-light)' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Brain className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">🤖 AI Study Recommendations</h1>
              <p className="text-gray-600">Personalized insights based on your study patterns</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4" style={{ border: '1px solid var(--border-light)' }}>
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={24} />
              <div>
                <div className="text-2xl font-bold">{studyData.length}</div>
                <div className="text-sm text-gray-600">Study Sessions</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4" style={{ border: '1px solid var(--border-light)' }}>
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green-600" size={24} />
              <div>
                <div className="text-2xl font-bold">
                  {studyData.length > 0 ? Math.round(studyData.reduce((sum, s) => sum + s.effectiveness, 0) / studyData.length * 10) / 10 : 0}/5
                </div>
                <div className="text-sm text-gray-600">Avg Effectiveness</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4" style={{ border: '1px solid var(--border-light)' }}>
            <div className="flex items-center gap-3">
              <Target className="text-purple-600" size={24} />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(studyData.reduce((sum, s) => sum + s.duration, 0) / 60 * 10) / 10}h
                </div>
                <div className="text-sm text-gray-600">Total Study Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">💡 Personalized Recommendations</h2>

          {recommendations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center" style={{ border: '1px solid var(--border-light)' }}>
              <Brain className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold mb-2">Analyzing Your Patterns</h3>
              <p className="text-gray-600">Start logging study sessions to get AI-powered recommendations!</p>
            </div>
          ) : (
            recommendations.map((rec, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${getPriorityColor(rec.priority)}`}
                style={{ border: '1px solid var(--border-light)' }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {rec.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{rec.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={generateRecommendations}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            🔄 Refresh Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationsPage;