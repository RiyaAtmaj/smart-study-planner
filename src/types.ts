export interface User {
  name: string;
  email: string;
  college: string;
}

export interface Topic {
  id: string;
  name: string;
  enabled: boolean;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  topics: Topic[];
  difficulty: number; // 1-5
  enabled: boolean;
}

export type SessionStatus = 'pending' | 'completed' | 'difficult' | 'missed';

export interface Session {
  id: string;
  subjectId: string;
  topicId: string;
  type: 'study' | 'revision';
  status: SessionStatus;
  duration: number; // minutes
  difficulty: number;
  day: number; // day number in the plan
  scheduledDate: Date;
  notes?: string;
  originalSessionId?: string; // for revision sessions
}

export interface StudyPlan {
  id: string;
  examDate: Date;
  duration: 7 | 30; // days
  sessions: Session[];
  createdAt: Date;
}

export interface AppState {
  user: User | null;
  subjects: Subject[];
  currentPlan: StudyPlan | null;
  currentStep: 'welcome' | 'subjects' | 'config' | 'dashboard';
}