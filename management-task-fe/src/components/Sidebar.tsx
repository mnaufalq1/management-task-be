import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  PieChart, 
  Users, 
  ShieldCheck, 
  LogOut,
  X
} from 'lucide-react';

export type NavTab = 'overview' | 'projects' | 'tasks' | 'charts' | 'team';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onLogout: () => void;
  teamName: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  teamName,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Dashboard Utama',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'projects',
      label: 'Daftar Project',
      icon: <FolderKanban className="w-5 h-5" />,
    },
    {
      id: 'tasks',
      label: 'Manajemen Task',
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      id: 'charts',
      label: 'Visualisasi Chart',
      icon: <PieChart className="w-5 h-5" />,
    },
    {
      id: 'team',
      label: 'Keamanan & Tim',
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const handleTabClick = (tab: NavTab) => {
    onTabChange(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <>
      {/* Brand & Navigation */}
      <div className="p-6 space-y-8">
        {/* Brand Logo in Sidebar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-400 to-amber-200 p-0.5 shadow-md shadow-[#2D060B]/40">
              <div className="w-full h-full bg-[#3B0A10] rounded-[10px] flex items-center justify-center">
                <div className="relative flex items-center justify-center text-amber-300 font-black text-xl tracking-tighter">
                  M
                  <CheckSquare className="w-3.5 h-3.5 text-rose-300 absolute -bottom-0.5 -right-0.5 stroke-[3]" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-xl font-extrabold text-white tracking-tight">Mata</span>
                <span className="text-xl font-bold bg-gradient-to-r from-amber-300 to-rose-200 bg-clip-text text-transparent">App</span>
              </div>
              <span className="text-[10px] text-rose-200/80 block uppercase tracking-wider font-semibold">
                Project Management
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-full hover:bg-rose-900/60 text-rose-200 hover:text-white md:hidden cursor-pointer transition-all"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#7A1C28] via-[#9C2B3C] to-[#B83246] text-white shadow-lg shadow-[#2D060B]/50 font-semibold border border-amber-300/30'
                    : 'text-rose-100/80 hover:text-white hover:bg-[#5C121D]/60'
                }`}
              >
                <span className={isActive ? 'text-amber-300' : 'text-rose-300/80'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Security Badge & Logout */}
      <div className="p-6 space-y-4">
        <div className="p-3.5 rounded-2xl bg-[#3B0A10] border border-rose-900/40 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Privasi Tim Terjamin</span>
          </div>
          <p className="text-[11px] text-rose-200/80 leading-relaxed">
            Data project & task disimpan khusus untuk <strong className="text-amber-200">{teamName}</strong>.
          </p>
        </div>

        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs text-rose-200 hover:text-white hover:bg-[#5C121D]/80 border border-rose-800/40 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#4A0E17] border border-[#3B0A10] flex flex-col justify-between shrink-0 hidden md:flex my-4 rounded-3xl shadow-xl text-white">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />

          {/* Drawer Panel */}
          <aside className="fixed top-0 left-0 bottom-0 w-72 bg-[#4A0E17] border-r border-[#3B0A10] z-50 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto text-white">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
