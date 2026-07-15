import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useGetMe } from '@workspace/api-client-react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Code, 
  Briefcase, 
  MessageSquare, 
  Award, 
  Trophy, 
  FileText,
  BarChart3,
  LogOut
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/dashboard/projects' },
  { icon: Code, label: 'Skills', path: '/admin/dashboard/skills' },
  { icon: Briefcase, label: 'Experience', path: '/admin/dashboard/experience' },
  { icon: MessageSquare, label: 'Testimonials', path: '/admin/dashboard/testimonials' },
  { icon: FileText, label: 'Certificates', path: '/admin/dashboard/certificates' },
  { icon: Trophy, label: 'Achievements', path: '/admin/dashboard/achievements' },
  { icon: Award, label: 'Messages', path: '/admin/dashboard/messages' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/dashboard/analytics' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading, isError } = useGetMe();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      setLocation('/admin');
    }
  }, [isLoading, isError, user, setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('portfolio_token');
    setLocation('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 glass-strong border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold gradient-text">&lt; dev /&gt;</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass hover:glass-strong transition-all text-sm"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
