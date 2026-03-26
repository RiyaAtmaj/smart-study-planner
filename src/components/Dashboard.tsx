import React from 'react';
import { AppState, Session } from '../types';
import { Link } from 'react-router-dom';
import { format, isToday } from 'date-fns';
import { addAdaptiveSessions } from '../ai';
import PomodoroTimer from './PomodoroTimer';
import ProgressChart from './ProgressChart';
import {
  BookOpen,
  AlertTriangle,
  XCircle,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  state: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onUpdateState }) => {
  if (!state.currentPlan || !state.user) return null;

  const { currentPlan, subjects } = state;
  const today = new Date();
  const currentHour = today.getHours();

  // Calculate greeting
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Calculate stats
  const totalSessions = currentPlan.sessions.length;
  const completedSessions = currentPlan.sessions.filter(s => s.status === 'completed').length;
  const overallProgress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    const sortedSessions = [...currentPlan.sessions].sort((a, b) => a.day - b.day);

    for (let day = 1; day <= currentPlan.duration; day++) {
      const daySessions = sortedSessions.filter(s => s.day === day);
      const completedOnDay = daySessions.filter(s => s.status === 'completed').length;
      const totalOnDay = daySessions.length;

      if (completedOnDay === totalOnDay && totalOnDay > 0) {
        streak++;
      } else if (day <= Math.floor((new Date().getTime() - currentPlan.createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 1) {
        // Only break streak for past days
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  // Get next pending session
  const nextSession = currentPlan.sessions
    .filter(s => s.status === 'pending')
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())[0];

  // Get today's sessions
  const todaySessions = currentPlan.sessions.filter(s => isToday(s.scheduledDate));

  // Quick stats
  const difficultSessions = currentPlan.sessions.filter(s => s.status === 'difficult').length;
  const missedSessions = currentPlan.sessions.filter(s => s.status === 'missed').length;

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || subjectId;
  };

  const getSubjectColor = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.color || '#6b7280';
  };

  const getTopicName = (subjectId: string, topicId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.topics.find(t => t.id === topicId)?.name || topicId;
  };

  const updateSessionStatus = (sessionId: string, status: Session['status']) => {
    if (!currentPlan) return;

    let updatedSessions = currentPlan.sessions.map(session =>
      session.id === sessionId ? { ...session, status } : session
    );

    // Add adaptive sessions for difficult or missed sessions
    if ((status === 'difficult' || status === 'missed') && currentPlan) {
      updatedSessions = addAdaptiveSessions(updatedSessions, sessionId, status, currentPlan.examDate);
    }

    onUpdateState({
      currentPlan: { ...currentPlan, sessions: updatedSessions }
    });
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          {getGreeting()}, {state.user.name.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {format(today, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-value">{overallProgress}%</div>
          <div className="stat-label">Overall Progress</div>
          <div className="progress-bar" style={{ marginTop: '1rem' }}>
            <div
              className="progress-fill"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{completedSessions}</div>
          <div className="stat-label">Sessions Completed</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">
            {currentPlan.duration - Math.floor((today.getTime() - currentPlan.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="stat-label">Days Remaining</div>
        </div>
      </div>

      {/* Progress Chart */}
      <div style={{ marginBottom: '2rem' }}>
        <ProgressChart plan={currentPlan} subjects={subjects} />
      </div>

      {/* Next Task */}
      {nextSession && (
        <div className="next-task-card">
          <div className="next-task-header">
            <h3>Next Task</h3>
            <Link to="/plan" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              View Plan
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="session-card" style={{ margin: 0, border: '1px solid var(--border-color)' }}>
            <div className="session-header">
              <div className="session-info">
                <div
                  className="subject-color"
                  style={{ backgroundColor: getSubjectColor(nextSession.subjectId) }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>
                    {getSubjectName(nextSession.subjectId)}
                  </h4>
                  <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>
                    {getTopicName(nextSession.subjectId, nextSession.topicId)}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`badge badge-${nextSession.type}`}>
                  {nextSession.type === 'study' ? '📖 Study' : '📌 Revision'}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {nextSession.duration} min
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stat-card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
            <div>
              <div className="stat-value">{difficultSessions}</div>
              <div className="stat-label">Difficult</div>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <XCircle size={20} style={{ color: '#ef4444' }} />
            <div>
              <div className="stat-value">{missedSessions}</div>
              <div className="stat-label">Missed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro Timer */}
      <div style={{ marginBottom: '2rem' }}>
        <PomodoroTimer />
      </div>

      {/* Today's Schedule */}
      <div className="today-schedule">
        <div className="schedule-header">
          <h3>Today's Schedule</h3>
          <Link to="/plan" className="btn btn-primary">
            View Full Plan
          </Link>
        </div>

        {todaySessions.length > 0 ? (
          <div className="session-list">
            {todaySessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                subjectName={getSubjectName(session.subjectId)}
                topicName={getTopicName(session.subjectId, session.topicId)}
                subjectColor={getSubjectColor(session.subjectId)}
                onStatusChange={(status) => updateSessionStatus(session.id, status)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No sessions scheduled for today</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface SessionCardProps {
  session: Session;
  subjectName: string;
  topicName: string;
  subjectColor: string;
  onStatusChange: (status: Session['status']) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  subjectName,
  topicName,
  subjectColor,
  onStatusChange,
}) => {
  const getStatusBadge = () => {
    switch (session.status) {
      case 'completed':
        return <span className="badge badge-completed">✅ Completed</span>;
      case 'difficult':
        return <span className="badge badge-difficult">😓 Difficult</span>;
      case 'missed':
        return <span className="badge badge-missed">❌ Missed</span>;
      default:
        return <span className="badge badge-pending">⏳ Pending</span>;
    }
  };

  const getTypeBadge = () => {
    return session.type === 'study' ? (
      <span className="badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
        📖 Study
      </span>
    ) : (
      <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
        📌 Revision
      </span>
    );
  };

  return (
    <div className="session-card">
      <div className="session-header">
        <div className="session-info">
          <div
            className="subject-color"
            style={{ backgroundColor: subjectColor }}
          />
          <div>
            <h4 style={{ margin: 0 }}>{subjectName}</h4>
            <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>
              {topicName}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {getTypeBadge()}
          {getStatusBadge()}
        </div>
      </div>

      <div className="session-meta">
        <span>⏱️ {session.duration} minutes</span>
        <span>📊 Difficulty: {session.difficulty}/5</span>
      </div>

      {session.status === 'pending' && (
        <div className="session-actions">
          <button
            className="session-action-btn done"
            onClick={() => onStatusChange('completed')}
          >
            ✅ Done
          </button>
          <button
            className="session-action-btn difficult"
            onClick={() => onStatusChange('difficult')}
          >
            😓 Difficult
          </button>
          <button
            className="session-action-btn missed"
            onClick={() => onStatusChange('missed')}
          >
            ❌ Missed
          </button>
        </div>
      )}

      {session.status !== 'pending' && (
        <div className="session-actions">
          <button
            className="session-action-btn undo"
            onClick={() => onStatusChange('pending')}
          >
            ↶ Undo
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;