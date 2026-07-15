import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { SiGithub } from 'react-icons/si';
import { Star, GitFork, Users, BookOpen } from 'lucide-react';
import { getGithubStats } from '../../lib/api';

export default function GithubStats() {
  const { data: stats } = useQuery({ queryKey: ['github-stats'], queryFn: () => getGithubStats().then(r => r.data) });
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  if (!stats) return null;

  const counters = [
    { icon: Star,     label: 'Total Stars',  value: stats.totalStars },
    { icon: BookOpen, label: 'Public Repos', value: stats.publicRepos },
    { icon: Users,    label: 'Followers',    value: stats.followers },
    { icon: GitFork,  label: 'Following',    value: stats.following },
  ];

  return (
    <section id="github" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-secondary text-sm font-mono text-center mb-3 tracking-widest uppercase">Open Source</p>
        <h2 className="section-title">
          GitHub <span className="gradient-text">Stats</span>
        </h2>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {counters.map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass rounded-2xl p-5 text-center hover:glass-strong transition-all">
                <Icon size={22} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold gradient-text">{value?.toLocaleString()}</p>
                <p className="text-xs text-white/50 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Top repos */}
          {stats.topRepos?.length > 0 && (
            <div>
              <h3 className="font-semibold text-white/80 mb-4">Top Repositories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass rounded-xl p-4 hover:glass-strong hover:scale-[1.01] transition-all block"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <SiGithub size={14} className="text-white/50 flex-shrink-0 mt-0.5" />
                        <span className="font-medium text-white text-sm">{repo.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/50 flex-shrink-0">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        {repo.stars}
                      </div>
                    </div>
                    {repo.description && (
                      <p className="text-xs text-white/50 leading-relaxed ml-5 mb-2">{repo.description}</p>
                    )}
                    {repo.language && (
                      <div className="ml-5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs text-white/40">{repo.language}</span>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Top languages */}
          {stats.topLanguages?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-white/80 mb-4">Top Languages</h3>
              <div className="flex flex-wrap gap-3">
                {stats.topLanguages.map((lang, i) => (
                  <div key={lang.name} className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: `hsl(${i * 60}, 70%, 60%)` }}
                    />
                    <span className="text-sm text-white/80">{lang.name}</span>
                    <span className="text-xs text-white/40">{lang.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
