import { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { SiGithub } from 'react-icons/si';
import { ExternalLink, Search, Star } from 'lucide-react';
import { getProjects } from '../../lib/api';

const CATS = ['All', 'Full Stack', 'Frontend', 'Backend', 'Mobile', 'AI/ML', 'DevOps'];

export default function Projects() {
  const [search,  setSearch]  = useState('');
  const [cat,     setCat]     = useState('All');
  const { data, isLoading } = useQuery({ queryKey: ['projects'], queryFn: () => getProjects().then(r => r.data) });
  const all = data?.projects ?? data ?? [];

  const filtered = all.filter((p) => {
    const matchCat    = cat === 'All' || p.category === cat;
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.filter(p => p.featured);
  const regular  = filtered.filter(p => !p.featured);

  return (
    <section id="projects" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-secondary text-sm font-mono text-center mb-3 tracking-widest uppercase">Portfolio</p>
        <h2 className="section-title">
          Featured <span className="gradient-text">Projects</span>
        </h2>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl glass bg-transparent text-sm text-white placeholder-white/40 outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  cat === c
                    ? 'text-white'
                    : 'glass text-white/60 hover:text-white'
                }`}
                style={cat === c ? { background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' } : {}}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Featured grid */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {featured.map((p, i) => (
              <ProjectCard key={p._id} project={p} large={i === 0} delay={i * 0.1} />
            ))}
          </div>
        )}

        {/* Regular grid */}
        {regular.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((p, i) => (
              <ProjectCard key={p._id} project={p} delay={i * 0.08} />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-white/40">
            No projects found. Try adjusting filters.
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project: p, large, delay = 0 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { useInView: _u, ...rest } = { useInView: null };
  void rest;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={`glass rounded-2xl overflow-hidden hover:glass-strong hover:scale-[1.01] transition-all group flex flex-col ${large ? 'lg:col-span-1' : ''}`}
    >
      {/* Image / placeholder */}
      <div className="h-48 relative overflow-hidden flex-shrink-0"
           style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))' }}>
        {p.imageUrl
          ? <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl opacity-40">
                  {p.category === 'AI/ML' ? '🤖' : p.category === 'Mobile' ? '📱' : p.category === 'Frontend' ? '🎨' : '⚡'}
                </span>
              </div>
            )
        }
        {p.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
               style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.8), rgba(6,182,212,0.6))' }}>
            <Star size={10} fill="currentColor" /> Featured
          </div>
        )}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs glass text-white/70">{p.category}</div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-2 text-white">{p.title}</h3>
        <p className="text-white/60 text-sm leading-relaxed flex-1 mb-4">{p.description}</p>

        {p.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {p.techStack.slice(0, 5).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full text-xs glass text-white/60">{t}</span>
            ))}
            {p.techStack.length > 5 && (
              <span className="px-2 py-0.5 rounded-full text-xs text-white/40">+{p.techStack.length - 5}</span>
            )}
          </div>
        )}

        <div className="flex gap-3 mt-auto">
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
               className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg glass text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
              <SiGithub size={14} /> Code
            </a>
          )}
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
               className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-white font-medium hover:opacity-90 transition-all"
               style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
              <ExternalLink size={14} /> Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Fix missing import
function useInView(opts) {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), opts);
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);
  return [setRef, inView];
}
// import { useState, useEffect } from 'react';
