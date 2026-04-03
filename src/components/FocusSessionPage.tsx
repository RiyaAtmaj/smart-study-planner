import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const fakeProfiles = [
  'Riya', 'Aman', 'Tanya', 'Vivek', 'Sahil', 'Neha', 'Priya', 'Karan', 'Meera', 'Aditya',
  'Isha', 'Mahesh', 'Arjun', 'Pooja', 'Rohit', 'Shreya', 'Nitin', 'Aditi'
];

const shuffle = <T,>(array: T[]): T[] => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const playCompletionSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.value = 0.2;
    osc.start();
    setTimeout(() => {
      osc.stop();
      audioCtx.close();
    }, 250);
  } catch {
    // ignore unsupported browsers
  }
};

const FocusSessionPage: React.FC = () => {
  const navigate = useNavigate();
  const { duration } = useParams<{ duration: string }>();

  const currentUser = localStorage.getItem('studyai-current-user') || 'Guest';
  const durationHours = parseInt(duration || '0', 10);

  const [participants, setParticipants] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionMessage, setSessionMessage] = useState<string>('');

  useEffect(() => {
    if (!durationHours || isNaN(durationHours) || durationHours <= 0) {
      setSessionMessage('Invalid session duration. Please return to the concentrate page and select a valid duration.');
      return;
    }

    const selectedCount = 5 + Math.floor(Math.random() * 2);
    const selected = shuffle(fakeProfiles).slice(0, selectedCount);
    if (!selected.includes(currentUser)) selected.push(currentUser);

    setParticipants(selected);

    const durationMs = durationHours * 60 * 60 * 1000;
    setTimeLeft(durationMs);
    setEndTime(Date.now() + durationMs);
    setIsRunning(true);

    setSessionMessage(`You joined a ${durationHours}-hour concentration session with ${selected.length} total participants.`);
  }, [durationHours, currentUser]);

  useEffect(() => {
    if (!endTime || !isRunning) return;

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;
      if (diff <= 0) {
        setTimeLeft(0);
        setSessionMessage(`Congratulations! You completed the ${durationHours}-hour concentration session.`);
        setIsRunning(false);
        playCompletionSound();
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [endTime, isRunning, durationHours]);

  const stopSession = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setSessionMessage('Session ended. Great progress—take a break and restart when ready.');
  };

  const remaining = timeLeft !== null ? formatTime(timeLeft) : '00:00:00';

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(120deg, #0f172a 0%, #1e293b 45%, #0f172a 100%)',
        color: '#e2e8f0',
        padding: '2rem 0',
      }}
    >
      <div className="max-w-5xl mx-auto px-5">
        <button
          onClick={() => navigate('/group-study')}
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            color: '#60a5fa',
            background: 'rgba(148, 163, 184, 0.14)',
            border: '1px solid rgba(148, 163, 184, 0.40)',
            borderRadius: '999px',
            padding: '0.52rem 0.85rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} /> Back to Concentration
        </button>

        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.45)',
          }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{ color: '#f8fafc' }}>
            Focus Session — {durationHours}h
          </h1>

          <p className="text-sm text-slate-300 mb-4">Participant count: <strong>{participants.length}</strong></p>

          {sessionMessage && (
            <div className="mb-4 rounded-lg border border-blue-300/40 bg-blue-500/12 p-3 text-blue-200">
              {sessionMessage}
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-100">Timer</h3>
            <p className="text-6xl font-black text-cyan-300 mt-1">{remaining}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-100 mb-2">Participants</h3>
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => (
                <span key={p} className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-600 text-xs text-slate-100">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsRunning((s) => !s)}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition shadow-lg"
            >
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={stopSession}
              className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition shadow-lg"
            >
              End Session
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600 transition shadow-lg"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusSessionPage;
