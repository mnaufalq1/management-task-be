import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Calendar, User as UserIcon, AlertCircle } from 'lucide-react';
import { Project, Task, TaskPriority, TaskStatus } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    projectId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    deadline: string;
    assignedTo: string;
  }) => void;
  projects: Project[];
  initialData?: Task | null;
  defaultProjectId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projects,
  initialData,
  defaultProjectId,
}) => {
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('Budi Pratama');

  useEffect(() => {
    if (initialData) {
      setProjectId(initialData.projectId);
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStatus(initialData.status);
      setPriority(initialData.priority);
      setDeadline(initialData.deadline);
      setAssignedTo(initialData.assignedTo || 'Budi Pratama');
    } else {
      setProjectId(defaultProjectId && defaultProjectId !== 'all' ? defaultProjectId : (projects[0]?.id || ''));
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setPriority('Medium');
      // Default deadline + 7 days
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDeadline(d.toISOString().split('T')[0]);
      setAssignedTo('Budi Pratama');
    }
  }, [initialData, isOpen, projects, defaultProjectId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;
    onSubmit({
      projectId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      deadline: deadline || new Date().toISOString().split('T')[0],
      assignedTo: assignedTo.trim() || 'Budi Pratama',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#DFD3C3] rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7A1C28]/10 border border-[#7A1C28]/20 flex items-center justify-center text-[#7A1C28]">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2A1B17]">
                {initialData ? 'Edit Task' : 'Buat Task Baru'}
              </h3>
              <p className="text-xs text-[#8C7769]">
                Lengkapi nama task, deskripsi, status, prioritas, dan tanggal deadline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EFE8DC] text-[#7A1C28] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Dropdown */}
          <div className="space-y-1">
            <label className="text-xs text-[#2A1B17] font-semibold ml-1">
              Pilih Project <span className="text-[#7A1C28]">*</span>
            </label>
            <select
              required
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-2xl py-3 px-4 text-sm text-[#2A1B17] focus:outline-none focus:border-[#7A1C28] cursor-pointer"
            >
              {projects.length === 0 ? (
                <option value="">Belum ada project (Buat project dulu)</option>
              ) : (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Nama Task */}
          <div className="space-y-1">
            <label className="text-xs text-[#2A1B17] font-semibold ml-1">
              Nama Task <span className="text-[#7A1C28]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Desain komponen chart real-time"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-2xl py-3 px-4 text-sm text-[#2A1B17] placeholder-[#8C7769] focus:outline-none focus:border-[#7A1C28] focus:ring-1 focus:ring-[#7A1C28] transition-all"
            />
          </div>

          {/* Deskripsi Task */}
          <div className="space-y-1">
            <label className="text-xs text-[#2A1B17] font-semibold ml-1">Deskripsi Pekerjaan</label>
            <textarea
              rows={3}
              placeholder="Jelaskan langkah pengerjaan atau hasil yang diharapkan dari task ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-2xl py-3 px-4 text-sm text-[#2A1B17] placeholder-[#8C7769] focus:outline-none focus:border-[#7A1C28] focus:ring-1 focus:ring-[#7A1C28] transition-all resize-none"
            />
          </div>

          {/* Grid Status & Prioritas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-1">
              <label className="text-xs text-[#2A1B17] font-semibold ml-1">Status Pekerjaan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-2xl py-3 px-4 text-sm text-[#2A1B17] focus:outline-none focus:border-[#7A1C28] cursor-pointer"
              >
                <option value="To Do">Belum Dimulai (To Do)</option>
                <option value="In Progress">Dalam Proses (In Progress)</option>
                <option value="Completed">Selesai (Completed)</option>
              </select>
            </div>

            {/* Prioritas */}
            <div className="space-y-1">
              <label className="text-xs text-[#2A1B17] font-semibold ml-1">Tingkat Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-2xl py-3 px-4 text-sm text-[#2A1B17] focus:outline-none focus:border-[#7A1C28] cursor-pointer"
              >
                <option value="Low">Rendah (Low)</option>
                <option value="Medium">Sedang (Medium)</option>
                <option value="High">Tinggi / Urgent (High)</option>
              </select>
            </div>
          </div>

          {/* Grid Deadline & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Deadline */}
            <div className="space-y-1">
              <label className="text-xs text-[#2A1B17] font-semibold ml-1">Tanggal Deadline</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-2xl py-3 px-4 text-sm text-[#2A1B17] focus:outline-none focus:border-[#7A1C28] cursor-pointer"
              />
            </div>

            {/* Assignee */}
            <div className="space-y-1">
              <label className="text-xs text-[#2A1B17] font-semibold ml-1">Penanggung Jawab</label>
              <input
                type="text"
                placeholder="Contoh: Budi Pratama"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#DFD3C3] rounded-2xl py-3 px-4 text-sm text-[#2A1B17] placeholder-[#8C7769] focus:outline-none focus:border-[#7A1C28] transition-all"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#EFE8DC]">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-full bg-[#FAF6F0] hover:bg-[#F3EBE0] border border-[#E6DCCF] text-[#4A0E17] text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-full bg-gradient-to-r from-[#5C121D] via-[#7A1C28] to-[#9C2B3C] hover:from-[#4A0E17] hover:to-[#832030] text-white text-xs font-semibold shadow-md shadow-[#4A0E17]/20 cursor-pointer"
            >
              {initialData ? 'Simpan Task' : 'Buat Task'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
