import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Plus, 
  User as UserIcon, 
  LogOut, 
  Sparkles,
  ShieldCheck,
  FolderPlus,
  Menu
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onOpenNewProjectModal: () => void;
  onOpenNewTaskModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTabTitle: string;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onOpenNewProjectModal,
  onOpenNewTaskModal,
  searchQuery,
  onSearchChange,
  activeTabTitle,
  onToggleMobileMenu,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="h-20 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#E4D7C5] px-4 sm:px-8 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-sm">
      {/* Title & Search */}
      <div className="flex items-center gap-2.5 sm:gap-4 flex-1 max-w-xl">
        {/* Hamburger Menu Button for Mobile/HP */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2.5 rounded-2xl bg-[#4A0E17] border border-[#7A1C28] text-amber-200 hover:text-white hover:bg-[#5E121F] md:hidden cursor-pointer shrink-0 transition-all shadow-sm"
          title="Buka Menu Navigation"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5 text-amber-300" />
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-[#2A1B17] tracking-wide whitespace-nowrap hidden md:block">
          {activeTabTitle}
        </h1>

        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A1C28]" />
          <input
            type="text"
            placeholder="Cari project, nama task, atau deskripsi..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#FFFFFF] border border-[#DFD3C3] rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#2A1B17] placeholder-[#948174] focus:outline-none focus:border-[#7A1C28] focus:ring-1 focus:ring-[#7A1C28] transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Add Buttons */}
        <button
          onClick={onOpenNewProjectModal}
          className="hidden sm:flex items-center gap-1.5 py-2 px-3.5 rounded-full bg-[#FFFFFF] hover:bg-[#F3EBE0] border border-[#D8C7B5] text-[#4A0E17] text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <FolderPlus className="w-4 h-4 text-[#7A1C28]" />
          <span>Project Baru</span>
        </button>

        <button
          onClick={onOpenNewTaskModal}
          className="flex items-center gap-1.5 py-2 px-4 rounded-full bg-gradient-to-r from-[#5C121D] via-[#7A1C28] to-[#9C2B3C] hover:from-[#4A0E17] hover:to-[#832030] text-white text-xs font-semibold shadow-md shadow-[#4A0E17]/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Buat Task</span>
        </button>

        {/* User Profile Badge */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#FFFFFF] border border-[#DFD3C3] hover:border-[#7A1C28] transition-all cursor-pointer shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5C121D] to-amber-600 p-0.5">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#FFFFFF] flex items-center justify-center text-[#7A1C28] font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-[#2A1B17] leading-tight">{user.name}</p>
              <p className="text-[10px] text-[#7A685D] leading-tight">{user.teamName}</p>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-[#FFFFFF] border border-[#DFD3C3] rounded-2xl p-4 shadow-xl z-50 text-xs space-y-3">
              <div className="pb-3 border-b border-[#EFE8DC]">
                <p className="font-semibold text-[#2A1B17] text-sm">{user.name}</p>
                <p className="text-[#7A685D] text-xs">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7A1C28]/10 text-[#7A1C28] text-[10px] font-semibold border border-[#7A1C28]/20">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{user.teamName}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="p-2 rounded-lg bg-[#FAF6F0] text-[#544238] text-[11px] flex items-center gap-2 border border-[#E8DFD1]">
                  <Sparkles className="w-3.5 h-3.5 text-[#7A1C28]" />
                  <span>MataApp Cloud Sync Active</span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full pt-2 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#7A1C28]/10 hover:bg-[#7A1C28]/20 text-[#7A1C28] border border-[#7A1C28]/20 font-semibold transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
