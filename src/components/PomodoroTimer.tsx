import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

interface PomodoroTimerProps {
  onSessionComplete?: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(3 * 60 * 60); // 3 hours study
      setSessionCount(count => count + 1);
      if (onSessionComplete) onSessionComplete();
    } else {
      setIsBreak(true);
      setTimeLeft(30 * 60); // 30 minute break
    }
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(isBreak ? 'Break time!' : 'Study session complete!', {
        body: isBreak ? 'Take a 30-minute break.' : 'Time for a break!',
        icon: '/favicon.ico'
      });
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? 30 * 60 : 3 * 60 * 60);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="card" style={{ textAlign: 'center', maxWidth: '300px', margin: '0 auto' }}>
      <div style={{ 
        fontSize: '3.5rem', 
        marginBottom: '0.5rem',
        animation: isRunning ? 'bunnyBounce 0.6s ease-in-out infinite' : 'bunnyWiggle 0.4s ease-in-out infinite'
      }}>
        🐰
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
        <Timer size={24} style={{ marginRight: '0.5rem' }} />
        <h3>Pomodoro Timer</h3>
      </div>

      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0', color: isBreak ? '#10B981' : '#3B82F6' }}>
        {formatTime(timeLeft)}
      </div>

      <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        {isBreak ? 'Break Time' : 'Study Session'} • Session {sessionCount + 1}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button
          className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
          onClick={toggleTimer}
          style={{ flex: 1 }}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={resetTimer}
          style={{ flex: 1 }}
          aria-label="Reset timer"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        3 hours study + 30 min break
      </div>
    </div>
  );
};

export default PomodoroTimer;