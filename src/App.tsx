import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AppState } from './types';
import { loadFromStorage, saveToStorage } from './storage';
import { SUBJECTS } from './data';
import WelcomePage from './components/WelcomePage';
import SubjectSetup from './components/SubjectSetup';
import PlanConfig from './components/PlanConfig';
import Dashboard from './components/Dashboard';
import StudyPlan from './components/StudyPlan';
import Navbar from './components/Navbar';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const [state, setState] = useState<AppState>({
    user: null,
    subjects: SUBJECTS,
    currentPlan: null,
    currentStep: 'welcome',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = loadFromStorage();
    if (savedState) {
      setState(savedState);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetApp = () => {
    setState({
      user: null,
      subjects: SUBJECTS,
      currentPlan: null,
      currentStep: 'welcome',
    });
    navigate('/');
  };

  return (
    <div className="app">
      {state.currentStep !== 'welcome' && (
        <Navbar onReset={resetApp} />
      )}
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              state.currentStep === 'welcome' ? (
                <WelcomePage
                  onComplete={(user) => { updateState({ user, currentStep: 'subjects' }); navigate('/subjects'); }}
                />
              ) : (
                <Dashboard
                  state={state}
                  onUpdateState={updateState}
                />
              )
            }
          />
          <Route
            path="/subjects"
            element={
              <SubjectSetup
                subjects={state.subjects}
                onUpdateSubjects={(subjects) => updateState({ subjects })}
                onNext={() => { updateState({ currentStep: 'config' }); navigate('/config'); }}
                onBack={() => { updateState({ currentStep: 'welcome' }); navigate('/'); }}
              />
            }
          />
          <Route
            path="/config"
            element={
              <PlanConfig
                onComplete={(plan) => { updateState({ currentPlan: plan, currentStep: 'dashboard' }); navigate('/'); }}
                enabledSubjects={state.subjects.filter(s => s.enabled)}
                onBack={() => { updateState({ currentStep: 'subjects' }); navigate('/subjects'); }}
              />
            }
          />
          <Route
            path="/plan"
            element={
              <StudyPlan
                plan={state.currentPlan}
                subjects={state.subjects}
                onUpdateSessions={(sessions) => {
                  if (state.currentPlan) {
                    updateState({
                      currentPlan: { ...state.currentPlan, sessions }
                    });
                  }
                }}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;