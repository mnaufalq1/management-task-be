import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { ShieldCheck, Lock, Users, Building2, CheckCircle2, Key } from 'lucide-react';
import { api } from '../services/api';

interface TeamManagerProps {
  user: User;
}

export const TeamManager: React.FC<TeamManagerProps> = ({ user }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const apiUsers = await api.getUsers();
      if (apiUsers && apiUsers.length > 0) {
        setUsers(apiUsers);
      } else {
        setUsers([user]);
      }
    } catch {
      setUsers([user]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E6DCCF] shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" /> Autentikasi Pengguna & Keamanan Privasi Tim
        </div>
        <h2 className="text-2xl font-bold text-[#2A1B17]">Informasi Tim & Akses Terproteksi</h2>
        <p className="text-[#544238] text-sm max-w-2xl leading-relaxed">
          Sistem MataApp memastikan setiap project, task, dan data performa tim Anda tersimpan secara terisolasi dan terenkripsi melalui terintegrasinya backend Vercel.
        </p>
      </div>

      {/* Security Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6DCCF] space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-[#7A1C28] font-bold text-sm">
            <Lock className="w-4 h-4 text-[#7A1C28]" /> Isolasi Data Multi-Tenant
          </div>
          <p className="text-xs text-[#544238] leading-relaxed">
            Pengguna Aktif: <strong className="text-[#2A1B17]">{user.email}</strong>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6DCCF] space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-[#7A1C28] font-bold text-sm">
            <Building2 className="w-4 h-4 text-[#7A1C28]" /> Ruang Kerja Tim
          </div>
          <p className="text-xs text-[#544238] leading-relaxed">
            Terhubung dengan: <strong className="text-[#2A1B17]">https://management-task-be-fxgb.vercel.app</strong>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6DCCF] space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-[#7A1C28] font-bold text-sm">
            <Key className="w-4 h-4 text-emerald-700" /> Sesi Autentikasi Backend
          </div>
          <p className="text-xs text-[#544238] leading-relaxed">
            Status: <span className="text-emerald-700 font-bold">Terhubung ke API Server</span>
          </p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-[#FFFFFF] border border-[#E6DCCF] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DC]">
          <div>
            <h3 className="text-base font-bold text-[#2A1B17] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#7A1C28]" />
              Daftar Pengguna Backend ({users.length})
            </h3>
            <p className="text-xs text-[#8C7769]">Pengguna terdaftar di server backend task management</p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-xs text-[#8C7769] py-4">Memuat pengguna dari backend...</p>
        ) : (
          <div className="space-y-3">
            {users.map((member, idx) => (
              <div
                key={member.id || idx}
                className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E6DCCF] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#DFD3C3]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5C121D] to-[#7A1C28] text-white text-xs font-bold flex items-center justify-center border border-[#DFD3C3]">
                      {(member.name || 'U').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-[#2A1B17] flex items-center gap-2">
                      {member.name}
                      {member.id === user.id && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                          Anda
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-[#8C7769]">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#7A1C28] px-3 py-1 rounded-full bg-[#7A1C28]/10 border border-[#7A1C28]/20 font-semibold">
                    {member.id === user.id ? 'Pemilik Tim (Admin)' : 'Anggota Tim'}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
