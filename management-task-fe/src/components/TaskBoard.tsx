import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Filter, 
  Search, 
  LayoutGrid, 
  List, 
  User as UserIcon,
  CheckSquare,
  MessageSquare
} from 'lucide-react';
import { Project, Task, TaskStatus, User } from '../types';
import { TaskDetailModal } from './TaskDetailModal';

interface TaskBoardProps {
  projects: Project[];
  tasks: Task[];
  selectedProjectId: string;
  onSelectProjectId: (id: string) => void;
  onOpenNewTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (task: Task, newStatus: TaskStatus) => void;
  searchQuery: string;
  currentUser: User;
  onRefreshTasks?: () => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  projects,
  tasks,
  selectedProjectId,
  onSelectProjectId,
  onOpenNewTask,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
  searchQuery,
  currentUser,
  onRefreshTasks,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Project filter
    if (selectedProjectId !== 'all' && task.projectId !== selectedProjectId) {
      return false;
    }
    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchAssigned = task.assignedTo?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAssigned) return false;
    }
    return true;
  });

  const columns: { id: TaskStatus; label: string; color: string; badgeBg: string }[] = [
    { id: 'To Do', label: 'Belum Dimulai', color: 'border-[#7A1C28]/40', badgeBg: 'bg-[#7A1C28]/10 text-[#7A1C28]' },
    { id: 'In Progress', label: 'Dalam Proses', color: 'border-amber-500/40', badgeBg: 'bg-amber-500/10 text-amber-800' },
    { id: 'Completed', label: 'Selesai', color: 'border-emerald-500/40', badgeBg: 'bg-emerald-500/10 text-emerald-800' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Controls Bar */}
      <div className="bg-[#FFFFFF] border border-[#E6DCCF] rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2A1B17]">Manajemen & Kanban Task</h2>
          <p className="text-xs text-[#8C7769]">Atur status, prioritas, dan deadline pekerjaan tim Anda</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Project Filter Selector */}
          <select
            value={selectedProjectId}
            onChange={(e) => onSelectProjectId(e.target.value)}
            className="bg-[#FAF6F0] border border-[#DFD3C3] rounded-xl px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#7A1C28] cursor-pointer"
          >
            <option value="all">Semua Project ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#FAF6F0] border border-[#DFD3C3] rounded-xl px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#7A1C28] cursor-pointer"
          >
            <option value="all">Semua Prioritas</option>
            <option value="High">Prioritas Tinggi</option>
            <option value="Medium">Prioritas Sedang</option>
            <option value="Low">Prioritas Rendah</option>
          </select>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#FAF6F0] p-1 rounded-xl border border-[#DFD3C3]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-[#7A1C28] text-white shadow-sm' : 'text-[#8C7769] hover:text-[#2A1B17]'
              }`}
              title="Tampilan Kanban Board"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-[#7A1C28] text-white shadow-sm' : 'text-[#8C7769] hover:text-[#2A1B17]'
              }`}
              title="Tampilan Daftar Tabel"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewTask}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#5C121D] via-[#7A1C28] to-[#9C2B3C] hover:from-[#4A0E17] hover:to-[#832030] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#4A0E17]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-[#FAF6F0] border border-[#E6DCCF] rounded-3xl p-5 shadow-sm flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E6DCCF]">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${col.badgeBg}`} />
                    <h3 className="font-bold text-sm text-[#2A1B17]">{col.label}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${col.badgeBg}`}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards Container */}
                <div className="space-y-4 flex-1">
                  {colTasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-[#DFD3C3] rounded-2xl flex items-center justify-center text-xs text-[#8C7769]">
                      Tidak ada task
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const project = projects.find((p) => p.id === task.projectId);

                      return (
                        <div
                          key={task.id}
                          className="bg-[#FFFFFF] border border-[#E6DCCF] hover:border-[#7A1C28]/40 rounded-2xl p-4 shadow-sm space-y-3 transition-all group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-[#8C7769] font-mono truncate max-w-[120px]">
                              {project?.name || 'Project'}
                            </span>

                            {/* Priority Badge */}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                task.priority === 'High'
                                  ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                                  : task.priority === 'Medium'
                                  ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                                  : 'bg-indigo-500/10 text-indigo-700 border border-indigo-500/20'
                              }`}
                            >
                              {task.priority === 'High' ? 'Tinggi' : task.priority === 'Medium' ? 'Sedang' : 'Rendah'}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#2A1B17] group-hover:text-[#7A1C28] transition-colors">
                            {task.title}
                          </h4>

                          <p className="text-xs text-[#544238] line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>

                          {/* Task Footer Info */}
                          <div className="pt-2 border-t border-[#EFE8DC] flex items-center justify-between text-xs text-[#8C7769]">
                            <span className="flex items-center gap-1 text-[11px]">
                              <Clock className="w-3 h-3 text-[#7A1C28]" /> {task.deadline}
                            </span>

                            <div className="flex items-center gap-1">
                              {/* Comment / Detail Modal Trigger Button */}
                              <button
                                onClick={() => setViewingTask(task)}
                                className="px-2 py-1 rounded-lg bg-[#7A1C28]/10 hover:bg-[#7A1C28]/20 text-[#7A1C28] border border-[#7A1C28]/20 flex items-center gap-1 text-[11px] font-semibold transition-all cursor-pointer"
                                title="Diskusi & Komentar Kolaborasi"
                              >
                                <MessageSquare className="w-3 h-3 text-[#7A1C28]" />
                                <span>{task.commentCount || 0}</span>
                              </button>

                              <button
                                onClick={() => onEditTask(task)}
                                className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#F3EBE0] text-[#4A0E17] border border-[#E6DCCF] transition-all cursor-pointer"
                                title="Edit Task"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                                title="Hapus Task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Quick Status Shift Buttons */}
                          <div className="flex items-center gap-1 pt-1">
                            {col.id !== 'To Do' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task, 'To Do')}
                                className="flex-1 py-1 rounded bg-[#FAF6F0] hover:bg-[#F3EBE0] text-[10px] text-[#7A1C28] font-semibold border border-[#E6DCCF] cursor-pointer"
                              >
                                ← To Do
                              </button>
                            )}
                            {col.id !== 'In Progress' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task, 'In Progress')}
                                className="flex-1 py-1 rounded bg-amber-50 hover:bg-amber-100 text-[10px] text-amber-800 font-semibold border border-amber-200 cursor-pointer"
                              >
                                In Progress
                              </button>
                            )}
                            {col.id !== 'Completed' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task, 'Completed')}
                                className="flex-1 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-[10px] text-emerald-800 font-semibold border border-emerald-200 cursor-pointer"
                              >
                                ✓ Selesai
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List / Table View */}
      {viewMode === 'list' && (
        <div className="bg-[#FFFFFF] border border-[#E6DCCF] rounded-3xl p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs text-[#544238]">
            <thead className="border-b border-[#E6DCCF] text-[#8C7769] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Nama Task</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Prioritas</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DC]">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#8C7769]">
                    Tidak ada task ditemukan.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);

                  return (
                    <tr key={task.id} className="hover:bg-[#FAF6F0] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#2A1B17]">
                        {task.title}
                        <p className="text-[10px] text-[#8C7769] truncate max-w-xs">{task.description}</p>
                      </td>
                      <td className="py-3.5 px-4">{project?.name || 'Project'}</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={task.status}
                          onChange={(e) => onUpdateTaskStatus(task, e.target.value as TaskStatus)}
                          className="bg-[#FAF6F0] border border-[#DFD3C3] rounded-lg px-2 py-1 text-[11px] text-[#2A1B17] cursor-pointer"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Selesai</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            task.priority === 'High'
                              ? 'bg-rose-500/10 text-rose-700'
                              : task.priority === 'Medium'
                              ? 'bg-amber-500/10 text-amber-700'
                              : 'bg-indigo-500/10 text-indigo-700'
                          }`}
                        >
                          {task.priority === 'High' ? 'Tinggi' : task.priority === 'Medium' ? 'Sedang' : 'Rendah'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{task.deadline}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingTask(task)}
                            className="px-2.5 py-1 rounded-lg bg-[#7A1C28]/10 hover:bg-[#7A1C28]/20 text-[#7A1C28] border border-[#7A1C28]/20 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                            title="Diskusi & Komentar"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#7A1C28]" />
                            <span>{task.commentCount || 0}</span>
                          </button>
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#F3EBE0] text-[#4A0E17] border border-[#E6DCCF] cursor-pointer"
                            title="Edit Task"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                            title="Hapus Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Detail & Collaboration Comments Modal */}
      <TaskDetailModal
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        task={viewingTask}
        project={projects.find((p) => p.id === viewingTask?.projectId)}
        currentUser={currentUser}
        onCommentsUpdated={() => {
          if (onRefreshTasks) {
            onRefreshTasks();
          }
        }}
      />

    </div>
  );
};
