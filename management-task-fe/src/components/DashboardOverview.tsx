import React from 'react';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  ArrowUpRight, 
  Sparkles,
  CheckSquare,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Project, Task } from '../types';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

interface DashboardOverviewProps {
  projects: Project[];
  tasks: Task[];
  onOpenNewProject: () => void;
  onOpenNewTask: () => void;
  onNavigateTab: (tab: 'projects' | 'tasks' | 'charts') => void;
  onToggleTaskStatus: (task: Task) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  projects,
  tasks,
  onOpenNewProject,
  onOpenNewTask,
  onNavigateTab,
  onToggleTaskStatus,
}) => {
  // Metrics calculation
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const toDoTasks = tasks.filter((t) => t.status === 'To Do').length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length;

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Pie chart status distribution
  const statusData = [
    { name: 'To Do', value: toDoTasks, color: '#9C2B3C' },
    { name: 'In Progress', value: inProgressTasks, color: '#D97706' },
    { name: 'Completed', value: '#059669' },
  ];

  // Bar chart priority distribution
  const priorityData = [
    { priority: 'Rendah', count: tasks.filter((t) => t.priority === 'Low').length, fill: '#4F46E5' },
    { priority: 'Sedang', count: tasks.filter((t) => t.priority === 'Medium').length, fill: '#D97706' },
    { priority: 'Tinggi', count: tasks.filter((t) => t.priority === 'High').length, fill: '#B8263B' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Quick Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FAF4EC] via-[#F5ECE0] to-[#EFE2D2] border border-[#DFD3C3] shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#7A1C28]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A1C28]/10 border border-[#7A1C28]/20 text-[#7A1C28] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#7A1C28]" /> Real-Time Task Management
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2A1B17]">
            Monitoring Real-Time & Alur Kerja Project
          </h2>
          <p className="text-[#544238] text-sm max-w-2xl leading-relaxed">
            Kelola seluruh project dan tugas tim Anda dalam satu tempat. Pantau perkembangan deadline, status penyelesaian, dan visualisasi grafik secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10 w-full sm:w-auto">
          <button
            onClick={onOpenNewProject}
            className="flex-1 sm:flex-initial py-3 px-5 rounded-2xl bg-[#FFFFFF] hover:bg-[#F3EBE0] border border-[#D8C7B5] text-[#4A0E17] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <FolderKanban className="w-4 h-4 text-[#7A1C28]" />
            <span>+ Project Baru</span>
          </button>
          <button
            onClick={onOpenNewTask}
            className="flex-1 sm:flex-initial py-3 px-5 rounded-2xl bg-gradient-to-r from-[#5C121D] via-[#7A1C28] to-[#9C2B3C] hover:from-[#4A0E17] hover:to-[#832030] text-white text-xs font-semibold shadow-md shadow-[#4A0E17]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Task</span>
          </button>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Projects */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6DCCF] hover:border-[#7A1C28]/40 transition-all shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7769] uppercase tracking-wider">Total Project</span>
            <div className="w-10 h-10 rounded-xl bg-[#7A1C28]/10 border border-[#7A1C28]/20 flex items-center justify-center text-[#7A1C28]">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#2A1B17]">{totalProjects}</span>
            <span className="text-xs text-[#544238] flex items-center gap-1">
              Aktif <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </span>
          </div>
          <div className="w-full bg-[#EFE8DC] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#7A1C28] h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Metric 2: Total Tasks */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6DCCF] hover:border-[#7A1C28]/40 transition-all shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7769] uppercase tracking-wider">Total Task</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#2A1B17]">{totalTasks}</span>
            <span className="text-xs text-[#544238]">
              {inProgressTasks} Dalam Proses
            </span>
          </div>
          <div className="w-full bg-[#EFE8DC] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-600 h-full rounded-full transition-all duration-500" 
              style={{ width: totalTasks > 0 ? `${(inProgressTasks / totalTasks) * 100}%` : '0%' }} 
            />
          </div>
        </div>

        {/* Metric 3: Task Selesai % */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6DCCF] hover:border-[#7A1C28]/40 transition-all shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7769] uppercase tracking-wider">Tingkat Penyelesaian</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-700">{completionPercentage}%</span>
            <span className="text-xs text-emerald-700/80 font-medium">
              {completedTasks} / {totalTasks} Task
            </span>
          </div>
          <div className="w-full bg-[#EFE8DC] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${completionPercentage}%` }} 
            />
          </div>
        </div>

        {/* Metric 4: Priority Tinggi Urgent */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6DCCF] hover:border-[#7A1C28]/40 transition-all shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7769] uppercase tracking-wider">Prioritas Tinggi</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-700">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#B8263B]">{highPriorityTasks}</span>
            <span className="text-xs text-[#B8263B]/80 font-medium">Perlu Perhatian</span>
          </div>
          <div className="w-full bg-[#EFE8DC] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#B8263B] h-full rounded-full transition-all duration-500" 
              style={{ width: totalTasks > 0 ? `${(highPriorityTasks / totalTasks) * 100}%` : '0%' }} 
            />
          </div>
        </div>
      </div>

      {/* Real-Time Chart Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Status Distribution Donut Chart */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E6DCCF] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#2A1B17] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#7A1C28]" />
                Distribusi Status Task
              </h3>
              <p className="text-xs text-[#8C7769]">Monitoring real-time progres pekerjaan</p>
            </div>
            <button
              onClick={() => onNavigateTab('charts')}
              className="text-xs text-[#7A1C28] hover:text-[#5C121D] flex items-center gap-1 font-semibold"
            >
              Detail <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={typeof entry.value === 'string' ? '#059669' : entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#DFD3C3',
                      borderRadius: '12px',
                      color: '#2A1B17',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-[#8C7769]">Belum ada task. Buat task untuk melihat chart.</div>
            )}
          </div>

          {/* Chart Legend */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EFE8DC] text-center text-xs">
            {statusData.map((s, idx) => (
              <div key={s.name} className="space-y-0.5">
                <div className="flex items-center justify-center gap-1.5 text-[#544238]">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: idx === 2 ? '#059669' : s.color }} />
                  <span className="text-[11px] font-medium">{s.name}</span>
                </div>
                <p className="text-sm font-bold text-[#2A1B17]">{idx === 0 ? toDoTasks : idx === 1 ? inProgressTasks : completedTasks}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E6DCCF] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#2A1B17] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#7A1C28]" />
                Sebaran Prioritas Task
              </h3>
              <p className="text-xs text-[#8C7769]">Prioritas kerja tim (Tinggi, Sedang, Rendah)</p>
            </div>
            <button
              onClick={() => onNavigateTab('charts')}
              className="text-xs text-[#7A1C28] hover:text-[#5C121D] flex items-center gap-1 font-semibold"
            >
              Detail <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DC" />
                  <XAxis dataKey="priority" stroke="#8C7769" tick={{ fontSize: 12, fill: '#544238' }} />
                  <YAxis stroke="#8C7769" tick={{ fontSize: 12, fill: '#544238' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#DFD3C3',
                      borderRadius: '12px',
                      color: '#2A1B17',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#8C7769]">
                Belum ada data task.
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#EFE8DC] flex items-center justify-between text-xs text-[#544238]">
            <span>Prioritas Tinggi: <strong className="text-[#B8263B]">{tasks.filter((t) => t.priority === 'High').length}</strong></span>
            <span>Sedang: <strong className="text-amber-700">{tasks.filter((t) => t.priority === 'Medium').length}</strong></span>
            <span>Rendah: <strong className="text-indigo-700">{tasks.filter((t) => t.priority === 'Low').length}</strong></span>
          </div>
        </div>

      </div>

      {/* Projects Overview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#2A1B17]">Project Tim Aktif</h3>
            <p className="text-xs text-[#8C7769]">Daftar project dan kemajuan pengerjaan</p>
          </div>
          <button
            onClick={() => onNavigateTab('projects')}
            className="text-xs text-[#7A1C28] hover:text-[#5C121D] font-semibold flex items-center gap-1"
          >
            Lihat Semua Project ({totalProjects}) <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const projTasks = tasks.filter((t) => t.projectId === proj.id);
            const projDone = projTasks.filter((t) => t.status === 'Completed').length;
            const pct = projTasks.length > 0 ? Math.round((projDone / projTasks.length) * 100) : 0;

            return (
              <div
                key={proj.id}
                className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E6DCCF] hover:border-[#7A1C28]/40 transition-all shadow-sm space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#7A1C28]/10 text-[#7A1C28] text-[10px] font-semibold border border-[#7A1C28]/20">
                      {proj.category || 'General'}
                    </span>
                    <span className="text-[10px] text-[#8C7769] font-mono">{proj.createdAt}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#2A1B17] group-hover:text-[#7A1C28] transition-colors line-clamp-1">
                    {proj.name}
                  </h4>
                  <p className="text-xs text-[#544238] line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#EFE8DC]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#544238] font-medium">Kemajuan Project</span>
                    <span className="font-bold text-emerald-700">{pct}% ({projDone}/{projTasks.length} Task)</span>
                  </div>

                  <div className="w-full bg-[#EFE8DC] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#7A1C28] to-amber-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <button
                    onClick={() => onNavigateTab('tasks')}
                    className="w-full mt-1 py-2 px-3 rounded-xl bg-[#FAF6F0] hover:bg-[#F3EBE0] text-xs text-[#4A0E17] font-semibold flex items-center justify-center gap-1.5 border border-[#E6DCCF] transition-all cursor-pointer"
                  >
                    <span>Buka Task Project Ini</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#7A1C28]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Task List with Instant Completion Toggle */}
      <div className="bg-[#FFFFFF] border border-[#E6DCCF] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#2A1B17]">Task Terbaru</h3>
            <p className="text-xs text-[#8C7769]">Klik tombol centang untuk memperbarui status real-time</p>
          </div>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="text-xs text-[#7A1C28] hover:text-[#5C121D] font-semibold flex items-center gap-1"
          >
            Buka Penuh Kanban Board <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {tasks.slice(0, 5).map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            const isDone = task.status === 'Completed';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-[#FAF6F0] border-[#EFE8DC] opacity-75'
                    : 'bg-[#FFFFFF] border border-[#E6DCCF] hover:border-[#7A1C28]/40 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => onToggleTaskStatus(task)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'border border-[#DFD3C3] text-transparent hover:border-[#7A1C28]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="min-w-0 space-y-0.5">
                    <p className={`text-sm font-semibold truncate ${isDone ? 'line-through text-[#8C7769]' : 'text-[#2A1B17]'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#8C7769]">
                      <span className="truncate">{project?.name || 'Project'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#7A1C28]" /> Deadline: {task.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      task.priority === 'High'
                        ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                        : task.priority === 'Medium'
                        ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-700 border border-indigo-500/20'
                    }`}
                  >
                    {task.priority === 'High' ? 'Tinggi' : task.priority === 'Medium' ? 'Sedang' : 'Rendah'}
                  </span>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold hidden sm:inline-block ${
                      task.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                        : task.status === 'In Progress'
                        ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                        : 'bg-[#7A1C28]/10 text-[#7A1C28] border border-[#7A1C28]/20'
                    }`}
                  >
                    {task.status === 'Completed' ? 'Selesai' : task.status === 'In Progress' ? 'Dalam Proses' : 'To Do'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
