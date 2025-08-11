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
  },
  {
    id: 'user-6',
    name: 'Lisa Wang',
    email: 'lisa@syncflow.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    role: 'Member',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  }
];

// Mock workspaces
export const mockWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    name: 'SyncFlow Development',
    description: 'Main development workspace for SyncFlow project management tool',
    members: {
      'user-1': 'Admin',
      'user-2': 'Member',
      'user-3': 'Member',
      'user-4': 'Member'
    },
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
    members: {
      'user-2': 'Admin',
      'user-5': 'Member',
      'user-3': 'Member'
    },
    ownerId: 'user-2',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    jiraProjectKey: 'MOBILE',
    bitbucketRepoSlug: 'mobile-app',
    isPublic: false
  },
  {
    id: 'workspace-3',
    name: 'DevOps & Infrastructure',
    description: 'DevOps, CI/CD, and infrastructure management workspace',
    members: {
      'user-1': 'Admin',
      'user-5': 'Member',
      'user-4': 'Member',
      'user-6': 'Member'
    },
    ownerId: 'user-1',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    jiraProjectKey: 'DEVOPS',
    bitbucketRepoSlug: 'devops-infra',
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
    tasks: ['task-7', 'task-8', 'task-9', 'task-10', 'task-11', 'task-12'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'sprint-4',
    name: 'Q1-4: Testing & Polish',
    workspaceId: 'workspace-1',
    startDate: '2024-02-16',
    endDate: '2024-02-29',
    status: 'Planning',
    tasks: ['task-13', 'task-14', 'task-15', 'task-16'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'sprint-5',
    name: 'Mobile App - Phase 1',
    workspaceId: 'workspace-2',
    startDate: '2024-01-20',
    endDate: '2024-02-03',
    status: 'Active',
    tasks: ['task-17', 'task-18', 'task-19', 'task-20', 'task-21', 'task-22'],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'sprint-6',
    name: 'Mobile App - Phase 2',
    workspaceId: 'workspace-2',
    startDate: '2024-02-04',
    endDate: '2024-02-17',
    status: 'Planning',
    tasks: ['task-23', 'task-24', 'task-25'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'sprint-7',
    name: 'DevOps - Infrastructure Setup',
    workspaceId: 'workspace-3',
    startDate: '2024-01-25',
    endDate: '2024-02-07',
    status: 'Active',
    tasks: ['task-26', 'task-27', 'task-28'],
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
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
    jiraKey: 'SYNC-1',
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 2,
      databaseImpact: false
    },
    uncertainty: 'low',
    domains: ['frontend', 'backend'],
    completedAt: '2024-01-05T00:00:00Z'
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
    jiraKey: 'SYNC-2',
    technicalComplexity: {
      apiImpact: 3,
      uiImpact: 1,
      databaseImpact: true
    },
    uncertainty: 'medium',
    domains: ['backend', 'database', 'frontend'],
    completedAt: '2024-01-10T00:00:00Z'
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
    jiraKey: 'SYNC-3',
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 8,
      databaseImpact: false
    },
    uncertainty: 'low',
    domains: ['frontend', 'design'],
    completedAt: '2024-01-12T00:00:00Z'
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
    jiraKey: 'SYNC-4',
    technicalComplexity: {
      apiImpact: 2,
      uiImpact: 8,
      databaseImpact: false
    },
    uncertainty: 'medium',
    domains: ['frontend', 'ui']
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
    jiraKey: 'SYNC-5',
    technicalComplexity: {
      apiImpact: 5,
      uiImpact: 3,
      databaseImpact: true
    },
    uncertainty: 'low',
    domains: ['backend', 'database', 'frontend']
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
    jiraKey: 'SYNC-6',
    technicalComplexity: {
      apiImpact: 3,
      uiImpact: 2,
      databaseImpact: true
    },
    uncertainty: 'medium',
    domains: ['backend', 'database', 'frontend']
  },
  {
    id: 'task-7',
    title: 'Database schema design',
    description: 'Design and implement the database schema for tasks, sprints, and users',
    status: 'Todo',
    assignee: mockUsers[4],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-3',
    storyPoints: 13,
    dependencies: [],
    team: 'Backend',
    tags: ['database', 'schema', 'design'],
    priority: 'High',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    jiraKey: 'SYNC-7',
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 0,
      databaseImpact: true
    },
    uncertainty: 'low',
    domains: ['database', 'backend']
  },
  {
    id: 'task-8',
    title: 'API endpoint development',
    description: 'Create RESTful API endpoints for all CRUD operations',
    status: 'Todo',
    assignee: mockUsers[0],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-3',
    storyPoints: 21,
    dependencies: ['task-7'],
    team: 'Backend',
    tags: ['api', 'endpoints', 'rest'],
    priority: 'High',
    createdAt: '2024-01-26T00:00:00Z',
    updatedAt: '2024-01-26T00:00:00Z',
    jiraKey: 'SYNC-8',
    technicalComplexity: {
      apiImpact: 8,
      uiImpact: 0,
      databaseImpact: true
    },
    uncertainty: 'medium',
    domains: ['backend', 'api', 'database']
  },
  {
    id: 'task-9',
    title: 'Frontend state management',
    description: 'Implement state management solution with React Context or Redux',
    status: 'Todo',
    assignee: mockUsers[2],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-3',
    storyPoints: 8,
    dependencies: ['task-8'],
    team: 'Frontend',
    tags: ['state', 'management', 'react'],
    priority: 'Medium',
    createdAt: '2024-01-27T00:00:00Z',
    updatedAt: '2024-01-27T00:00:00Z',
    jiraKey: 'SYNC-9',
    technicalComplexity: {
      apiImpact: 1,
      uiImpact: 4,
      databaseImpact: false
    },
    uncertainty: 'low',
    domains: ['frontend', 'state']
  },
  {
    id: 'task-10',
    title: 'User permission system',
    description: 'Implement role-based access control and user permissions',
    status: 'Todo',
    assignee: mockUsers[1],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-3',
    storyPoints: 13,
    dependencies: ['task-8'],
    team: 'Backend',
    tags: ['permissions', 'security', 'rbac'],
    priority: 'Medium',
    createdAt: '2024-01-28T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z',
    jiraKey: 'SYNC-10',
    technicalComplexity: {
      apiImpact: 4,
      uiImpact: 2,
      databaseImpact: true
    },
    uncertainty: 'medium',
    domains: ['backend', 'security', 'database']
  },
  {
    id: 'task-11',
    title: 'Real-time notifications',
    description: 'Implement WebSocket-based real-time notifications for task updates',
    status: 'Todo',
    assignee: mockUsers[3],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-3',
    storyPoints: 21,
    dependencies: ['task-8', 'task-9'],
    team: 'Frontend',
    tags: ['websockets', 'notifications', 'realtime'],
    priority: 'Low',
    createdAt: '2024-01-29T00:00:00Z',
    updatedAt: '2024-01-29T00:00:00Z',
    jiraKey: 'SYNC-11',
    technicalComplexity: {
      apiImpact: 3,
      uiImpact: 5,
      databaseImpact: false
    },
    uncertainty: 'high',
    domains: ['frontend', 'backend', 'websockets']
  },
  {
    id: 'task-12',
    title: 'Performance optimization',
    description: 'Optimize application performance with lazy loading and caching',
    status: 'Todo',
    assignee: mockUsers[4],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-3',
    storyPoints: 8,
    dependencies: ['task-9'],
    team: 'Frontend',
    tags: ['performance', 'optimization', 'caching'],
    priority: 'Low',
    createdAt: '2024-01-30T00:00:00Z',
    updatedAt: '2024-01-30T00:00:00Z',
    jiraKey: 'SYNC-12',
    technicalComplexity: {
      apiImpact: 1,
      uiImpact: 3,
      databaseImpact: false
    },
    uncertainty: 'medium',
    domains: ['frontend', 'performance']
  },
  {
    id: 'task-13',
    title: 'Unit testing implementation',
    description: 'Write comprehensive unit tests for all components and functions',
    status: 'Todo',
    assignee: mockUsers[2],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-4',
    storyPoints: 13,
    dependencies: ['task-8', 'task-9'],
    team: 'Frontend',
    tags: ['testing', 'unit', 'quality'],
    priority: 'Medium',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    jiraKey: 'SYNC-13',
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 2,
      databaseImpact: false
    },
    uncertainty: 'low',
    domains: ['frontend', 'testing']
  },
  {
    id: 'task-14',
    title: 'Integration testing',
    description: 'Implement end-to-end testing for critical user workflows',
    status: 'Todo',
    assignee: mockUsers[4],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-4',
    storyPoints: 21,
    dependencies: ['task-13'],
    team: 'General',
    tags: ['testing', 'integration', 'e2e'],
    priority: 'Medium',
    createdAt: '2024-02-02T00:00:00Z',
    updatedAt: '2024-02-02T00:00:00Z',
    jiraKey: 'SYNC-14',
    technicalComplexity: {
      apiImpact: 3,
      uiImpact: 4,
      databaseImpact: true
    },
    uncertainty: 'medium',
    domains: ['testing', 'frontend', 'backend', 'database']
  },
  {
    id: 'task-15',
    title: 'Performance monitoring',
    description: 'Implement performance monitoring and analytics tools',
    status: 'Todo',
    assignee: mockUsers[0],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-4',
    storyPoints: 8,
    dependencies: ['task-12'],
    team: 'Backend',
    tags: ['monitoring', 'performance', 'analytics'],
    priority: 'Low',
    createdAt: '2024-02-03T00:00:00Z',
    updatedAt: '2024-02-03T00:00:00Z',
    jiraKey: 'SYNC-15',
    technicalComplexity: {
      apiImpact: 2,
      uiImpact: 1,
      databaseImpact: false
    },
    uncertainty: 'low',
    domains: ['backend', 'monitoring']
  },
  {
    id: 'task-16',
    title: 'Documentation and deployment',
    description: 'Create comprehensive documentation and prepare for production deployment',
    status: 'Todo',
    assignee: mockUsers[1],
    workspaceId: 'workspace-1',
    sprintId: 'sprint-4',
    storyPoints: 5,
    dependencies: ['task-14', 'task-15'],
    team: 'General',
    tags: ['documentation', 'deployment', 'production'],
    priority: 'Medium',
    createdAt: '2024-02-04T00:00:00Z',
    updatedAt: '2024-02-04T00:00:00Z',
    jiraKey: 'SYNC-16',
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 0,
      databaseImpact: false
    },
    uncertainty: 'low',
    domains: ['documentation', 'deployment']
  },
  {
    id: 'task-17',
    title: 'Mobile app architecture setup',
    description: 'Set up React Native project structure with TypeScript and navigation',
    status: 'In Progress',
    assignee: mockUsers[4],
    workspaceId: 'workspace-2',
    sprintId: 'sprint-5',
    storyPoints: 13,
    dependencies: [],
    team: 'Mobile',
    tags: ['mobile', 'setup', 'architecture'],
    priority: 'High',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    jiraKey: 'MOBILE-1',
    technicalComplexity: {
      apiImpact: 1,
      uiImpact: 3,
      databaseImpact: false
    },
    uncertainty: 'low',
    domains: ['mobile', 'frontend']
  },
  {
    id: 'task-18',
    title: 'Native navigation implementation',
    description: 'Implement React Navigation with stack and tab navigators',
    status: 'In Progress',
    assignee: mockUsers[2],
    workspaceId: 'workspace-2',
    sprintId: 'sprint-5',
    storyPoints: 8,
    dependencies: ['task-17'],
    team: 'Mobile',
    tags: ['mobile', 'navigation', 'ui'],
    priority: 'Medium',
    createdAt: '2024-01-21T00:00:00Z',
    updatedAt: '2024-01-26T00:00:00Z',
    jiraKey: 'MOBILE-2',
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 5,
      databaseImpact: false
    },
    uncertainty: 'low',
    domains: ['mobile', 'ui']
  },
  {
    id: 'task-19',
    title: 'API integration for mobile',
    description: 'Create mobile-specific API client and integrate with backend services',
    status: 'Todo',
    assignee: mockUsers[1],
    workspaceId: 'workspace-2',
    sprintId: 'sprint-5',
    storyPoints: 13,
    dependencies: ['task-17'],
    team: 'Mobile',
    tags: ['mobile', 'api', 'integration'],
    priority: 'High',
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
    jiraKey: 'MOBILE-3',
    technicalComplexity: {
      apiImpact: 6,
      uiImpact: 1,
      databaseImpact: false
    },
    uncertainty: 'medium',
    domains: ['mobile', 'api', 'backend']
  },
  {
    id: 'task-20',
    title: 'Offline data synchronization',
    description: 'Implement offline-first approach with data sync when connection is restored',
    status: 'Todo',
    assignee: mockUsers[4],
    workspaceId: 'workspace-2',
    sprintId: 'sprint-5',
    storyPoints: 21,
    dependencies: ['task-19'],
    team: 'Mobile',
    tags: ['mobile', 'offline', 'sync'],
    priority: 'Medium',
    createdAt: '2024-01-23T00:00:00Z',
    updatedAt: '2024-01-23T00:00:00Z',
    jiraKey: 'MOBILE-4',
    technicalComplexity: {
      apiImpact: 4,
      uiImpact: 2,
      databaseImpact: true
    },
    uncertainty: 'high',
    domains: ['mobile', 'database', 'api']
  },
  {
    id: 'task-21',
    title: 'Push notification system',
    description: 'Implement push notifications for task updates and reminders',
    status: 'Todo',
    assignee: mockUsers[2],
    workspaceId: 'workspace-2',
    sprintId: 'sprint-5',
    storyPoints: 13,
    dependencies: ['task-19'],
    team: 'Mobile',
    tags: ['mobile', 'notifications', 'push'],
    priority: 'Low',
    createdAt: '2024-01-24T00:00:00Z',
    updatedAt: '2024-01-24T00:00:00Z',
    jiraKey: 'MOBILE-5',
    technicalComplexity: {
      apiImpact: 3,
      uiImpact: 1,
      databaseImpact: false
    },
    uncertainty: 'medium',
    domains: ['mobile', 'notifications']
  },
  {
    id: 'task-22',
    title: 'Mobile UI component library',
    description: 'Create reusable mobile UI components with consistent design',
    status: 'Todo',
    assignee: mockUsers[1],
    workspaceId: 'workspace-2',
    sprintId: 'sprint-5',
    storyPoints: 8,
    dependencies: ['task-18'],
    team: 'Mobile',
    tags: ['mobile', 'ui', 'components'],
    priority: 'Medium',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    jiraKey: 'MOBILE-6',
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 6,
      databaseImpact: false
    },
    uncertainty: 'low',
    domains: ['mobile', 'ui', 'design']
  },
  {
    id: 'task-23',
    title: 'Mobile app testing',
    description: 'Implement comprehensive testing for mobile app including unit and integration tests',
    status: 'Todo',
    assignee: mockUsers[4],
    workspaceId: 'workspace-2',
    sprintId: 'sprint-6',
    storyPoints: 13,
    dependencies: ['task-22'],
    team: 'Mobile',
    tags: ['mobile', 'testing', 'quality'],
    priority: 'Medium',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    jiraKey: 'MOBILE-7',
    technicalComplexity: {
      apiImpact: 1,
      uiImpact: 3,
      databaseImpact: false
    },
    uncertainty: 'low',
    domains: ['mobile', 'testing']
  },
  {
    id: 'task-24',
    title: 'Performance optimization for mobile',
    description: 'Optimize mobile app performance including memory usage and battery optimization',
    status: 'Todo',
    assignee: mockUsers[2],
    workspaceId: 'workspace-2',
    sprintId: 'sprint-6',
    storyPoints: 8,
    dependencies: ['task-23'],
    team: 'Mobile',
    tags: ['mobile', 'performance', 'optimization'],
    priority: 'Low',
    createdAt: '2024-02-02T00:00:00Z',
    updatedAt: '2024-02-02T00:00:00Z',
    jiraKey: 'MOBILE-8',
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 2,
      databaseImpact: false
    },
    uncertainty: 'medium',
    domains: ['mobile', 'performance']
  },
  {
    id: 'task-25',
    title: 'App store preparation',
    description: 'Prepare mobile app for app store submission including metadata and screenshots',
    status: 'Todo',
    assignee: mockUsers[1],
    workspaceId: 'workspace-2',
    sprintId: 'sprint-6',
    storyPoints: 5,
    dependencies: ['task-24'],
    team: 'Mobile',
    tags: ['mobile', 'deployment', 'app-store'],
    priority: 'Medium',
    createdAt: '2024-02-03T00:00:00Z',
    updatedAt: '2024-02-03T00:00:00Z',
    jiraKey: 'MOBILE-9',
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 1,
      databaseImpact: false
    },
    uncertainty: 'low',
    domains: ['mobile', 'deployment']
  },
  {
    id: 'task-26',
    title: 'CI/CD pipeline setup',
    description: 'Set up automated CI/CD pipeline with GitHub Actions and deployment automation',
    status: 'In Progress',
    assignee: mockUsers[0],
    workspaceId: 'workspace-3',
    sprintId: 'sprint-7',
    storyPoints: 13,
    dependencies: [],
    team: 'General',
    tags: ['devops', 'ci-cd', 'automation'],
    priority: 'High',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z',
    jiraKey: 'DEVOPS-1',
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 0,
      databaseImpact: false
    },
    uncertainty: 'medium',
    domains: ['devops', 'automation']
  },
  {
    id: 'task-27',
    title: 'Infrastructure as Code',
    description: 'Implement infrastructure as code using Terraform for cloud resources',
    status: 'In Progress',
    assignee: mockUsers[4],
    workspaceId: 'workspace-3',
    sprintId: 'sprint-7',
    storyPoints: 21,
    dependencies: ['task-26'],
    team: 'General',
    tags: ['devops', 'terraform', 'infrastructure'],
    priority: 'High',
    createdAt: '2024-01-26T00:00:00Z',
    updatedAt: '2024-01-29T00:00:00Z',
    jiraKey: 'DEVOPS-2',
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 0,
      databaseImpact: false
    },
    uncertainty: 'high',
    domains: ['devops', 'infrastructure']
  },
  {
    id: 'task-28',
    title: 'Monitoring and logging setup',
    description: 'Set up comprehensive monitoring and logging with Prometheus and ELK stack',
    status: 'Todo',
    assignee: mockUsers[5],
    workspaceId: 'workspace-3',
    sprintId: 'sprint-7',
    storyPoints: 13,
    dependencies: ['task-27'],
    team: 'General',
    tags: ['devops', 'monitoring', 'logging'],
    priority: 'Medium',
    createdAt: '2024-01-27T00:00:00Z',
    updatedAt: '2024-01-27T00:00:00Z',
    jiraKey: 'DEVOPS-3',
    technicalComplexity: {
      apiImpact: 1,
      uiImpact: 0,
      databaseImpact: false
    },
    uncertainty: 'medium',
    domains: ['devops', 'monitoring']
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
  },
  {
    id: 'note-4',
    title: 'DevOps Strategy and Tools',
    content: `DevOps strategy for SyncFlow project:

Infrastructure Tools:
- Terraform for infrastructure as code
- GitHub Actions for CI/CD
- Docker for containerization
- Kubernetes for orchestration (future)

Monitoring Stack:
- Prometheus for metrics collection
- Grafana for visualization
- ELK stack for logging
- AlertManager for notifications

Best Practices:
- Infrastructure as code
- Automated testing in pipeline
- Blue-green deployments
- Comprehensive monitoring`,
    workspaceId: 'workspace-3',
    authorId: 'user-1',
    authorName: 'Alex Johnson',
    tags: ['devops', 'strategy', 'tools', 'infrastructure'],
    category: 'Technical',
    isPublic: true,
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-01-25T09:00:00Z',
    relatedTasks: ['task-26', 'task-27', 'task-28']
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
  },
  {
    id: 'inv-3',
    workspaceId: 'workspace-3',
    email: 'devops@syncflow.com',
    role: 'Member',
    invitedBy: 'user-1',
    status: 'Pending',
    expiresAt: '2024-02-10T00:00:00Z',
    createdAt: '2024-01-28T00:00:00Z'
  }
];