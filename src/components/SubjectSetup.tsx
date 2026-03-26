import React, { useState, useEffect } from 'react';
import { Subject } from '../types';
import { ChevronDown, ChevronUp, ArrowRight, ArrowLeft } from 'lucide-react';

interface SubjectSetupProps {
  subjects: Subject[];
  onUpdateSubjects: (subjects: Subject[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const SubjectSetup: React.FC<SubjectSetupProps> = ({
  subjects,
  onUpdateSubjects,
  onNext,
  onBack,
}) => {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  // Automatically expand enabled subjects
  useEffect(() => {
    const enabledSubjectIds = subjects.filter(s => s.enabled).map(s => s.id);
    setExpandedSubjects(new Set(enabledSubjectIds));
  }, [subjects]);

  const toggleSubject = (subjectId: string) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId
        ? { ...subject, enabled: !subject.enabled }
        : subject
    );
    onUpdateSubjects(updatedSubjects);
  };

  const toggleTopic = (subjectId: string, topicId: string) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId
        ? {
            ...subject,
            topics: subject.topics.map(topic =>
              topic.id === topicId
                ? { ...topic, enabled: !topic.enabled }
                : topic
            ),
          }
        : subject
    );
    onUpdateSubjects(updatedSubjects);
  };

  const updateDifficulty = (subjectId: string, difficulty: number) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId
        ? { ...subject, difficulty }
        : subject
    );
    onUpdateSubjects(updatedSubjects);
  };

  const toggleExpanded = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  const enabledSubjects = subjects.filter(s => s.enabled);
  const canProceed = enabledSubjects.length > 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Subject Setup</h2>
        <p>Select subjects to automatically show topic selection. Customize difficulty and choose specific topics to study.</p>
      </div>

      <div className="subject-grid">
        {subjects.map(subject => (
          <div
            key={subject.id}
            className={`subject-card ${subject.enabled ? 'selected' : ''}`}
            onClick={() => toggleSubject(subject.id)}
          >
            <div className="subject-header">
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={subject.enabled}
                  onChange={() => toggleSubject(subject.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div
                  className="subject-color"
                  style={{ backgroundColor: subject.color }}
                />
                <span className="subject-title">{subject.name}</span>
                {subject.enabled && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                    ({subject.topics.filter(t => t.enabled).length}/{subject.topics.length} topics)
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(subject.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                {expandedSubjects.has(subject.id) ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>

            {subject.enabled && (
              <>
                <div className="form-group">
                  <label>Difficulty Level: {subject.difficulty}/5</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={subject.difficulty}
                    onChange={(e) => updateDifficulty(subject.id, parseInt(e.target.value))}
                    className="difficulty-slider"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {expandedSubjects.has(subject.id) && (
                  <div className="topic-list">
                    {subject.topics.map(topic => (
                      <div key={topic.id} className="topic-item">
                        <label className="checkbox" style={{ margin: 0 }}>
                          <input
                            type="checkbox"
                            checked={topic.enabled}
                            onChange={() => toggleTopic(subject.id, topic.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span>{topic.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          Next
          <ArrowRight size={16} />
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
        {enabledSubjects.length} subject{enabledSubjects.length !== 1 ? 's' : ''} selected
      </div>
    </div>
  );
};

export default SubjectSetup;