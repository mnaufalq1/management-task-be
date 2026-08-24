import React from 'react';
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
  CartesianGrid, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';
import { Project, Task } from '../types';
import { Activity, Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AnalyticsChartsProps {
  projects: Project[];
  tasks: Task[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ projects, tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const toDoTasks = tasks.filter((t) => t.status === 'To Do').length;

  const statusData = [
    { name: 'To Do (Belum Dimulai)', value: toDoTasks, color: '#7A1C28' },
    { name: 'In Progress (Dalam Proses)', value: inProgressTasks, color: '#C27D38' },
    { name: 'Completed (Selesai)', value: completedTasks, color: '#2D6A4F' },
  ];

  const priorityData = [
    { name: 'Tinggi (High)', count: tasks.filter((t) => t.priority === 'High').length, fill: '#7A1C28' },
    { name: 'Sedang (Medium)', count: tasks.filter((t) => t.priority === 'Medium').length, fill: '#C27D38' },
    { name: 'Rendah (Low)', count: tasks.filter((t) => t.priority === 'Low').length, fill: '#8C7769' },
  ];

  // Per-project completion breakdown
  const projectComparisonData = projects.map((p) => {
    const pTasks = tasks.filter((t) => t.projectId === p.id);
    const pDone = pTasks.filter((t) => t.status === 'Completed').length;
    const rate = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;

    return {
      name: p.name.length > 18 ? p.name.slice(0, 18) + '...' : p.name,
      total: pTasks.length,
      selesai: pDone,
      progresPct: rate,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E6DCCF] shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A1C28]/10 border border-[#7A1C28]/20 text-[#7A1C28] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#7A1C28]" /> Real-Time Analytics Engine
          </div>
          <h2 className="text-2xl font-bold text-[#2A1B17]">Visualisasi Chart & Performa Project</h2>
          <p className="text-xs text-[#8C7769]">Monitoring langsung distribusi task, progres per proyek, dan tren waktu</p>
        </div>
      </div>

      {/* Row 1: Pie Chart & Priority Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Status Pie Chart */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E6DCCF] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#2A1B17] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#7A1C28]" />
              Persentase Status Pekerjaan
            </h3>
            <p className="text-xs text-[#8C7769]">Perbandingan task To Do, In Progress, dan Selesai</p>
          </div>

          <div className="h-72 w-full">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E6DCCF',
                      borderRadius: '12px',
                      color: '#2A1B17',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#544238' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#8C7769]">
                Belum ada data task.
              </div>
            )}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E6DCCF] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#2A1B17] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#7A1C28]" />
              Beban Kerja Berdasarkan Prioritas
            </h3>
            <p className="text-xs text-[#8C7769]">Jumlah task terkelompok berdasarkan tingkat urgensi</p>
          </div>

          <div className="h-72 w-full">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DC" />
                  <XAxis dataKey="name" stroke="#8C7769" tick={{ fontSize: 11, fill: '#544238' }} />
                  <YAxis stroke="#8C7769" tick={{ fontSize: 11, fill: '#544238' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E6DCCF',
                      borderRadius: '12px',
                      color: '#2A1B17',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#8C7769]">
                Belum ada data.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Row 2: Per-Project Progress Comparison */}
      <div className="bg-[#FFFFFF] border border-[#E6DCCF] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#2A1B17] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Tingkat Penyelesaian Per Project (%)
          </h3>
          <p className="text-xs text-[#8C7769]">Perbandingan persen task yang telah selesai di setiap proyek</p>
        </div>

        <div className="h-72 w-full">
          {projects.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectComparisonData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DC" />
                <XAxis dataKey="name" stroke="#8C7769" tick={{ fontSize: 11, fill: '#544238' }} />
                <YAxis stroke="#8C7769" tick={{ fontSize: 11, fill: '#544238' }} domain={[0, 100]} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Kemajuan Project']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E6DCCF',
                    borderRadius: '12px',
                    color: '#2A1B17',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                />
                <Bar dataKey="progresPct" fill="#7A1C28" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-[#8C7769]">
              Belum ada project terdaftar.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
