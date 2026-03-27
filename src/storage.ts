import { AppState } from './types';

const STORAGE_KEY = 'studyai-planner-data';

export const saveToStorage = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = (): AppState | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      if (parsed.currentPlan) {
        parsed.currentPlan.examDate = new Date(parsed.currentPlan.examDate);
        parsed.currentPlan.createdAt = new Date(parsed.currentPlan.createdAt);
        parsed.currentPlan.sessions = parsed.currentPlan.sessions.map((session: any) => ({
          ...session,
          scheduledDate: new Date(session.scheduledDate),
        }));
      }
      // Set defaults for new fields
      if (!parsed.theme) parsed.theme = 'light';
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};