
import type { TaskStatus, Team } from './types';

export const TASK_STATUSES: TaskStatus[] = ['Todo', 'In Progress', 'In Review', 'Done'];

export const TEAM_COLORS: Record<Team, string> = {
  Backend: 'bg-blue-200 text-blue-800',
  Frontend: 'bg-green-200 text-green-800',
  Mobile: 'bg-purple-200 text-purple-800',
  General: 'bg-gray-200 text-gray-800',
};
