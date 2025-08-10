
import type { TaskStatus, Team } from './types';

export const TASK_STATUSES: TaskStatus[] = ['Todo', 'In Progress', 'In Review', 'Done'];

export const TEAM_COLORS: Record<Team, string> = {
  Backend: 'bg-blue-200 text-blue-800',
  Frontend: 'bg-green-200 text-green-800',
  Mobile: 'bg-purple-200 text-purple-800',
  General: 'bg-gray-200 text-gray-800',
};

export const PRIORITY_COLORS: Record<string, string> = {
  High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};
