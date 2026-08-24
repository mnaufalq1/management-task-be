import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { 
  getCurrentUser, 
  logoutUser, 
  getProjects, 
  addProject, 
  updateProject, 
  deleteProject, 
  getTasks, 
  addTask, 
  updateTask, 
  deleteTask 
} from './services/storageService';
import { User, Project, Task, TaskStatus } from './types';
import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { ProjectList } from './components/ProjectList';
import { TaskBoard } from './components/TaskBoard';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TeamManager } from './components/TeamManager';
import { ProjectModal } from './components/ProjectModal';
import { TaskModal } from './components/TaskModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Check auth session on load
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      loadUserData(user.id);
    }
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const userProjects = await api.getProjects(userId);
      const userTasks = await api.getTasks();
      if (userProjects.length > 0 || userTasks.length > 0) {
        setProjects(userProjects);
        setTasks(userTasks);
      } else {
        // Local storage fallback if API yields empty
        setProjects(getProjects(userId));
        setTasks(getTasks(userId));
      }
    } catch {
      setProjects(getProjects(userId));
      setTasks(getTasks(userId));
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    loadUserData(user.id);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Project CRUD Actions
  const handleCreateOrUpdateProject = async (projectData: { name: string; description: string; category: string }) => {
    if (!currentUser) return;

    if (editingProject) {
      const updated = await api.updateProject(editingProject.id, projectData);
      updateProject(editingProject.id, projectData);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
    } else {
      const created = await api.createProject({
        userId: currentUser.id,
        name: projectData.name,
        description: projectData.description,
        category: projectData.category,
      });
      addProject({
        userId: currentUser.id,
        name: projectData.name,
        description: projectData.description,
        category: projectData.category,
      });
      setProjects((prev) => [created, ...prev]);
    }

    setEditingProject(null);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!currentUser) return;
    await api.deleteProject(projectId);
    deleteProject(projectId, currentUser.id);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
  };

  // Task CRUD Actions
  const handleCreateOrUpdateTask = async (taskData: {
    projectId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: any;
    deadline: string;
    assignedTo: string;
  }) => {
    if (!currentUser) return;

    if (editingTask) {
      const updated = await api.updateTask(editingTask.id, taskData);
      updateTask(editingTask.id, taskData, currentUser.id);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
    } else {
      const created = await api.createTask(taskData);
      addTask(taskData, currentUser.id);
      setTasks((prev) => [created, ...prev]);
    }

    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!currentUser) return;
    await api.deleteTask(taskId);
    deleteTask(taskId, currentUser.id);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleToggleTaskStatus = async (task: Task) => {
    if (!currentUser) return;
    const nextStatus: TaskStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    const updated = await api.updateTask(task.id, { status: nextStatus });
    updateTask(task.id, { status: nextStatus }, currentUser.id);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? { ...t, status: nextStatus } : t)));
  };

  const handleUpdateTaskStatus = async (task: Task, newStatus: TaskStatus) => {
    if (!currentUser) return;
    const updated = await api.updateTask(task.id, { status: newStatus });
    updateTask(task.id, { status: newStatus }, currentUser.id);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? { ...t, status: newStatus } : t)));
  };

  // If not logged in, render Login & Sign Up Screen matching reference photo
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Dashboard Utama';
      case 'projects': return 'Daftar Project Tim';
      case 'tasks': return 'Manajemen & Kanban Task';
      case 'charts': return 'Monitoring Real-Time Chart';
      case 'team': return 'Informasi Keamanan Tim';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2A1B17] flex flex-col font-sans selection:bg-[#7A1C28] selection:text-white">
      
      {/* Header Bar */}
      <Header
        user={currentUser}
        onLogout={handleLogout}
        onOpenNewProjectModal={() => {
          setEditingProject(null);
          setIsProjectModalOpen(true);
        }}
        onOpenNewTaskModal={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTabTitle={getActiveTabTitle()}
        onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          teamName={currentUser.teamName}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic View Panel - Main Div with Box Shadow */}
        <main className="flex-1 bg-[#FFFFFF] border border-[#E6DCCF] rounded-3xl p-4 sm:p-6 lg:p-8 overflow-y-auto shadow-2xl my-4 ml-0 md:ml-6">
          {activeTab === 'overview' && (
            <DashboardOverview
              projects={projects}
              tasks={tasks}
              onOpenNewProject={() => {
                setEditingProject(null);
                setIsProjectModalOpen(true);
              }}
              onOpenNewTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onToggleTaskStatus={handleToggleTaskStatus}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectList
              projects={projects}
              tasks={tasks}
              currentUser={currentUser}
              onOpenNewProject={() => {
                setEditingProject(null);
                setIsProjectModalOpen(true);
              }}
              onEditProject={(proj) => {
                setEditingProject(proj);
                setIsProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
              onSelectProject={(projId) => {
                setSelectedProjectId(projId);
                setActiveTab('tasks');
              }}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskBoard
              projects={projects}
              tasks={tasks}
              selectedProjectId={selectedProjectId}
              onSelectProjectId={setSelectedProjectId}
              onOpenNewTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              searchQuery={searchQuery}
              currentUser={currentUser}
              onRefreshTasks={() => loadUserData(currentUser.id)}
            />
          )}

          {activeTab === 'charts' && (
            <AnalyticsCharts projects={projects} tasks={tasks} />
          )}

          {activeTab === 'team' && (
            <TeamManager user={currentUser} />
          )}
        </main>
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleCreateOrUpdateProject}
        initialData={editingProject}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        projects={projects}
        initialData={editingTask}
        defaultProjectId={selectedProjectId}
      />

    </div>
  );
}
