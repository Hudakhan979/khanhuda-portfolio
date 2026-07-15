import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Trophy, Star, Mic, Award, Medal } from 'lucide-react';
import { getAchievements } from '../../lib/api';

const ICON_MAP = { Trophy, Star, Mic, Award, Medal };

export default function Achievements() {
  const { data: items = [] } = useQuery({ queryKey: ['achievements'], queryFn: () => getAchievements().then(r => r.data) });
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="achievements" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-secondary text-sm font-mono text-center mb-3 tracking-widest uppercase">Recognition</p>
        <h2 className="section-title">
          Achievements & <span className="gradient-text">Awards</span>
        </h2>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] || Trophy;
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass rounded-2xl p-6 hover:glass-strong hover:scale-[1.02] transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))' }}>
                    <Icon size={22} className="text-primary" />
                  </div>
                  {item.year && (
                    <span className="text-xs font-mono text-white/40 mt-1">{item.year}</span>
                  )}
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{item.description}</p>
                )}
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1.5 text-xs text-secondary hover:underline">
                    <ExternalLink size={12} /> View
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
