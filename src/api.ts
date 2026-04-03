import { AppState } from './types';

const API_BASE = '';

export const loadServerState = async (): Promise<AppState | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/state`);
    if (!response.ok) return null;
    return (await response.json()) as AppState;
  } catch {
    return null;
  }
};

export const clearServerState = async (): Promise<void> => {
  await fetch(`${API_BASE}/api/state`, { method: 'DELETE' });
};

export interface PlanHistoryEntry {
  id: number;
  user_id: number;
  plan_data: any;
  version: number;
  created_at: string;
  note: string | null;
}

export const getPlanHistory = async (): Promise<PlanHistoryEntry[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/history`);
    if (!response.ok) return [];
    return (await response.json()) as PlanHistoryEntry[];
  } catch {
    return [];
  }
};

export const saveServerState = async (_state: AppState): Promise<{ conflict?: boolean; serverState?: AppState; serverUpdatedAt?: string } | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(_state),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

export const getNotes = async () => {
  const response = await fetch(`${API_BASE}/api/notes`);
  return response.ok ? await response.json() : [];
};

export const createNote = async (note: { title: string; content: string; tags: string[] }) => {
  const response = await fetch(`${API_BASE}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  return response.ok ? await response.json() : null;
};

export const updateNote = async (id:string, note: { title:string; content:string; tags:string[] }) => {
  const response = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  return response.ok ? await response.json() : null;
};

export const deleteNoteApi = async (id:string) => {
  const response = await fetch(`${API_BASE}/api/notes/${id}`, { method: 'DELETE' });
  return response.ok;
};

export const getResources = async () => {
  const response = await fetch(`${API_BASE}/api/resources`);
  return response.ok ? await response.json() : [];
};
