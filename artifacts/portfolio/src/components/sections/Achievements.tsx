import { useGetAchievements } from '@workspace/api-client-react';
import { Award, Trophy, Star, Target, Zap, Crown } from 'lucide-react';

const iconMap: Record<string, any> = {
  Award,
  Trophy,
  Star,
  Target,
  Zap,
  Crown,
};

export function Achievements() {
  const { data: achievements = [], isLoading } = useGetAchievements();

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Award;
    return <Icon className="w-8 h-8" />;
  };

  return (
    <section id="achievements" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16" data-testid="section-title-achievements">
          Notable <span className="gradient-text">Achievements</span>
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className="glass rounded-2xl p-6 hover:glass-strong transition-all hover:scale-105"
                style={{
                  transitionDelay: `${index * 0.05}s`,
                }}
                data-testid={`achievement-card-${achievement.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center glow-primary"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    {getIcon(achievement.icon)}
                  </div>
                  <span className="px-3 py-1 rounded-full glass text-xs font-medium">
                    {achievement.year}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                {achievement.url && (
                  <a
                    href={achievement.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-secondary transition-colors"
                    data-testid={`achievement-link-${achievement.id}`}
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No achievements available yet
          </div>
        )}
      </div>
    </section>
  );
}
