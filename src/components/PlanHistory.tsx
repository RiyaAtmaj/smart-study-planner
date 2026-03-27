import React, { useEffect, useState } from 'react';
import { getPlanHistory, PlanHistoryEntry } from '../api';
import { StudyPlan } from '../types';

interface PlanHistoryProps {
  onSelectPlan: (plan: StudyPlan) => void;
}

const PlanHistory: React.FC<PlanHistoryProps> = ({ onSelectPlan }) => {
  const [history, setHistory] = useState<PlanHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getPlanHistory().then(rows => {
      if (isMounted) setHistory(rows);
      setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <div className="card" style={{ padding: '1rem' }}>Loading plan history...</div>;
  }

  if (!history.length) {
    return <div className="card" style={{ padding: '1rem' }}>No historical plans found.</div>;
  }

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <h3>Plan History</h3>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {history.map(item => (
          <div key={item.id} style={{ border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Version {item.version}</strong> • {new Date(item.created_at).toLocaleString()}
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.note || 'No note'}</div>
              </div>
              <button className="btn btn-primary" style={{ fontSize: '0.85rem' }} onClick={() => onSelectPlan(item.plan_data as StudyPlan)}>
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanHistory;
