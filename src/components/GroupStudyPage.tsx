import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const GroupStudyPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<string>(() => localStorage.getItem('studyai-current-user') || 'Guest');

  const durations = [1, 2, 5, 6];

  useEffect(() => {
    localStorage.setItem('studyai-current-user', currentUser);
  }, [currentUser]);

  const handleSelectDuration = (duration: number) => {
    navigate(`/focus-session/${duration}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4" style={{ fontFamily: 'Inter, Roboto, Poppins, sans-serif' }}>
      <style>
        {`@keyframes fadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
          .fade-in { animation: fadeIn 0.8s ease-out both; }
          .focus-block-btn { box-shadow: 0 12px 24px rgba(30, 58, 138, 0.15); }
          .focus-block-btn:hover { transform: translateY(-1px); }
          .focus-block-btn:active { transform: translateY(1px); }
          .ghost-input { background: #f8fafc; border: 1px solid #cbd5e1; }
          .ghost-input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15); }
        `}
      </style>

      <div className="w-full max-w-3xl fade-in">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">Concentration Studio</h1>
            <button
              onClick={() => navigate('/')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
            >
              <ArrowLeft size={16} className="inline-block mr-1" /> Back
            </button>
          </div>

          <p className="text-sm font-light text-slate-500 mb-6 italic">Start a focused session in one click and keep the momentum with a clean, minimal workflow.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {durations.map((duration) => (
              <div key={duration} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm hover:shadow-md transition">
                <h2 className="text-lg font-bold text-slate-800 mb-2">{duration}-Hour Focus</h2>
                <p className="text-xs text-slate-500 mb-4">Stay immersed and avoid interruptions.</p>
                <button
                  onClick={() => handleSelectDuration(duration)}
                  className="focus-block-btn w-full rounded-lg py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition"
                >
                  Start
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-4">
            <label className="block text-sm font-medium text-slate-600 mb-2">Guest name</label>
            <input
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              placeholder="Your name (optional)"
              className="ghost-input w-full rounded-lg px-3 py-2 text-slate-700"
            />
          </div>

          <p className="text-sm text-slate-400 italic">Pro tip: Keep distractions away while this mode is active; use it for deep work sprints.</p>
        </div>
      </div>
    </div>
  );
};

export default GroupStudyPage;
