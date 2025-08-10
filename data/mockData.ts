import type { User, Sprint, Task, Note } from '../types';

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

export const mockNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Sprint Planning Notları - Q3-1',
    content: `Bu sprint'te backend API geliştirmelerine odaklanacağız. 

Öncelikli konular:
- Authentication sistemi geliştirme
- User management modülleri
- Database schema optimizasyonu
- API endpoint'lerin test edilmesi

Takım üyeleri:
- Alex: Backend API geliştirme
- Maria: Frontend entegrasyon
- James: DevOps ve CI/CD
- Priya: UI/UX tasarım

Sprint hedefi: Temel authentication flow'un tamamlanması ve test edilmesi.`,
    workspaceId: 'workspace-1',
    authorId: 'user-1',
    authorName: 'Alex Johnson',
    tags: ['sprint', 'backend', 'planning', 'authentication'],
    category: 'Meeting',
    isPublic: true,
    createdAt: '2024-07-01T09:00:00Z',
    updatedAt: '2024-07-01T09:00:00Z',
    relatedSprints: ['sprint-1'],
    relatedTasks: ['task-1', 'task-2', 'task-6']
  },
  {
    id: 'note-2',
    title: 'Technical Debt Analizi',
    content: `Code review sürecinde tespit edilen technical debt noktaları ve çözüm önerileri:

1. Frontend State Management:
   - Local state kullanımı artıyor
   - Context API'ye geçiş planlanmalı
   - Redux/Zustand değerlendirilmeli

2. Backend API Design:
   - Error handling standardizasyonu gerekli
   - Response format'ları tutarlı değil
   - Validation middleware eklenmeli

3. Testing Coverage:
   - Unit test coverage %30'un altında
   - Integration test'ler eksik
   - E2E test'ler sadece critical path'lerde

Öncelik sırası:
1. Error handling standardizasyonu
2. Unit test coverage artırımı
3. State management refactoring`,
    workspaceId: 'workspace-1',
    authorId: 'user-2',
    authorName: 'Maria Garcia',
    tags: ['technical-debt', 'code-review', 'refactoring', 'testing'],
    category: 'Technical',
    isPublic: true,
    createdAt: '2024-07-02T14:30:00Z',
    updatedAt: '2024-07-02T14:30:00Z',
    relatedTasks: ['task-9']
  },
  {
    id: 'note-3',
    title: 'UI/UX Design Principles',
    content: `Proje için belirlenen UI/UX tasarım prensipleri:

Renk Paleti:
- Primary: #4F46E5 (Indigo)
- Secondary: #10B981 (Emerald)
- Accent: #F59E0B (Amber)
- Neutral: #6B7280 (Gray)

Typography:
- Headings: Inter, sans-serif
- Body: Inter, sans-serif
- Monospace: JetBrains Mono (code blocks)

Spacing System:
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

Component Guidelines:
- Consistent border radius (8px)
- Subtle shadows (0 1px 3px rgba(0,0,0,0.1))
- Smooth transitions (200ms ease-in-out)

Accessibility:
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support`,
    workspaceId: 'workspace-1',
    authorId: 'user-4',
    authorName: 'Priya Patel',
    tags: ['design', 'ui', 'ux', 'accessibility', 'guidelines'],
    category: 'Process',
    isPublic: true,
    createdAt: '2024-07-03T11:15:00Z',
    updatedAt: '2024-07-03T11:15:00Z'
  },
  {
    id: 'note-4',
    title: 'API Endpoint Ideas',
    content: `Gelecek sprint'ler için önerilen API endpoint'ler:

User Management:
- GET /api/users - Kullanıcı listesi
- GET /api/users/:id - Kullanıcı detayı
- PUT /api/users/:id - Kullanıcı güncelleme
- DELETE /api/users/:id - Kullanıcı silme

Task Management:
- GET /api/tasks - Görev listesi (filtreleme ve sıralama ile)
- POST /api/tasks - Yeni görev oluşturma
- PUT /api/tasks/:id - Görev güncelleme
- DELETE /api/tasks/:id - Görev silme
- PUT /api/tasks/:id/status - Görev durumu güncelleme

Sprint Management:
- GET /api/sprints - Sprint listesi
- POST /api/sprints - Yeni sprint oluşturma
- PUT /api/sprints/:id - Sprint güncelleme
- GET /api/sprints/:id/tasks - Sprint'e ait görevler

Analytics:
- GET /api/analytics/velocity - Takım hızı
- GET /api/analytics/burndown - Burndown chart verisi
- GET /api/analytics/team-performance - Takım performansı

Not: Rate limiting ve authentication middleware'leri tüm endpoint'lere uygulanmalı.`,
    workspaceId: 'workspace-1',
    authorId: 'user-1',
    authorName: 'Alex Johnson',
    tags: ['api', 'endpoints', 'planning', 'architecture'],
    category: 'Ideas',
    isPublic: false,
    createdAt: '2024-07-04T16:45:00Z',
    updatedAt: '2024-07-04T16:45:00Z',
    relatedTasks: ['task-8']
  }
];