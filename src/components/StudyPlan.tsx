import React, { useState } from 'react';
import { StudyPlan, Subject, Session } from '../types';
import { format, isToday, addDays } from 'date-fns';
import { addAdaptiveSessions } from '../ai';
import { Calendar, Printer } from 'lucide-react';

interface StudyPlanProps {
  plan: StudyPlan | null;
  subjects: Subject[];
  onUpdateSessions: (sessions: Session[]) => void;
}

const StudyPlanPage: React.FC<StudyPlanProps> = ({
  plan,
  subjects,
  onUpdateSessions,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(() => {
    // Default to today if it's within the plan, otherwise first day
    const today = new Date();
    const planStart = plan?.createdAt || new Date();
    const dayNumber = Math.floor((today.getTime() - planStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (plan && dayNumber >= 1 && dayNumber <= plan.duration) {
      return dayNumber;
    }
    return 1;
  });

  if (!plan) return null;

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
    let updatedSessions = plan.sessions.map(session =>
      session.id === sessionId ? { ...session, status } : session
    );

    // Add adaptive sessions for difficult or missed sessions
    if (status === 'difficult' || status === 'missed') {
      updatedSessions = addAdaptiveSessions(updatedSessions, sessionId, status, plan.examDate);
    }

    onUpdateSessions(updatedSessions);
  };

  // Calculate progress for each day
  const getDayProgress = (day: number) => {
    const daySessions = plan.sessions.filter(s => s.day === day);
    const completed = daySessions.filter(s => s.status === 'completed').length;
    return daySessions.length > 0 ? Math.round((completed / daySessions.length) * 100) : 0;
  };

  const selectedDaySessions = plan.sessions.filter(s => s.day === selectedDay);
  const selectedDate = addDays(plan.createdAt, (selectedDay || 1) - 1);

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Study Plan</h2>
            <p>Day-by-day breakdown of your study schedule</p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => window.print()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Printer size={16} />
            Print Plan
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div className="plan-sidebar">
          <h3 style={{ marginBottom: '1rem' }}>Days</h3>
          <div className="day-list">
            {Array.from({ length: plan.duration }, (_, i) => i + 1).map(day => {
              const dayDate = addDays(plan.createdAt, day - 1);
              const progress = getDayProgress(day);
              const isDayToday = isToday(dayDate);

              return (
                <div
                  key={day}
                  className={`day-item ${selectedDay === day ? 'selected' : ''} ${isDayToday ? 'today' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <div>
                    <div style={{ fontWeight: '500' }}>
                      Day {day}
                      {isDayToday && <span style={{ marginLeft: '0.5rem' }}>📅 Today</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      {format(dayDate, 'MMM d')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', marginRight: '0.5rem' }}>
                      {progress}%
                    </span>
                    <div className="day-progress">
                      <div
                        className="day-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="plan-content">
          {selectedDay && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem' }}>
                  Day {selectedDay} - {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {selectedDaySessions.length} session{selectedDaySessions.length !== 1 ? 's' : ''} scheduled
                </p>
              </div>

              {selectedDaySessions.length > 0 ? (
                <div className="session-list">
                  {selectedDaySessions.map(session => (
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
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>No sessions scheduled for this day</p>
                </div>
              )}
            </>
          )}
        </div>
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

export default StudyPlanPage;