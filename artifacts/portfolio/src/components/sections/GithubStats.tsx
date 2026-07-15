import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { useGetGithubStats } from '@workspace/api-client-react';

export function GithubStats() {
  const { data: stats, isLoading } = useGetGithubStats();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="github-stats" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16" data-testid="section-title-github">
          GitHub <span className="gradient-text">Activity</span>
        </h2>

        {isLoading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-4 animate-pulse">
                  <div className="h-8 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : stats ? (
          <div className="space-y-12" ref={ref}>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="glass rounded-xl p-4 text-center" data-testid="stat-repos">
                <div className="text-3xl font-bold gradient-text mb-1">
                  {inView && <CountUp end={stats.publicRepos} duration={2} />}
                </div>
                <div className="text-xs text-muted-foreground">Repositories</div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="stat-followers">
                <div className="text-3xl font-bold gradient-text mb-1">
                  {inView && <CountUp end={stats.followers} duration={2} />}
                </div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="stat-stars">
                <div className="text-3xl font-bold gradient-text mb-1">
                  {inView && <CountUp end={stats.totalStars} duration={2} />}
                </div>
                <div className="text-xs text-muted-foreground">Total Stars</div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="stat-commits">
                <div className="text-3xl font-bold gradient-text mb-1">
                  {inView && <CountUp end={stats.totalCommits} duration={2} />}
                </div>
                <div className="text-xs text-muted-foreground">Commits</div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="stat-streak">
                <div className="text-3xl font-bold gradient-text mb-1">
                  {inView && <CountUp end={stats.contributionStreak} duration={2} />}
                </div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>

            {/* Top Languages */}
            {stats.topLanguages && stats.topLanguages.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Top Languages</h3>
                <div className="space-y-4">
                  {stats.topLanguages.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-muted-foreground">{lang.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: inView ? `${lang.percentage}%` : '0%',
                            backgroundColor: lang.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contribution Heatmap */}
            {stats.contributions && stats.contributions.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Contribution Activity</h3>
                <div className="grid grid-cols-12 md:grid-cols-24 lg:grid-cols-52 gap-1">
                  {stats.contributions.slice(-364).map((day, i) => {
                    const opacity = day.count === 0 ? 0.1 : Math.min(day.count / 10, 1);
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded-sm"
                        style={{
                          backgroundColor: `rgba(124, 58, 237, ${opacity})`,
                        }}
                        title={`${day.date}: ${day.count} contributions`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            GitHub stats not available
          </div>
        )}
      </div>
    </section>
  );
}
