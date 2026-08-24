import React, { useState, useEffect } from 'react';
import { X, Users, UserPlus, Trash2, CheckCircle, Shield, Mail } from 'lucide-react';
import { Project, ProjectMember, User } from '../types';
import { api } from '../services/api';

interface ProjectMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  currentUser: User;
}

export const ProjectMembersModal: React.FC<ProjectMembersModalProps> = ({
  isOpen,
  onClose,
  project,
  currentUser,
}) => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      fetchMembersAndUsers();
    }
  }, [isOpen, project]);

  const fetchMembersAndUsers = async () => {
    if (!project) return;
    setIsLoading(true);
    try {
      const [mList, uList] = await Promise.all([
        api.getProjectMembers(project.id),
        api.getUsers(),
      ]);
      setMembers(mList);
      setAllUsers(uList);
    } catch (err) {
      console.error('Error fetching project members:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  // Filter out users who are already project members
  const memberUserIds = new Set(members.map((m) => m.userId));
  const availableUsers = allUsers.filter((u) => !memberUserIds.has(u.id));

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setIsSubmitting(true);
    try {
      await api.addProjectMember(project.id, selectedUserId);
      setSelectedUserId('');
      await fetchMembersAndUsers();
    } catch (err) {
      console.error('Error adding member:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus anggota ini dari project?')) return;
    try {
      await api.deleteProjectMember(memberId);
      await fetchMembersAndUsers();
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#DFD3C3] rounded-3xl w-full max-w-xl shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#EFE8DC] flex items-center justify-between bg-[#FAF6F0]">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#7A1C28]/10 text-[#7A1C28] border border-[#7A1C28]/20">
              Project Members
            </span>
            <h3 className="text-xl font-bold text-[#2A1B17]">Anggota Project: {project.name}</h3>
            <p className="text-xs text-[#8C7769]">Kelola tim dan kolaborator yang memiliki akses ke project ini</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EFE8DC] text-[#7A1C28] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Add Member Form */}
          <div className="bg-[#FAF6F0] border border-[#E6DCCF] p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-[#2A1B17] flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-[#7A1C28]" /> Tambah Anggota Tim Baru
            </h4>

            {availableUsers.length === 0 ? (
              <p className="text-xs text-[#8C7769] italic">
                Semua pengguna terdaftar telah ditambahkan ke project ini atau belum ada pengguna baru.
              </p>
            ) : (
              <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="flex-1 bg-[#FFFFFF] border border-[#DFD3C3] rounded-xl py-2 px-3 text-xs text-[#2A1B17] focus:outline-none focus:border-[#7A1C28] focus:ring-1 focus:ring-[#7A1C28] transition-all"
                >
                  <option value="">-- Pilih Pengguna Terdaftar --</option>
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={!selectedUserId || isSubmitting}
                  className="py-2 px-4 rounded-xl bg-[#7A1C28] hover:bg-[#5C121D] disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </form>
            )}
          </div>

          {/* Members List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C7769] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Daftar Anggota Project ({members.length})
            </h4>

            {isLoading ? (
              <p className="text-xs text-center py-6 text-[#8C7769]">Memuat data anggota project...</p>
            ) : members.length === 0 ? (
              <div className="text-center py-8 bg-[#FAF6F0] border border-dashed border-[#DFD3C3] rounded-2xl space-y-2">
                <Users className="w-8 h-8 text-[#9C8A7D] mx-auto" />
                <p className="text-xs text-[#544238]">Belum ada anggota yang ditambahkan.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E6DCCF] flex items-center justify-between gap-3 shadow-sm hover:border-[#7A1C28]/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5C121D] to-[#7A1C28] text-white text-xs font-bold flex items-center justify-center border border-[#DFD3C3]">
                        {(member.userName || 'M').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#2A1B17] flex items-center gap-1.5">
                          {member.userName || 'Member Tim'}
                          {member.userRole && (
                            <span className="text-[10px] text-[#7A1C28] bg-[#7A1C28]/10 px-1.5 py-0.2 rounded border border-[#7A1C28]/20 font-medium">
                              {member.userRole}
                            </span>
                          )}
                        </h5>
                        <p className="text-[11px] text-[#8C7769] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#8C7769]" /> {member.userEmail || 'member@mataapp.com'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                      title="Hapus Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF6F0] border-t border-[#EFE8DC] flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-full bg-[#EFE8DC] hover:bg-[#E2D8C8] text-[#2A1B17] text-xs font-semibold cursor-pointer transition-all"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
