import React from 'react';
import { StudyPlan, Subject } from '../types';

interface ProgressChartProps {
  plan: StudyPlan;
  subjects: Subject[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ plan, subjects }) => {
  // Calculate progress by subject
  const subjectProgress = subjects
    .filter(s => s.enabled)
    .map(subject => {
      const subjectSessions = plan.sessions.filter(s => s.subjectId === subject.id);
      const completed = subjectSessions.filter(s => s.status === 'completed').length;
      const total = subjectSessions.length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        name: subject.name,
        progress,
        color: subject.color,
        completed,
        total,
      };
    })
    .sort((a, b) => b.progress - a.progress);

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1rem' }}>Progress by Subject</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {subjectProgress.map(subject => (
          <div key={subject.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: subject.color,
                borderRadius: '50%',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: '500' }}>{subject.name}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {subject.completed}/{subject.total} ({subject.progress}%)
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'var(--border-color)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${subject.progress}%`,
                    height: '100%',
                    backgroundColor: subject.color,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;