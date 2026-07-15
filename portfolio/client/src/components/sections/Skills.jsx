import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import * as SiIcons from 'react-icons/si';
import { getSkills } from '../../lib/api';

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Cloud', 'Languages', 'AI', 'Tools'];

export default function Skills() {
  const [active, setActive] = useState('Frontend');
  const { data: skills = [], isLoading } = useQuery({ queryKey: ['skills'], queryFn: () => getSkills().then(r => r.data) });
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const filtered = skills.filter(s => s.category === active);

  const getIcon = (iconName) => {
    const Icon = SiIcons[iconName];
    return Icon ? <Icon className="w-7 h-7" /> : <span className="text-2xl">⚙️</span>;
  };

  return (
    <section id="skills" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-secondary text-sm font-mono text-center mb-3 tracking-widest uppercase">What I Know</p>
        <h2 className="section-title">
          My <span className="gradient-text">Skills</span>
        </h2>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                active === cat
                  ? 'text-white glow-primary scale-105'
                  : 'glass text-white/60 hover:text-white hover:bg-white/5'
              }`}
              style={active === cat ? { background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="wait">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-6 animate-pulse h-32" />
                ))
              : filtered.map((skill, i) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="glass rounded-2xl p-6 hover:glass-strong hover:scale-[1.02] transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ background: skill.color ? `${skill.color}22` : 'rgba(124,58,237,0.15)', color: skill.color || '#7C3AED' }}
                      >
                        {getIcon(skill.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{skill.name}</h3>
                        <p className="text-xs text-white/50">{skill.proficiency}% proficiency</p>
                      </div>
                    </div>
                    <div className="skill-bar">
                      <motion.div
                        className="skill-bar-fill"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.proficiency}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: i * 0.07 + 0.2, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                ))
            }
          </AnimatePresence>
          {!isLoading && filtered.length === 0 && (
            <div className="col-span-3 text-center text-white/40 py-12">
              No skills in this category yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
