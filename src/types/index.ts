// Core user and authentication types
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole; // 'Admin', 'Manager', 'Member'
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'Admin' | 'Manager' | 'Member';
export type TaskStatus = 'Todo' | 'In Progress' | 'In Review' | 'Done';

// Workspace management
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  members: User[];
  ownerId: string; // ID of the user who created the workspace
  createdAt: string;
  updatedAt: string;
  // Optional: Link to an external project
  jiraProjectKey?: string;
  bitbucketRepoSlug?: string;
  isPublic: boolean; // Whether the workspace is publicly accessible
}

// Task management
export interface Task {
  id: string; // This can be the original Jira ID, e.g., 'KAN-13'
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: User;
  workspaceId: string; // Instead of sprintId
  sprintId?: string; // Optional: can still be linked to a sprint
  storyPoints?: number;
  dependencies: string[]; // Array of Task IDs
  team: 'Backend' | 'Frontend' | 'Mobile' | 'General';
  tags?: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
  updatedAt: string;
  // Jira integration fields
  jiraKey?: string;
  jiraStatus?: string;
  jiraAssignee?: string;
}

// Sprint management
export interface Sprint {
  id: string;
  name: string;
  workspaceId: string; // Add workspaceId
  startDate: string;
  endDate: string;
  status: 'Planning' | 'Active' | 'Completed';
  tasks: string[]; // Array of Task IDs
  velocity?: number;
  createdAt: string;
  updatedAt: string;
}

// Notes system
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

// Invitation system
export interface Invitation {
  id: string;
  workspaceId: string;
  email: string;
  role: UserRole;
  invitedBy: string; // User ID
  status: 'Pending' | 'Accepted' | 'Expired';
  expiresAt: string;
  createdAt: string;
}

// Jira integration types
export interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    description?: string;
    status: {
      name: string;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
    };
    customfield_10016?: number; // Story Points
    issuelinks?: Array<{
      type: {
        name: string;
      };
      outwardIssue?: {
        key: string;
      };
      inwardIssue?: {
        key: string;
      };
    }>;
  };
}

// Bitbucket integration types
export interface BitbucketUser {
  username: string;
  display_name: string;
  email: string;
  avatar_url: string;
}

export interface BitbucketRepo {
  slug: string;
  name: string;
  description?: string;
  workspace: {
    slug: string;
    name: string;
  };
}
