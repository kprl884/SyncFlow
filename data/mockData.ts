import type { User, Sprint, Task, Note, Workspace, Invitation } from '../types';

// Mock users with roles
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex@syncflow.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'Admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah@syncflow.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'Manager',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'user-3',
    name: 'Mike Rodriguez',
    email: 'mike@syncflow.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'Member',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    email: 'emily@syncflow.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'Member',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: 'user-5',
    name: 'David Kim',
    email: 'david@syncflow.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'Manager',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  }
];

// Mock workspaces
export const mockWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    name: 'SyncFlow Development',
    description: 'Main development workspace for SyncFlow project management tool',
    members: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3]],
    ownerId: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    jiraProjectKey: 'SYNC',
    bitbucketRepoSlug: 'syncflow',
    isPublic: false
  },
  {
    id: 'workspace-2',
    name: 'Mobile App Team',
    description: 'Mobile application development workspace',
    members: [mockUsers[1], mockUsers[4], mockUsers[2]],
    ownerId: 'user-2',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    jiraProjectKey: 'MOBILE',
    bitbucketRepoSlug: 'mobile-app',
    isPublic: false
  }
];

// Mock sprints with workspaceId
export const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Q1-1: Foundation',
    workspaceId: 'workspace-1',
    startDate: '2024-01-01',
    endDate: '2024-01-15',
    status: 'Completed',
    tasks: ['task-1', 'task-2', 'task-3'],
    velocity: 24,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'sprint-2',
    name: 'Q1-2: Core Features',
    workspaceId: 'workspace-1',
    startDate: '2024-01-16',
    endDate: '2024-01-31',
    status: 'Active',
    tasks: ['task-4', 'task-5', 'task-6'],
    velocity: 18,
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  },
  {
    id: 'sprint-3',
    name: 'Q1-3: Integration',
    workspaceId: 'workspace-1',
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    status: 'Planning',
    tasks: [],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  }
];

// Mock tasks with workspaceId instead of sprintId
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Setup project structure',
    description: 'Initialize the basic project structure with React and TypeScript',
    status: 'Done',
    assignee: mockUsers[0],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-1',
    storyPoints: 8,
    dependencies: [],
    team: 'Backend',
    tags: ['setup', 'foundation'],
    priority: 'High',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    jiraKey: 'SYNC-1'
  },
  {
    id: 'task-2',
    title: 'Implement authentication system',
    description: 'Create user authentication with Firebase Auth',
    status: 'Done',
    assignee: mockUsers[1],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-1',
    storyPoints: 13,
    dependencies: ['task-1'],
    team: 'Backend',
    tags: ['auth', 'security'],
    priority: 'High',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    jiraKey: 'SYNC-2'
  },
  {
    id: 'task-3',
    title: 'Design UI components',
    description: 'Create reusable UI components with Tailwind CSS',
    status: 'Done',
    assignee: mockUsers[2],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-1',
    storyPoints: 5,
    dependencies: [],
    team: 'Frontend',
    tags: ['ui', 'design'],
    priority: 'Medium',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    jiraKey: 'SYNC-3'
  },
  {
    id: 'task-4',
    title: 'Implement Kanban board',
    description: 'Create the main Kanban board with drag and drop functionality',
    status: 'In Progress',
    assignee: mockUsers[3],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-2',
    storyPoints: 21,
    dependencies: ['task-3'],
    team: 'Frontend',
    tags: ['kanban', 'board'],
    priority: 'High',
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    jiraKey: 'SYNC-4'
  },
  {
    id: 'task-5',
    title: 'Add task management',
    description: 'Implement task creation, editing, and deletion',
    status: 'In Progress',
    assignee: mockUsers[0],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-2',
    storyPoints: 13,
    dependencies: ['task-4'],
    team: 'Backend',
    tags: ['tasks', 'crud'],
    priority: 'High',
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-21T00:00:00Z',
    jiraKey: 'SYNC-5'
  },
  {
    id: 'task-6',
    title: 'Implement sprint planning',
    description: 'Create sprint planning and management features',
    status: 'Todo',
    assignee: mockUsers[1],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-2',
    storyPoints: 8,
    dependencies: ['task-5'],
    team: 'Backend',
    tags: ['sprints', 'planning'],
    priority: 'Medium',
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    jiraKey: 'SYNC-6'
  }
];

// Mock notes with workspaceId
export const mockNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Sprint Planning Notes - Q1-1',
    content: `Sprint Q1-1 completed successfully with all planned tasks delivered on time.

Key achievements:
- Project structure established
- Authentication system implemented
- UI component library created

Team velocity: 24 story points
Sprint retrospective scheduled for next week.`,
    workspaceId: 'workspace-1',
    authorId: 'user-1',
    authorName: 'Alex Johnson',
    tags: ['sprint', 'planning', 'retrospective'],
    category: 'Meeting',
    isPublic: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    relatedSprints: ['sprint-1'],
    relatedTasks: ['task-1', 'task-2', 'task-3']
  },
  {
    id: 'note-2',
    title: 'Technical Architecture Decisions',
    content: `Architecture decisions made for SyncFlow:

1. React 18 with TypeScript for type safety
2. Firebase for backend services (Auth, Firestore)
3. Tailwind CSS for styling
4. Vite for build tooling
5. Component-based architecture with hooks

This provides a solid foundation for scalability and maintainability.`,
    workspaceId: 'workspace-1',
    authorId: 'user-2',
    authorName: 'Sarah Chen',
    tags: ['architecture', 'technical', 'decisions'],
    category: 'Technical',
    isPublic: true,
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-10T14:00:00Z',
    relatedTasks: ['task-1', 'task-2']
  },
  {
    id: 'note-3',
    title: 'UI/UX Design Guidelines',
    content: `Design guidelines for SyncFlow:

- Use consistent spacing (4px grid system)
- Implement dark mode support
- Ensure accessibility compliance (WCAG 2.1 AA)
- Responsive design for all screen sizes
- Use Lucide React icons for consistency

Color palette: Primary blue (#3B82F6), Success green (#10B981), Warning yellow (#F59E0B), Error red (#EF4444)`,
    workspaceId: 'workspace-1',
    authorId: 'user-3',
    authorName: 'Mike Rodriguez',
    tags: ['design', 'ui', 'ux', 'guidelines'],
    category: 'Process',
    isPublic: true,
    createdAt: '2024-01-08T16:00:00Z',
    updatedAt: '2024-01-08T16:00:00Z',
    relatedTasks: ['task-3', 'task-4']
  }
];

// Mock invitations
export const mockInvitations: Invitation[] = [
  {
    id: 'inv-1',
    workspaceId: 'workspace-1',
    email: 'newuser@syncflow.com',
    role: 'Member',
    invitedBy: 'user-1',
    status: 'Pending',
    expiresAt: '2024-02-01T00:00:00Z',
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'inv-2',
    workspaceId: 'workspace-2',
    email: 'developer@syncflow.com',
    role: 'Manager',
    invitedBy: 'user-2',
    status: 'Accepted',
    expiresAt: '2024-01-25T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z'
  }
];