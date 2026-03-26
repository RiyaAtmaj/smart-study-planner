import React, { useState } from 'react';
import { Subject, StudyPlan } from '../types';
import { generateStudyPlan } from '../ai';
import { ArrowRight, ArrowLeft, Calendar, Clock } from 'lucide-react';

interface PlanConfigProps {
  onComplete: (plan: StudyPlan) => void;
  enabledSubjects: Subject[];
  onBack: () => void;
}

const PlanConfig: React.FC<PlanConfigProps> = ({
  onComplete,
  enabledSubjects,
  onBack,
}) => {
  const [examDate, setExamDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 30); // Default to 30 days from now
    return today.toISOString().split('T')[0];
  });

  const [duration, setDuration] = useState<7 | 30>(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = generateStudyPlan(enabledSubjects, new Date(examDate), duration);
    onComplete(plan);
  };

  const minDate = new Date().toISOString().split('T')[0];
  const selectedExamDate = new Date(examDate);
  const daysUntilExam = Math.ceil((selectedExamDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Plan Configuration</h2>
        <p>Set your exam date and choose your preparation timeline</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="examDate">
              <Calendar size={16} style={{ marginRight: '0.5rem' }} />
              Exam Date
            </label>
            <input
              type="date"
              id="examDate"
              className="input"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              min={minDate}
              required
            />
            <small style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>
              {daysUntilExam > 0 ? `${daysUntilExam} days until exam` : 'Exam date must be in the future'}
            </small>
          </div>

          <div className="form-group">
            <label>Plan Duration</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div
                className={`card ${duration === 7 ? 'selected' : ''}`}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  border: duration === 7 ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                  textAlign: 'center',
                }}
                onClick={() => setDuration(7)}
              >
                <Clock size={24} style={{ margin: '0 auto 0.5rem', color: 'var(--primary-blue)' }} />
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>7-Day Sprint</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Intensive preparation with built-in revision
                </p>
              </div>

              <div
                className={`card ${duration === 30 ? 'selected' : ''}`}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  border: duration === 30 ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                  textAlign: 'center',
                }}
                onClick={() => setDuration(30)}
              >
                <Clock size={24} style={{ margin: '0 auto 0.5rem', color: 'var(--primary-blue)' }} />
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>30-Day Full Prep</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Comprehensive study with multiple revisions
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>Plan Summary</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
              <li>Exam: {selectedExamDate.toLocaleDateString()}</li>
              <li>Duration: {duration} days</li>
              <li>Subjects: {enabledSubjects.length}</li>
              <li>Max sessions per day: 4</li>
              <li>Built-in revision days: {duration === 30 ? '7, 14, 21, 28' : '7'}</li>
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={daysUntilExam <= 0}
            >
              Generate Plan
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanConfig;