export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userTeam?: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string; // ISO string date YYYY-MM-DD
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  commentCount?: number;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  color?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  teamName: string;
  avatarUrl?: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  projectId?: string;
  action: string;
  timestamp: string;
}

export interface FilterOptions {
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
  projectIdFilter: string;
  sortBy: 'deadline' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}
