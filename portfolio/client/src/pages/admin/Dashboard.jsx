import { useQuery } from '@tanstack/react-query';
import { FolderGit2, Zap, Briefcase, MessageSquare, Trophy, Award, Star, Mail } from 'lucide-react';
import { getAnalytics } from '../../lib/api';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['analytics'], queryFn: () => getAnalytics().then(r => r.data) });

  const stats = [
    { label: 'Projects',      value: data?.counts?.projects,      icon: FolderGit2, color: '#7C3AED' },
    { label: 'Skills',        value: data?.counts?.skills,         icon: Zap,        color: '#06B6D4' },
    { label: 'Experience',    value: data?.counts?.experience,     icon: Briefcase,  color: '#F472B6' },
    { label: 'Testimonials',  value: data?.counts?.testimonials,   icon: Star,       color: '#FBBF24' },
    { label: 'Certificates',  value: data?.counts?.certificates,   icon: Award,      color: '#34D399' },
    { label: 'Achievements',  value: data?.counts?.achievements,   icon: Trophy,     color: '#F97316' },
    { label: 'Total Messages',value: data?.counts?.messages?.total, icon: MessageSquare, color: '#60A5FA' },
    { label: 'Unread',        value: data?.counts?.messages?.unread, icon: Mail,     color: '#FB7185' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-white/50 text-sm mt-1">Overview of your portfolio content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/50 font-mono uppercase tracking-wide">{label}</span>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-3xl font-bold text-white">
              {isLoading ? '—' : (value ?? 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Recent messages */}
      {data?.recentMessages?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Recent Messages</h3>
          <div className="space-y-3">
            {data.recentMessages.map((msg) => (
              <div key={msg._id} className={`glass rounded-xl p-4 flex items-start gap-4 ${!msg.read ? 'border border-primary/30' : ''}`}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                     style={{ background: 'linear-gradient(135deg, #7C3AED44, #06B6D444)' }}>
                  {msg.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-white text-sm">{msg.name}</span>
                    {!msg.read && (
                      <span className="px-1.5 py-0.5 rounded-full text-xs font-medium text-white"
                            style={{ background: 'rgba(124,58,237,0.4)' }}>
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs">{msg.email}</p>
                  <p className="text-white/70 text-sm mt-1 truncate">{msg.message}</p>
                </div>
                <p className="text-xs text-white/30 flex-shrink-0">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
