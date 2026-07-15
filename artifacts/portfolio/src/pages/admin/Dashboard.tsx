import { AdminLayout } from '@/components/layout/AdminLayout';
import { useGetAnalytics } from '@workspace/api-client-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { data: analytics, isLoading } = useGetAnalytics();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your portfolio overview.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-8 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : analytics ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass rounded-xl p-6" data-testid="stat-card-projects">
                <p className="text-sm text-muted-foreground mb-2">Total Projects</p>
                <p className="text-3xl font-bold gradient-text">{analytics.totalProjects}</p>
              </div>
              <div className="glass rounded-xl p-6" data-testid="stat-card-skills">
                <p className="text-sm text-muted-foreground mb-2">Total Skills</p>
                <p className="text-3xl font-bold gradient-text">{analytics.totalSkills}</p>
              </div>
              <div className="glass rounded-xl p-6" data-testid="stat-card-messages">
                <p className="text-sm text-muted-foreground mb-2">Total Messages</p>
                <p className="text-3xl font-bold gradient-text">{analytics.totalMessages}</p>
              </div>
              <div className="glass rounded-xl p-6" data-testid="stat-card-unread">
                <p className="text-sm text-muted-foreground mb-2">Unread Messages</p>
                <p className="text-3xl font-bold gradient-text">{analytics.unreadMessages}</p>
              </div>
              <div className="glass rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">Experience Entries</p>
                <p className="text-3xl font-bold gradient-text">{analytics.totalExperience}</p>
              </div>
              <div className="glass rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">Certificates</p>
                <p className="text-3xl font-bold gradient-text">{analytics.totalCertificates}</p>
              </div>
              <div className="glass rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">Testimonials</p>
                <p className="text-3xl font-bold gradient-text">{analytics.totalTestimonials}</p>
              </div>
              <div className="glass rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">Achievements</p>
                <p className="text-3xl font-bold gradient-text">{analytics.totalAchievements}</p>
              </div>
            </div>

            {analytics.recentMessages && analytics.recentMessages.length > 0 && (
              <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Recent Messages</h2>
                <div className="space-y-3">
                  {analytics.recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${message.read ? 'bg-muted/50' : 'bg-primary/10'}`}
                      data-testid={`message-${message.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{message.name}</p>
                          <p className="text-sm text-muted-foreground">{message.email}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">{message.subject}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
