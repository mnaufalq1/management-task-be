import { ActivityLog, Project, Task, TaskComment, User } from '../types';
import { DEMO_USER, INITIAL_PROJECTS, INITIAL_TASKS } from '../data/initialData';

const CURRENT_USER_KEY = 'mataapp_current_user_v1';
const USERS_LIST_KEY = 'mataapp_registered_users_v1';
const PROJECTS_KEY = 'mataapp_projects_v1';
const TASKS_KEY = 'mataapp_tasks_v1';
const ACTIVITIES_KEY = 'mataapp_activities_v1';
const COMMENTS_KEY = 'mataapp_comments_v1';

const INITIAL_COMMENTS: TaskComment[] = [];

// Helper to seed initial data if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem(USERS_LIST_KEY)) {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify([]));
  }

  if (!localStorage.getItem(PROJECTS_KEY)) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify([]));
  }

  if (!localStorage.getItem(TASKS_KEY)) {
    localStorage.setItem(TASKS_KEY, JSON.stringify([]));
  }

  if (!localStorage.getItem(COMMENTS_KEY)) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify([]));
  }

  if (!localStorage.getItem(ACTIVITIES_KEY)) {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify([]));
  }
};

export const getCurrentUser = (): User | null => {
  initializeStorage();
  const saved = localStorage.getItem(CURRENT_USER_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const loginUser = (email: string, passwordHash: string): { user: User; error?: string } => {
  initializeStorage();
  const usersRaw = localStorage.getItem(USERS_LIST_KEY);
  const users: User[] = usersRaw ? JSON.parse(usersRaw) : [DEMO_USER];

  const trimmedEmail = email.trim().toLowerCase();
  
  // Find or create user for smooth login experience
  let matchedUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);

  if (!matchedUser) {
    if (trimmedEmail === 'budi@gmail.com') {
      matchedUser = DEMO_USER;
    } else {
      // Auto-register new user if logging in for first time
      matchedUser = {
        id: 'usr_' + Date.now(),
        email: email.trim(),
        name: email.split('@')[0],
        teamName: 'Tim ' + email.split('@')[0],
      };
      users.push(matchedUser);
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));

      // Seed default sample project for new user so they don't see empty dashboard
      const userProjects = getProjects(matchedUser.id);
      if (userProjects.length === 0) {
        addProject({
          userId: matchedUser.id,
          name: 'Proyek Utama ' + matchedUser.teamName,
          description: 'Selamat datang di MataApp! Ini adalah proyek pertama tim Anda untuk mengelola tugas dan alur kerja.',
          category: 'Management',
          color: 'from-purple-600 to-indigo-600',
        });
      }
    }
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matchedUser));
  return { user: matchedUser };
};

export const registerUser = (
  name: string,
  email: string,
  teamName: string
): { user: User; error?: string } => {
  initializeStorage();
  const usersRaw = localStorage.getItem(USERS_LIST_KEY);
  const users: User[] = usersRaw ? JSON.parse(usersRaw) : [DEMO_USER];

  const trimmedEmail = email.trim().toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
    return { user: null as unknown as User, error: 'Email sudah terdaftar. Silakan login.' };
  }

  const newUser: User = {
    id: 'usr_' + Date.now(),
    email: email.trim(),
    name: name.trim() || email.split('@')[0],
    teamName: teamName.trim() || 'Tim ' + name,
  };

  users.push(newUser);
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  // Seed default sample project for new registration
  addProject({
    userId: newUser.id,
    name: 'Proyek Perdana ' + newUser.teamName,
    description: 'Proyek khusus tim untuk memantau tugas, prioritas, dan deadline secara real-time.',
    category: 'Productivity',
    color: 'from-purple-600 to-pink-600',
  });

  return { user: newUser };
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// --- PROJECTS DATA SERVICE ---
export const getProjects = (userId: string): Project[] => {
  initializeStorage();
  const raw = localStorage.getItem(PROJECTS_KEY);
  if (!raw) return [];
  try {
    const allProjects: Project[] = JSON.parse(raw);
    return allProjects.filter((p) => p.userId === userId);
  } catch {
    return [];
  }
};

export const addProject = (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
  initializeStorage();
  const raw = localStorage.getItem(PROJECTS_KEY);
  const allProjects: Project[] = raw ? JSON.parse(raw) : [];

  const now = new Date().toISOString();
  const newProject: Project = {
    ...data,
    id: 'proj_' + Date.now(),
    createdAt: now.split('T')[0],
    updatedAt: now.split('T')[0],
    color: data.color || 'from-purple-600 to-indigo-600',
  };

  allProjects.unshift(newProject);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(allProjects));

  logActivity(data.userId, newProject.id, `Membuat project "${newProject.name}"`);
  return newProject;
};

export const updateProject = (id: string, data: Partial<Project>): Project | null => {
  initializeStorage();
  const raw = localStorage.getItem(PROJECTS_KEY);
  if (!raw) return null;
  const allProjects: Project[] = JSON.parse(raw);
  const index = allProjects.findIndex((p) => p.id === id);

  if (index === -1) return null;

  const updated: Project = {
    ...allProjects[index],
    ...data,
    updatedAt: new Date().toISOString().split('T')[0],
  };

  allProjects[index] = updated;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(allProjects));

  logActivity(updated.userId, updated.id, `Perbarui informasi project "${updated.name}"`);
  return updated;
};

export const deleteProject = (id: string, userId: string): boolean => {
  initializeStorage();
  const rawProj = localStorage.getItem(PROJECTS_KEY);
  if (!rawProj) return false;
  const allProjects: Project[] = JSON.parse(rawProj);
  const target = allProjects.find((p) => p.id === id);
  if (!target) return false;

  const filteredProjects = allProjects.filter((p) => p.id !== id);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(filteredProjects));

  // Also delete associated tasks
  const rawTasks = localStorage.getItem(TASKS_KEY);
  if (rawTasks) {
    const allTasks: Task[] = JSON.parse(rawTasks);
    const filteredTasks = allTasks.filter((t) => t.projectId !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
  }

  logActivity(userId, id, `Hapus project "${target.name}"`);
  return true;
};

// --- TASKS DATA SERVICE ---
export const getTasks = (userId: string): Task[] => {
  initializeStorage();
  const userProjects = getProjects(userId);
  const projectIds = new Set(userProjects.map((p) => p.id));

  const raw = localStorage.getItem(TASKS_KEY);
  if (!raw) return [];
  try {
    const allTasks: Task[] = JSON.parse(raw);
    const commentsRaw = localStorage.getItem(COMMENTS_KEY);
    const allComments: TaskComment[] = commentsRaw ? JSON.parse(commentsRaw) : [];

    return allTasks
      .filter((t) => projectIds.has(t.projectId))
      .map((t) => {
        const count = allComments.filter((c) => c.taskId === t.id).length;
        return { ...t, commentCount: count };
      });
  } catch {
    return [];
  }
};

export const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Task => {
  initializeStorage();
  const raw = localStorage.getItem(TASKS_KEY);
  const allTasks: Task[] = raw ? JSON.parse(raw) : [];

  const now = new Date().toISOString();
  const newTask: Task = {
    ...data,
    id: 'task_' + Date.now(),
    createdAt: now.split('T')[0],
    updatedAt: now.split('T')[0],
  };

  allTasks.unshift(newTask);
  localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));

  logActivity(userId, newTask.projectId, `Menambahkan task "${newTask.title}"`);
  return newTask;
};

export const updateTask = (id: string, data: Partial<Task>, userId: string): Task | null => {
  initializeStorage();
  const raw = localStorage.getItem(TASKS_KEY);
  if (!raw) return null;
  const allTasks: Task[] = JSON.parse(raw);
  const index = allTasks.findIndex((t) => t.id === id);

  if (index === -1) return null;

  const updated: Task = {
    ...allTasks[index],
    ...data,
    updatedAt: new Date().toISOString().split('T')[0],
  };

  allTasks[index] = updated;
  localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));

  logActivity(userId, updated.projectId, `Memperbarui status/detail task "${updated.title}" -> [${updated.status}]`);
  return updated;
};

export const deleteTask = (id: string, userId: string): boolean => {
  initializeStorage();
  const raw = localStorage.getItem(TASKS_KEY);
  if (!raw) return false;
  const allTasks: Task[] = JSON.parse(raw);
  const target = allTasks.find((t) => t.id === id);
  if (!target) return false;

  const filtered = allTasks.filter((t) => t.id !== id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));

  logActivity(userId, target.projectId, `Menghapus task "${target.title}"`);
  return true;
};

// --- ACTIVITY LOG SERVICE ---
export const logActivity = (userId: string, projectId: string | undefined, action: string) => {
  const raw = localStorage.getItem(ACTIVITIES_KEY);
  const allLogs: ActivityLog[] = raw ? JSON.parse(raw) : [];

  const newLog: ActivityLog = {
    id: 'act_' + Date.now(),
    userId,
    projectId,
    action,
    timestamp: new Date().toISOString(),
  };

  allLogs.unshift(newLog);
  // Keep last 50 logs
  if (allLogs.length > 50) allLogs.pop();
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(allLogs));
};

export const getActivityLogs = (userId: string): ActivityLog[] => {
  const raw = localStorage.getItem(ACTIVITIES_KEY);
  if (!raw) return [];
  try {
    const allLogs: ActivityLog[] = JSON.parse(raw);
    return allLogs.filter((l) => l.userId === userId).slice(0, 10);
  } catch {
    return [];
  }
};

// --- COMMENTS & COLLABORATION SERVICE ---
export const getTaskComments = (taskId: string): TaskComment[] => {
  initializeStorage();
  const raw = localStorage.getItem(COMMENTS_KEY);
  if (!raw) return [];
  try {
    const allComments: TaskComment[] = JSON.parse(raw);
    return allComments.filter((c) => c.taskId === taskId);
  } catch {
    return [];
  }
};

export const addTaskComment = (taskId: string, user: User, content: string): TaskComment => {
  initializeStorage();
  const raw = localStorage.getItem(COMMENTS_KEY);
  const allComments: TaskComment[] = raw ? JSON.parse(raw) : [];

  const newComment: TaskComment = {
    id: 'cmt_' + Date.now(),
    taskId,
    userId: user.id,
    userName: user.name,
    userTeam: user.teamName,
    userAvatar: user.avatarUrl,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  allComments.push(newComment);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));

  // Find task title to log activity
  const tasksRaw = localStorage.getItem(TASKS_KEY);
  if (tasksRaw) {
    const tasks: Task[] = JSON.parse(tasksRaw);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      logActivity(user.id, task.projectId, `Mengomentari task "${task.title}": "${content.slice(0, 30)}${content.length > 30 ? '...' : ''}"`);
    }
  }

  return newComment;
};

export const deleteTaskComment = (commentId: string): boolean => {
  initializeStorage();
  const raw = localStorage.getItem(COMMENTS_KEY);
  if (!raw) return false;
  const allComments: TaskComment[] = JSON.parse(raw);
  const filtered = allComments.filter((c) => c.id !== commentId);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(filtered));
  return true;
};
