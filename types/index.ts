export interface User {
  id: string;
  name: string;
  email?: string; // User's email address
  avatarUrl?: string; // URL to the user's image
}

export type TaskStatus = string; // Now flexible to support any column name

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
  priority?: 'Low' | 'Medium' | 'High';
  completedAt?: string; // ISO Date String
  workspaceId: string; // Added workspace reference
  isBlocked?: boolean; // New field for blocker system
  blockerCategory?: 'Technical Dependency' | 'Needs Product Clarification' | 'Missing Asset/API' | 'External Issue';
  blockerDescription?: string;
  blockerAssignee?: string; // userId of assigned person
  // SP Advisor için yeni alanlar
  technicalComplexity?: {
    apiImpact: number;
    uiImpact: number;
    databaseImpact: boolean;
  };
  uncertainty?: 'low' | 'medium' | 'high';
  domains?: string[]; // ['frontend', 'backend', 'database', 'cicd', 'design', 'qa', 'devops', 'mobile', 'infrastructure', 'monitoring', 'testing', 'deployment', 'performance', 'security', 'notifications', 'state', 'api', 'ui', 'documentation', 'automation']
  createdAt?: string; // ISO Date String
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

// ===== RETROSPECTIVE SYSTEM TYPES =====

export type RetroPhase = 'brainstorming' | 'voting' | 'discussion' | 'actionPlanning' | 'completed';

export type RetroCategory = 'whatWentWell' | 'whatCouldImprove' | 'actionItems' | 'custom';

export interface RetroTemplate {
  id: string;
  name: string;
  description: string;
  categories: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  defaultSettings?: Partial<RetroSessionSettings>;
}

export interface RetroSessionSettings {
  allowAnonymous: boolean;
  allowPrivateNotes: boolean;
  enableVoting: boolean;
  maxVotesPerUser: number;
  timerEnabled: boolean;
  phaseDurations: {
    brainstorming: number;
    voting: number;
    discussion: number;
    actionPlanning: number;
    completed: number;
  };
  enableGrouping: boolean;
  autoAdvancePhases: boolean;
}

export interface RetroNote {
  id: string;
  sessionId: string;
  content: string;
  category: RetroCategory;
  customCategory?: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  isPrivate: boolean;
  votes: number;
  votedBy: string[]; // Array of user IDs who voted
  createdAt: string;
  updatedAt: string;
  position?: { x: number; y: number };
  groupId?: string;
}

export interface RetroActionItem {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface RetroSession {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  facilitatorId: string;
  facilitatorName: string;
  participants: RetroParticipant[];
  template: RetroTemplate | string;
  status: 'draft' | 'active' | 'completed';
  currentPhase: RetroPhase;
  notes: RetroNote[];
  actionItems: RetroActionItem[];
  settings: RetroSessionSettings;
  duration: number; // in minutes
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface RetroParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'facilitator' | 'participant' | 'observer';
  joinedAt: string;
  lastActivity: string;
  isOnline: boolean;
  permissions: {
    canAddNotes: boolean;
    canVote: boolean;
    canEditNotes: boolean;
    canDeleteNotes: boolean;
    canManageSession: boolean;
  };
}
