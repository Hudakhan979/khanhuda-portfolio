import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderGit2, Zap, Briefcase,
  MessageSquare, LogOut, User, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV = [
  { to: '/admin/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/projects',   label: 'Projects',   icon: FolderGit2 },
  { to: '/admin/skills',     label: 'Skills',     icon: Zap },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/messages',   label: 'Messages',   icon: MessageSquare },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 glass-strong border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <span className="text-xl font-bold font-mono gradient-text">&lt; admin /&gt;</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white glow-primary'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
              style={({ isActive }) =>
                isActive ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))' } : {}
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink size={16} />
            View Portfolio
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-8">
          <h1 className="font-semibold text-white/80">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
              <User size={14} />
            </div>
            <span className="text-sm text-white/80">{admin?.name || 'Admin'}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
