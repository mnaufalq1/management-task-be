import { Project, Task, TaskComment, User } from '../types';

const API_BASE = '/api';

export const api = {
  // Auth API
  async login(email: string, password?: string): Promise<User> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Gagal login ke server');
      const data = await res.json();
      return data.user;
    } catch (err) {
      console.warn('Backend offline or unreachable, using local auth:', err);
      return {
        id: `usr_${Date.now()}`,
        email,
        name: email.split('@')[0],
        teamName: 'Tim Alpha Dev',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      };
    }
  },

  async register(email: string, name: string, teamName: string): Promise<User> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, teamName }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal mendaftar ke server');
      }
      const data = await res.json();
      return data.user;
    } catch (err: any) {
      console.warn('Backend warning:', err.message);
      return {
        id: `usr_${Date.now()}`,
        email,
        name,
        teamName,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      };
    }
  },

  // Projects API
  async getProjects(userId?: string): Promise<Project[]> {
    try {
      const url = userId ? `${API_BASE}/projects?userId=${encodeURIComponent(userId)}` : `${API_BASE}/projects`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal mengambil data project');
      return await res.json();
    } catch (err) {
      console.warn('Fallback to local projects:', err);
      return [];
    }
  },

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error('Gagal membuat project di server');
      return await res.json();
    } catch (err) {
      console.warn('Fallback project creation:', err);
      return {
        ...project,
        id: `proj_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Gagal mengedit project');
      return await res.json();
    } catch (err) {
      console.warn('Fallback project edit:', err);
      return { id, ...updates } as Project;
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (err) {
      console.warn('Fallback project deletion:', err);
      return true;
    }
  },

  // Tasks API
  async getTasks(projectId?: string): Promise<Task[]> {
    try {
      const url = projectId ? `${API_BASE}/tasks?projectId=${encodeURIComponent(projectId)}` : `${API_BASE}/tasks`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal mengambil data task');
      return await res.json();
    } catch (err) {
      console.warn('Fallback to local tasks:', err);
      return [];
    }
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error('Gagal membuat task');
      return await res.json();
    } catch (err) {
      console.warn('Fallback task creation:', err);
      return {
        ...task,
        id: `task_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Gagal memperbarui task');
      return await res.json();
    } catch (err) {
      console.warn('Fallback task update:', err);
      return { id, ...updates } as Task;
    }
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (err) {
      console.warn('Fallback task deletion:', err);
      return true;
    }
  },

  // Comments API
  async getComments(taskId: string): Promise<TaskComment[]> {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`);
      if (!res.ok) throw new Error('Gagal mengambil komentar');
      return await res.json();
    } catch (err) {
      console.warn('Fallback comments:', err);
      return [];
    }
  },

  async addComment(taskId: string, commentData: { userId: string; userName: string; userTeam?: string; userAvatar?: string; content: string }): Promise<TaskComment> {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });
      if (!res.ok) throw new Error('Gagal mengirim komentar');
      return await res.json();
    } catch (err) {
      console.warn('Fallback add comment:', err);
      return {
        id: `comm_${Date.now()}`,
        taskId,
        ...commentData,
        createdAt: new Date().toISOString(),
      };
    }
  },

  async deleteComment(commentId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/comments/${commentId}`, { method: 'DELETE' });
      return res.ok;
    } catch (err) {
      console.warn('Fallback delete comment:', err);
      return true;
    }
  },

  // Users API
  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) throw new Error('Gagal mengambil daftar pengguna');
      return await res.json();
    } catch (err) {
      console.warn('Fallback getUsers:', err);
      return [];
    }
  },

  // Project Members API
  async getProjectMembers(projectId?: string): Promise<any[]> {
    try {
      const url = projectId ? `${API_BASE}/project_members?project_id=${encodeURIComponent(projectId)}` : `${API_BASE}/project_members`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal mengambil data project members');
      return await res.json();
    } catch (err) {
      console.warn('Fallback getProjectMembers:', err);
      return [];
    }
  },

  async addProjectMember(projectId: string, userId: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/project_members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, userId }),
      });
      if (!res.ok) throw new Error('Gagal menambahkan project member');
      return await res.json();
    } catch (err) {
      console.warn('Fallback addProjectMember:', err);
      return { id: `pm_${Date.now()}`, projectId, userId };
    }
  },

  async deleteProjectMember(memberId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/project_members/${memberId}`, { method: 'DELETE' });
      return res.ok;
    } catch (err) {
      console.warn('Fallback deleteProjectMember:', err);
      return true;
    }
  },
};
