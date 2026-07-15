import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { getExperience } from '../../lib/api';

function fmt(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Experience() {
  const { data: items = [], isLoading } = useQuery({ queryKey: ['experience'], queryFn: () => getExperience().then(r => r.data) });
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="experience" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-secondary text-sm font-mono text-center mb-3 tracking-widest uppercase">Work History</p>
        <h2 className="section-title">
          My <span className="gradient-text">Experience</span>
        </h2>

        <div ref={ref} className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-transparent opacity-30" />

          <div className="space-y-10">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-6 ml-16 animate-pulse h-40" />
                ))
              : items.map((item, i) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    className="relative flex gap-6"
                  >
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-16 flex justify-center">
                      <div className={`w-4 h-4 rounded-full border-2 mt-6 ${item.current ? 'border-primary bg-primary animate-pulse-glow' : 'border-white/30 bg-background'}`} />
                    </div>

                    {/* Card */}
                    <div className="flex-1 glass rounded-2xl p-6 hover:glass-strong transition-all">
                      {item.current && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 text-white"
                              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.2))' }}>
                          Current
                        </span>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-white">{item.role}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.companyUrl ? (
                              <a href={item.companyUrl} target="_blank" rel="noopener noreferrer"
                                 className="text-secondary font-medium hover:underline flex items-center gap-1">
                                {item.company} <ExternalLink size={12} />
                              </a>
                            ) : (
                              <span className="text-secondary font-medium">{item.company}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-white/50 flex flex-col items-start sm:items-end gap-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {fmt(item.startDate)} — {item.current ? 'Present' : fmt(item.endDate)}
                          </span>
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {item.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-white/60 text-sm mb-4">{item.description}</p>
                      )}

                      {item.responsibilities?.length > 0 && (
                        <ul className="space-y-1.5 mb-4">
                          {item.responsibilities.map((r, ri) => (
                            <li key={ri} className="flex items-start gap-2 text-sm text-white/60">
                              <span className="text-primary mt-1 flex-shrink-0">▸</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.techStack.map((t) => (
                            <span key={t} className="px-2.5 py-0.5 rounded-full text-xs glass text-white/70">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
            }
          </div>
        </div>
      </div>
    </section>
  );
}
