import React, { useState } from 'react';
import { 
  FolderPlus, 
  Trash2, 
  Edit3, 
  CheckSquare, 
  ArrowUpRight, 
  Calendar,
  Layers,
  Users
} from 'lucide-react';
import { Project, Task, User } from '../types';
import { ProjectMembersModal } from './ProjectMembersModal';

interface ProjectListProps {
  projects: Project[];
  tasks: Task[];
  currentUser: User;
  onOpenNewProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onSelectProject: (projectId: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  tasks,
  currentUser,
  onOpenNewProject,
  onEditProject,
  onDeleteProject,
  onSelectProject,
}) => {
  const [selectedMemberProject, setSelectedMemberProject] = useState<Project | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2A1B17]">Daftar Project Tim</h2>
          <p className="text-xs text-[#8C7769]">Kelola daftar proyek aktif dan atur tugas-tugas di dalamnya</p>
        </div>

        <button
          onClick={onOpenNewProject}
          className="py-2.5 px-5 rounded-full bg-gradient-to-r from-[#5C121D] via-[#7A1C28] to-[#9C2B3C] hover:from-[#4A0E17] hover:to-[#832030] text-white text-xs font-semibold shadow-md shadow-[#4A0E17]/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Tambah Project Baru</span>
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="p-12 text-center bg-[#FFFFFF] border border-[#E6DCCF] rounded-3xl space-y-4 shadow-sm">
          <Layers className="w-12 h-12 text-[#9C8A7D] mx-auto" />
          <h3 className="text-lg font-bold text-[#2A1B17]">Belum Ada Project</h3>
          <p className="text-xs text-[#8C7769] max-w-sm mx-auto">
            Mulai kelola alur kerja tim Anda dengan membuat project baru pertama Anda.
          </p>
          <button
            onClick={onOpenNewProject}
            className="py-2.5 px-5 rounded-full bg-[#7A1C28] hover:bg-[#5C121D] text-white text-xs font-semibold cursor-pointer shadow-sm"
          >
            + Buat Project Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const projTasks = tasks.filter((t) => t.projectId === proj.id);
            const completedCount = projTasks.filter((t) => t.status === 'Completed').length;
            const percentage = projTasks.length > 0 ? Math.round((completedCount / projTasks.length) * 100) : 0;

            return (
              <div
                key={proj.id}
                className="bg-[#FFFFFF] border border-[#E6DCCF] hover:border-[#7A1C28]/40 rounded-3xl p-6 shadow-sm space-y-5 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#7A1C28]/10 text-[#7A1C28] text-[10px] font-semibold border border-[#7A1C28]/20">
                      {proj.category || 'General'}
                    </span>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedMemberProject(proj)}
                        className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#F3EBE0] text-[#7A1C28] border border-[#E6DCCF] transition-all cursor-pointer flex items-center gap-1 text-[11px] font-semibold px-2"
                        title="Kelola Member Project"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Member</span>
                      </button>

                      <button
                        onClick={() => onEditProject(proj)}
                        className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#F3EBE0] text-[#4A0E17] border border-[#E6DCCF] transition-all cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus project "${proj.name}" beserta semua task di dalamnya?`)) {
                            onDeleteProject(proj.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                        title="Hapus Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#2A1B17] group-hover:text-[#7A1C28] transition-colors">
                    {proj.name}
                  </h3>

                  <p className="text-xs text-[#544238] leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                {/* Progress & Task Metrics */}
                <div className="space-y-3 pt-4 border-t border-[#EFE8DC]">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E6DCCF] space-y-0.5">
                      <span className="text-[10px] text-[#8C7769] block">Total Task</span>
                      <span className="font-bold text-[#2A1B17] flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-[#7A1C28]" /> {projTasks.length} Task
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E6DCCF] space-y-0.5">
                      <span className="text-[10px] text-[#8C7769] block">Progres Selesai</span>
                      <span className="font-bold text-emerald-700">{percentage}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-[#EFE8DC] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#7A1C28] to-[#9C2B3C] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Date & Open Project Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#8C7769] flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-[#7A1C28]" /> {proj.createdAt}
                    </span>

                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className="py-2 px-3.5 rounded-xl bg-[#7A1C28] hover:bg-[#5C121D] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Lihat Task</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Members Modal */}
      <ProjectMembersModal
        isOpen={!!selectedMemberProject}
        onClose={() => setSelectedMemberProject(null)}
        project={selectedMemberProject}
        currentUser={currentUser}
      />

    </div>
  );
};
