import { Task, JiraIssue, UserRole } from '../../types';

// Jira API configuration
interface JiraConfig {
  baseUrl: string;
  username: string;
  apiToken: string;
  projectKey: string;
}

// Jira status mapping to our TaskStatus
const JIRA_STATUS_MAPPING: Record<string, Task['status']> = {
  'To Do': 'Todo',
  'In Progress': 'In Progress',
  'In Review': 'In Review',
  'Done': 'Done',
  'Blocked': 'In Progress', // Map blocked to In Progress
  'Testing': 'In Review',   // Map testing to In Review
  'Deployed': 'Done',       // Map deployed to Done
  'Backlog': 'Todo',
  'Sprint Backlog': 'Todo',
  'Development': 'In Progress',
  'Code Review': 'In Review',
  'QA Testing': 'In Review',
  'Ready for Deploy': 'In Review',
  'Production': 'Done',
  'Closed': 'Done',
  'Cancelled': 'Done'
};

// Mock Jira issues for demonstration
const MOCK_JIRA_ISSUES: JiraIssue[] = [
  {
    key: 'SYNC-1',
    fields: {
      summary: 'Setup project structure',
      description: 'Initialize the basic project structure with React and TypeScript',
      status: { name: 'Done' },
      assignee: {
        displayName: 'Alex Johnson',
        emailAddress: 'alex@syncflow.com'
      },
      customfield_10016: 8, // Story Points
      issuelinks: []
    }
  },
  {
    key: 'SYNC-2',
    fields: {
      summary: 'Implement authentication system',
      description: 'Create user authentication with Firebase Auth',
      status: { name: 'Done' },
      assignee: {
        displayName: 'Sarah Chen',
        emailAddress: 'sarah@syncflow.com'
      },
      customfield_10016: 13,
      issuelinks: [
        {
          type: { name: 'Blocks' },
          outwardIssue: { key: 'SYNC-3' }
        }
      ]
    }
  },
  {
    key: 'SYNC-3',
    fields: {
      summary: 'Design UI components',
      description: 'Create reusable UI components with Tailwind CSS',
      status: { name: 'Done' },
      assignee: {
        displayName: 'Mike Rodriguez',
        emailAddress: 'mike@syncflow.com'
      },
      customfield_10016: 5,
      issuelinks: []
    }
  },
  {
    key: 'SYNC-4',
    fields: {
      summary: 'Implement Kanban board',
      description: 'Create the main Kanban board with drag and drop functionality',
      status: { name: 'In Progress' },
      assignee: {
        displayName: 'Emily Davis',
        emailAddress: 'emily@syncflow.com'
      },
      customfield_10016: 21,
      issuelinks: [
        {
          type: { name: 'Blocks' },
          outwardIssue: { key: 'SYNC-5' }
        }
      ]
    }
  },
  {
    key: 'SYNC-5',
    fields: {
      summary: 'Add task management',
      description: 'Implement task creation, editing, and deletion',
      status: { name: 'In Progress' },
      assignee: {
        displayName: 'Alex Johnson',
        emailAddress: 'alex@syncflow.com'
      },
      customfield_10016: 13,
      issuelinks: [
        {
          type: { name: 'Blocks' },
          outwardIssue: { key: 'SYNC-6' }
        }
      ]
    }
  },
  {
    key: 'SYNC-6',
    fields: {
      summary: 'Implement sprint planning',
      description: 'Create sprint planning and management features',
      status: { name: 'To Do' },
      assignee: {
        displayName: 'Sarah Chen',
        emailAddress: 'sarah@syncflow.com'
      },
      customfield_10016: 8,
      issuelinks: []
    }
  }
];

/**
 * Jira API Service for integrating with Jira Cloud
 */
export class JiraApiService {
  private config: JiraConfig;
  private baseUrl: string;
  private authHeader: string;

  constructor(config: JiraConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.authHeader = `Basic ${btoa(`${config.username}:${config.apiToken}`)}`;
  }

  /**
   * Test the connection to Jira
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to fetch project info to test connection
      const response = await this.makeRequest(`/rest/api/3/project/${this.config.projectKey}`);
      
      if (response.ok) {
        console.log(`✅ Connected to Jira project: ${this.config.projectKey}`);
        return true;
      } else {
        console.error('❌ Failed to connect to Jira:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to connect to Jira:', error);
      return false;
    }
  }

  /**
   * Make authenticated HTTP request to Jira API
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Authorization': this.authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
        console.log(`Rate limited, waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequest(endpoint, options);
      }
      
      return response;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  /**
   * Fetch all issues from a Jira project
   */
  async fetchProjectIssues(): Promise<JiraIssue[]> {
    try {
      console.log(`📋 Fetching issues from Jira project: ${this.config.projectKey}`);
      
      // Use JQL to fetch all issues from the project
      const jql = `project = ${this.config.projectKey} ORDER BY created DESC`;
      const response = await this.makeRequest(`/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=1000&fields=summary,description,status,assignee,customfield_10016,issuelinks,created,updated,priority,components,labels`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const issues = data.issues || [];
      
      console.log(`✅ Fetched ${issues.length} issues from Jira`);
      return issues;
    } catch (error) {
      console.error('❌ Failed to fetch Jira issues:', error);
      
      // Fallback to mock data for development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Falling back to mock data for development');
        return MOCK_JIRA_ISSUES;
      }
      
      throw new Error(`Failed to fetch issues from Jira: ${error}`);
    }
  }

  /**
   * Fetch issues by sprint
   */
  async fetchSprintIssues(sprintId: number): Promise<JiraIssue[]> {
    try {
      const response = await this.makeRequest(`/rest/agile/1.0/sprint/${sprintId}/issue?fields=summary,description,status,assignee,customfield_10016,issuelinks,created,updated,priority,components,labels`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sprint issues: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.issues || [];
    } catch (error) {
      console.error('❌ Failed to fetch sprint issues:', error);
      throw error;
    }
  }

  /**
   * Fetch active sprints for a project
   */
  async fetchActiveSprints(): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/rest/agile/1.0/board?projectKeyOrId=${this.config.projectKey}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch boards: ${response.status} ${response.statusText}`);
      }
      
      const boards = await response.json();
      const activeSprints: any[] = [];
      
      // Fetch active sprints from each board
      for (const board of boards.values) {
        const sprintsResponse = await this.makeRequest(`/rest/agile/1.0/board/${board.id}/sprint?state=active`);
        if (sprintsResponse.ok) {
          const sprints = await sprintsResponse.json();
          activeSprints.push(...sprints.values);
        }
      }
      
      return activeSprints;
    } catch (error) {
      console.error('❌ Failed to fetch active sprints:', error);
      return [];
    }
  }

  /**
   * Sync Jira issues with our internal Task format
   */
  async syncWithJira(workspaceId: string, existingUsers: any[]): Promise<Task[]> {
    try {
      console.log('🔄 Starting Jira synchronization...');
      
      // Fetch issues from Jira
      const jiraIssues = await this.fetchProjectIssues();
      
      // Convert Jira issues to our Task format
      const syncedTasks: Task[] = jiraIssues.map(issue => {
        const task = this.mapJiraIssueToTask(issue, workspaceId, existingUsers);
        return task;
      });
      
      console.log(`✅ Successfully synced ${syncedTasks.length} tasks from Jira`);
      return syncedTasks;
    } catch (error) {
      console.error('❌ Jira synchronization failed:', error);
      throw error;
    }
  }

  /**
   * Map a Jira issue to our internal Task format
   */
  private mapJiraIssueToTask(
    jiraIssue: JiraIssue, 
    workspaceId: string, 
    existingUsers: any[]
  ): Task {
    // Find assignee in existing users
    const assignee = jiraIssue.fields.assignee 
      ? existingUsers.find(user => 
          user.email === jiraIssue.fields.assignee?.emailAddress ||
          user.name === jiraIssue.fields.assignee?.displayName
        )
      : undefined;

    // Map Jira status to our TaskStatus
    const status = JIRA_STATUS_MAPPING[jiraIssue.fields.status.name] || 'Todo';

    // Extract dependencies from issue links
    const dependencies: string[] = [];
    if (jiraIssue.fields.issuelinks) {
      jiraIssue.fields.issuelinks.forEach(link => {
        if (link.type.name === 'Blocks') {
          if (link.outwardIssue) {
            dependencies.push(link.outwardIssue.key);
          }
          if (link.inwardIssue) {
            dependencies.push(link.inwardIssue.key);
          }
        }
      });
    }

    // Determine team based on issue key or description
    const team = this.determineTeam(jiraIssue);

    return {
      id: jiraIssue.key, // Use Jira key as our task ID
      title: jiraIssue.fields.summary,
      description: jiraIssue.fields.description,
      status,
      assignee,
      workspaceId,
      storyPoints: jiraIssue.fields.customfield_10016,
      dependencies,
      team,
      tags: this.extractTags(jiraIssue),
      priority: this.determinePriority(jiraIssue),
      createdAt: new Date().toISOString(), // In real app, get from Jira
      updatedAt: new Date().toISOString(),
      // Jira integration fields
      jiraKey: jiraIssue.key,
      jiraStatus: jiraIssue.fields.status.name,
      jiraAssignee: jiraIssue.fields.assignee?.displayName
    };
  }

  /**
   * Determine team based on issue information
   */
  private determineTeam(jiraIssue: JiraIssue): Task['team'] {
    const summary = jiraIssue.fields.summary.toLowerCase();
    const description = jiraIssue.fields.description?.toLowerCase() || '';

    if (summary.includes('ui') || summary.includes('frontend') || description.includes('react')) {
      return 'Frontend';
    }
    if (summary.includes('api') || summary.includes('backend') || description.includes('firebase')) {
      return 'Backend';
    }
    if (summary.includes('mobile') || description.includes('mobile')) {
      return 'Mobile';
    }
    
    return 'General';
  }

  /**
   * Extract tags from issue summary and description
   */
  private extractTags(jiraIssue: JiraIssue): string[] {
    const text = `${jiraIssue.fields.summary} ${jiraIssue.fields.description || ''}`.toLowerCase();
    const tags: string[] = [];

    // Common tags to look for
    const commonTags = ['bug', 'feature', 'enhancement', 'documentation', 'testing', 'security'];
    commonTags.forEach(tag => {
      if (text.includes(tag)) {
        tags.push(tag);
      }
    });

    // Extract technology tags
    const techTags = ['react', 'typescript', 'firebase', 'tailwind', 'api', 'database'];
    techTags.forEach(tag => {
      if (text.includes(tag)) {
        tags.push(tag);
      }
    });

    return tags;
  }

  /**
   * Determine priority based on issue information
   */
  private determinePriority(jiraIssue: JiraIssue): Task['priority'] {
    const summary = jiraIssue.fields.summary.toLowerCase();
    const description = jiraIssue.fields.description?.toLowerCase() || '';

    if (summary.includes('critical') || summary.includes('urgent') || description.includes('security')) {
      return 'Critical';
    }
    if (summary.includes('high') || summary.includes('important')) {
      return 'High';
    }
    if (summary.includes('low') || summary.includes('nice to have')) {
      return 'Low';
    }
    
    return 'Medium';
  }

  /**
   * Create a new issue in Jira
   */
  async createJiraIssue(task: Task): Promise<string> {
    try {
      const issueData = {
        fields: {
          project: { key: this.config.projectKey },
          summary: task.title,
          description: task.description,
          issuetype: { name: 'Task' },
          priority: { name: this.mapPriorityToJira(task.priority) },
          customfield_10016: task.storyPoints || 0
        }
      };

      const response = await this.makeRequest('/rest/api/3/issue', {
        method: 'POST',
        body: JSON.stringify(issueData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create issue: ${response.status} ${response.statusText}`);
      }

      const createdIssue = await response.json();
      const jiraKey = createdIssue.key;
      
      console.log(`✅ Created Jira issue: ${jiraKey}`);
      return jiraKey;
    } catch (error) {
      console.error('❌ Failed to create Jira issue:', error);
      throw error;
    }
  }

  /**
   * Update an existing Jira issue
   */
  async updateJiraIssue(jiraKey: string, task: Task): Promise<boolean> {
    try {
      const updateData = {
        fields: {
          summary: task.title,
          description: task.description,
          priority: { name: this.mapPriorityToJira(task.priority) },
          customfield_10016: task.storyPoints || 0
        }
      };

      const response = await this.makeRequest(`/rest/api/3/issue/${jiraKey}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update issue: ${response.status} ${response.statusText}`);
      }

      console.log(`✅ Updated Jira issue: ${jiraKey}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update Jira issue:', error);
      throw error;
    }
  }

  /**
   * Update issue status in Jira
   */
  async updateIssueStatus(jiraKey: string, newStatus: string): Promise<boolean> {
    try {
      // First, get available transitions
      const transitionsResponse = await this.makeRequest(`/rest/api/3/issue/${jiraKey}/transitions`);
      
      if (!transitionsResponse.ok) {
        throw new Error(`Failed to get transitions: ${transitionsResponse.status} ${transitionsResponse.statusText}`);
      }

      const transitions = await transitionsResponse.json();
      const targetTransition = transitions.transitions.find((t: any) => 
        t.to.name.toLowerCase() === newStatus.toLowerCase()
      );

      if (!targetTransition) {
        throw new Error(`No transition found to status: ${newStatus}`);
      }

      // Execute the transition
      const transitionData = {
        transition: { id: targetTransition.id }
      };

      const response = await this.makeRequest(`/rest/api/3/issue/${jiraKey}/transitions`, {
        method: 'POST',
        body: JSON.stringify(transitionData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status} ${response.statusText}`);
      }

      console.log(`✅ Updated Jira issue ${jiraKey} status to: ${newStatus}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update Jira issue status:', error);
      throw error;
    }
  }

  /**
   * Map our priority to Jira priority
   */
  private mapPriorityToJira(priority: Task['priority']): string {
    const priorityMap: Record<Task['priority'], string> = {
      'Critical': 'Highest',
      'High': 'High',
      'Medium': 'Medium',
      'Low': 'Low'
    };
    return priorityMap[priority] || 'Medium';
  }

  /**
   * Get Jira project information
   */
  async getProjectInfo(): Promise<{
    key: string;
    name: string;
    issueTypes: string[];
    statuses: string[];
    components: string[];
    versions: string[];
  }> {
    try {
      const response = await this.makeRequest(`/rest/api/3/project/${this.config.projectKey}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get project info: ${response.status} ${response.statusText}`);
      }

      const project = await response.json();
      
      // Get issue types
      const issueTypesResponse = await this.makeRequest(`/rest/api/3/project/${this.config.projectKey}/statuses`);
      const issueTypes = issueTypesResponse.ok ? await issueTypesResponse.json() : [];
      
      // Get components
      const componentsResponse = await this.makeRequest(`/rest/api/3/project/${this.config.projectKey}/components`);
      const components = componentsResponse.ok ? await componentsResponse.json() : [];
      
      // Get versions
      const versionsResponse = await this.makeRequest(`/rest/api/3/project/${this.config.projectKey}/versions`);
      const versions = versionsResponse.ok ? await versionsResponse.json() : [];

      return {
        key: project.key,
        name: project.name,
        issueTypes: issueTypes.map((it: any) => it.name),
        statuses: this.extractStatuses(issueTypes),
        components: components.map((c: any) => c.name),
        versions: versions.map((v: any) => v.name)
      };
    } catch (error) {
      console.error('❌ Failed to get project info:', error);
      
      // Return mock data for development
      if (process.env.NODE_ENV === 'development') {
        return {
          key: this.config.projectKey,
          name: `SyncFlow ${this.config.projectKey}`,
          issueTypes: ['Task', 'Bug', 'Story', 'Epic'],
          statuses: ['To Do', 'In Progress', 'In Review', 'Done', 'Blocked', 'Testing'],
          components: ['Frontend', 'Backend', 'Mobile', 'DevOps'],
          versions: ['v1.0.0', 'v1.1.0', 'v1.2.0']
        };
      }
      
      throw error;
    }
  }

  /**
   * Extract statuses from issue types
   */
  private extractStatuses(issueTypes: any[]): string[] {
    const statuses = new Set<string>();
    issueTypes.forEach(issueType => {
      if (issueType.statuses) {
        issueType.statuses.forEach((status: any) => {
          statuses.add(status.name);
        });
      }
    });
    return Array.from(statuses);
  }

  /**
   * Search issues with custom JQL
   */
  async searchIssues(jql: string, maxResults: number = 100): Promise<JiraIssue[]> {
    try {
      const response = await this.makeRequest(`/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}&fields=summary,description,status,assignee,customfield_10016,issuelinks,created,updated,priority,components,labels`);
      
      if (!response.ok) {
        throw new Error(`Failed to search issues: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.issues || [];
    } catch (error) {
      console.error('❌ Failed to search Jira issues:', error);
      throw error;
    }
  }

  /**
   * Get issue worklog
   */
  async getIssueWorklog(jiraKey: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/rest/api/3/issue/${jiraKey}/worklog`);
      
      if (!response.ok) {
        throw new Error(`Failed to get worklog: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.worklogs || [];
    } catch (error) {
      console.error('❌ Failed to get issue worklog:', error);
      return [];
    }
  }

  /**
   * Add worklog entry to issue
   */
  async addWorklogEntry(jiraKey: string, timeSpent: string, comment: string): Promise<boolean> {
    try {
      const worklogData = {
        timeSpent,
        comment
      };

      const response = await this.makeRequest(`/rest/api/3/issue/${jiraKey}/worklog`, {
        method: 'POST',
        body: JSON.stringify(worklogData)
      });

      if (!response.ok) {
        throw new Error(`Failed to add worklog: ${response.status} ${response.statusText}`);
      }

      console.log(`✅ Added worklog to Jira issue: ${jiraKey}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to add worklog:', error);
      throw error;
    }
  }
}

/**
 * Factory function to create Jira API service
 */
export function createJiraApiService(config: JiraConfig): JiraApiService {
  return new JiraApiService(config);
}

/**
 * Default Jira configuration for development
 */
export const DEFAULT_JIRA_CONFIG: JiraConfig = {
  baseUrl: 'https://your-domain.atlassian.net',
  username: 'your-email@company.com',
  apiToken: 'your-api-token',
  projectKey: 'SYNC'
};
