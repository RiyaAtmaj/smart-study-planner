import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AppState } from './types';
import { loadFromStorage, saveToStorage } from './storage';
import { SUBJECTS } from './data';
import AuthPage from './components/AuthPage';
import WelcomePage from './components/WelcomePage';
import SubjectSetup from './components/SubjectSetup';
import PlanConfig from './components/PlanConfig';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AITutorPage from './components/AITutorPage';
import GroupStudyPage from './components/GroupStudyPage';
import NotesPage from './components/NotesPage';
import Chatbot from './components/Chatbot';
import './App.css';

const Dashboard = React.lazy(() => import('./components/Dashboard'));
const StudyPlan = React.lazy(() => import('./components/StudyPlan'));
const ResourcesPage = React.lazy(() => import('./components/ResourcesPage'));

function AppContent() {
  const navigate = useNavigate();
  const [state, setState] = useState<AppState>({
    user: null,
    token: undefined,
    subjects: SUBJECTS,
    currentPlan: null,
    currentStep: 'auth',
    theme: 'light',
  });

  const setAuthToken = (token: string | undefined) => {
    if (token) {
      localStorage.setItem('studyai-planner-token', token);
    } else {
      localStorage.removeItem('studyai-planner-token');
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = loadFromStorage();
    if (savedState) {
      setState(savedState);
      if (savedState.token) setAuthToken(savedState.token);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
    if (state.token) setAuthToken(state.token);
  }, [state]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    updateState({ theme: state.theme === 'light' ? 'dark' : 'light' });
  };

  const resetApp = () => {
    setState({
      user: null,
      token: undefined,
      subjects: SUBJECTS,
      currentPlan: null,
      currentStep: 'auth',
      theme: 'light',
    });
    setAuthToken(undefined);
    navigate('/');
  };

  return (
    <div className="app">
      {state.currentStep !== 'welcome' && state.currentStep !== 'auth' && (
        <Navbar onReset={resetApp} onToggleTheme={toggleTheme} theme={state.theme} />
      )}
      <main className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
          <Route
            path="/"
            element={
              state.currentStep === 'auth' ? (
                <AuthPage
                  onAuthSuccess={(user, token) => {
                    updateState({ user, token, currentStep: 'home' });
                    navigate('/');
                  }}
                />
              ) : state.currentStep === 'welcome' ? (
                <WelcomePage
                  onComplete={(user) => { updateState({ user, currentStep: 'subjects' }); navigate('/subjects'); }}
                />
              ) : state.currentStep === 'home' ? (
                <HomePage />
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
                    updateState({ currentPlan: { ...state.currentPlan, sessions } });
                  }
                }}
              />
            }
          />
          <Route
            path="/resources"
            element={<ResourcesPage />}
          />
          <Route
            path="/ai-tutor"
            element={<AITutorPage />}
          />
          <Route
            path="/group-study"
            element={<GroupStudyPage />}
          />
          <Route
            path="/notes"
            element={<NotesPage />}
          />
        </Routes>
        </Suspense>
      </main>
      <Chatbot />
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