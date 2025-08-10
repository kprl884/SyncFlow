import type { User, Sprint, Task } from '../types';

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/id/1005/200/200' },
  { id: 'user-2', name: 'Maria Garcia', avatarUrl: 'https://picsum.photos/id/1012/200/200' },
  { id: 'user-3', name: 'James Smith', avatarUrl: 'https://picsum.photos/id/1027/200/200' },
  { id: 'user-4', name: 'Priya Patel' },
];

export const mockSprints: Sprint[] = [
  { id: 'sprint-0', name: 'Foundation (Q2-3)', startDate: '2024-06-03T00:00:00Z', endDate: '2024-06-16T23:59:59Z' },
  { id: 'sprint-1', name: 'Phoenix Rising (Q3-1)', startDate: '2024-07-01T00:00:00Z', endDate: '2024-07-14T23:59:59Z' },
  { id: 'sprint-2', name: 'Dragonfly (Q3-2)', startDate: '2024-07-15T00:00:00Z', endDate: '2024-07-28T23:59:59Z' },
];

export const mockTasks: Task[] = [
  // Sprint 0
  {
    id: 'task-s0-1',
    title: 'Project Scaffolding',
    status: 'Done',
    assignee: mockUsers[0],
    sprintId: 'sprint-0',
    storyPoints: 3,
    dependencies: [],
    team: 'General',
    completedAt: '2024-06-05T10:00:00Z'
  },
  {
    id: 'task-s0-2',
    title: 'Setup Linter and Formatter',
    status: 'Done',
    assignee: mockUsers[1],
    sprintId: 'sprint-0',
    storyPoints: 2,
    dependencies: ['task-s0-1'],
    team: 'Frontend',
    completedAt: '2024-06-07T14:00:00Z'
  },
  {
    id: 'task-s0-3',
    title: 'Initial Backend Service Setup',
    status: 'Done',
    assignee: mockUsers[2],
    sprintId: 'sprint-0',
    storyPoints: 5,
    dependencies: ['task-s0-1'],
    team: 'Backend',
    completedAt: '2024-06-10T11:00:00Z'
  },
  
  // Sprint 1
  {
    id: 'task-1',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    status: 'Done',
    assignee: mockUsers[2],
    sprintId: 'sprint-1',
    storyPoints: 5,
    dependencies: [],
    team: 'General',
    tags: ['devops', 'automation'],
    completedAt: '2024-07-05T16:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Develop User Authentication API',
    description: 'Create endpoints for user registration, login, and token management.',
    status: 'In Review',
    assignee: mockUsers[0],
    sprintId: 'sprint-1',
    storyPoints: 8,
    dependencies: ['task-1'],
    team: 'Backend',
    tags: ['api', 'security']
  },
  {
    id: 'task-3',
    title: 'Design Login & Registration Pages',
    description: 'Create wireframes and final designs for the user auth flow.',
    status: 'Done',
    assignee: mockUsers[3],
    sprintId: 'sprint-1',
    storyPoints: 3,
    dependencies: [],
    team: 'General',
    tags: ['ui', 'design'],
    completedAt: '2024-07-08T12:00:00Z'
  },
  {
    id: 'task-6',
    title: 'Setup Database Schema',
    description: 'Define and migrate the initial database schema for tasks and users.',
    status: 'Done',
    assignee: mockUsers[0],
    sprintId: 'sprint-1',
    storyPoints: 5,
    dependencies: [],
    team: 'Backend',
    tags: ['database'],
    completedAt: '2024-07-03T18:00:00Z'
  },

  // Sprint 2
  {
    id: 'task-4',
    title: 'Implement Frontend Login UI',
    description: 'Build the React components for the login and registration forms.',
    status: 'In Progress',
    assignee: mockUsers[1],
    sprintId: 'sprint-2',
    storyPoints: 5,
    dependencies: ['task-3'],
    team: 'Frontend',
    tags: ['ui', 'react']
  },
  {
    id: 'task-5',
    title: 'Connect Login UI to Backend API',
    description: 'Integrate the authentication API with the frontend components.',
    status: 'Todo',
    assignee: mockUsers[1],
    sprintId: 'sprint-2',
    storyPoints: 3,
    dependencies: ['task-2', 'task-4'],
    team: 'Frontend',
    tags: ['integration']
  },
  {
    id: 'task-7',
    title: 'Develop Mobile Splash Screen',
    status: 'In Progress',
    assignee: mockUsers[2],
    sprintId: 'sprint-2',
    storyPoints: 2,
    dependencies: [],
    team: 'Mobile',
    tags: ['ui', 'mobile']
  },
  {
    id: 'task-8',
    title: 'API for fetching Kanban board tasks',
    description: 'Create a new GET endpoint to supply all tasks for the board view.',
    status: 'In Progress',
    assignee: mockUsers[0],
    sprintId: 'sprint-2',
    storyPoints: 5,
    dependencies: ['task-6'],
    team: 'Backend',
    tags: ['api']
  },
   {
    id: 'task-9',
    title: 'Refactor state management on Frontend',
    description: 'Move from local state to a more robust solution if needed.',
    status: 'Todo',
    sprintId: 'sprint-2',
    storyPoints: 8,
    dependencies: [],
    team: 'Frontend',
    tags: ['refactor', 'architecture']
  },
  {
    id: 'task-10',
    title: 'End-to-end tests for user flow',
    status: 'Todo',
    assignee: mockUsers[3],
    sprintId: 'sprint-2',
    storyPoints: 5,
    dependencies: ['task-5'],
    team: 'General',
    tags: ['testing', 'e2e']
  },
];