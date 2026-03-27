import { AppState } from './types';

export const loadServerState = async (): Promise<AppState | null> => {
  // Return null to use localStorage only
  return null;
};



export const clearServerState = async (): Promise<void> => {
  // No-op since we're not using server
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
  // Return empty array since we're not using server
  return [];
};

export const saveServerState = async (_state: AppState): Promise<{ conflict?: boolean; serverState?: AppState; serverUpdatedAt?: string } | null> => {
  // No-op since we're not using server
  return null;
};
