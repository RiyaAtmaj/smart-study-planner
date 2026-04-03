import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const quotes = [
  'Small progress is still progress. Keep going!',
  'Success is built on consistency. One step at a time.',
  'You are capable of more than you think. Keep studying!',
  'Every day you learn is a day closer to your best self.',
  'Challenges are proof you are trying. Keep moving forward.'
];

const PageMotivation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const quote = useMemo(() => {
    const idx = Math.floor(Math.random() * quotes.length);
    return quotes[idx];
  }, [location.pathname]);

  const canGoBack = window.history.length > 1;

  return (
    <div className="w-full bg-gradient-to-r from-indigo-100 via-white to-rose-100 border-b border-indigo-200 p-3 mb-3 rounded-b-xl shadow-sm">
      <div className="flex items-center justify-between gap-3 max-w-6xl mx-auto">
        <button
          onClick={() => (canGoBack ? navigate(-1) : navigate('/'))}
          className="flex items-center gap-2 text-sm sm:text-base font-semibold text-indigo-700 bg-white border border-indigo-300 rounded-full px-4 py-2 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-lg transition-all duration-200"
          style={{ boxShadow: '0 6px 16px rgba(79, 70, 229, 0.16)' }}
        >
          <span className="text-indigo-500">←</span>
          <span className="text-indigo-700">Back</span>
        </button>
        <div className="text-sm sm:text-base text-gray-700 font-semibold italic tracking-wider">"{quote}"</div>
        <div className="w-14" />
      </div>
    </div>
  );
};

export default PageMotivation;
