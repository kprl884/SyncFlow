export interface User {
  id: string;
  name: string;
  avatarUrl?: string; // URL to the user's image
}

export type TaskStatus = 'Todo' | 'In Progress' | 'In Review' | 'Done';

export type Team = 'Backend' | 'Frontend' | 'Mobile' | 'General';

export type UserRole = 'Admin' | 'Member';

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: Record<string, UserRole>; // userId -> role mapping
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: User;
  sprintId: string;
  storyPoints?: number;
  dependencies: string[]; // Array of Task IDs this task is blocked by
  team: Team;
  tags?: string[];
  completedAt?: string; // ISO Date String
  workspaceId: string; // Added workspace reference
  isBlocked?: boolean; // New field for blocker system
  blockerCategory?: 'Technical Dependency' | 'Needs Product Clarification' | 'Missing Asset/API' | 'External Issue';
  blockerDescription?: string;
  blockerAssignee?: string; // userId of assigned person
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string; // ISO Date String
  endDate: string; // ISO Date String
  workspaceId: string; // Added workspace reference
  sprintGoal: string; // Added sprint goal
}

export interface DailyLog {
  id: string;
  date: string; // ISO Date String
  workspaceId: string;
  participants: {
    userId: string;
    contributionYesterday: string;
    planToday: string;
    impediments: string;
  }[];
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  workspaceId: string;
  authorId: string;
  authorName: string;
  tags: string[];
  category: 'General' | 'Meeting' | 'Technical' | 'Process' | 'Ideas';
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  attachments?: string[]; // Array of file URLs
  relatedTasks?: string[]; // Array of Task IDs
  relatedSprints?: string[]; // Array of Sprint IDs
}

export interface NoteComment {
  id: string;
  noteId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}