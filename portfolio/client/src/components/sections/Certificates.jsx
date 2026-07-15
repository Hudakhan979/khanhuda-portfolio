import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { Award, Calendar, ExternalLink } from 'lucide-react';
import { getCertificates } from '../../lib/api';

export default function Certificates() {
  const { data: items = [] } = useQuery({ queryKey: ['certificates'], queryFn: () => getCertificates().then(r => r.data) });
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="certificates" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-secondary text-sm font-mono text-center mb-3 tracking-widest uppercase">Credentials</p>
        <h2 className="section-title">
          My <span className="gradient-text">Certificates</span>
        </h2>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 flex gap-5 hover:glass-strong transition-all"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                   style={{ background: 'linear-gradient(135deg, #7C3AED22, #06B6D422)' }}>
                <Award size={26} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white mb-0.5">{item.title}</h3>
                <p className="text-secondary text-sm font-medium mb-2">{item.issuer}</p>
                {item.issueDate && (
                  <p className="text-xs text-white/40 flex items-center gap-1 mb-3">
                    <Calendar size={11} />
                    {new Date(item.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                )}
                {item.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-xs glass text-white/60">{s}</span>
                    ))}
                  </div>
                )}
                {item.credentialUrl && (
                  <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer"
                     className="text-xs text-secondary flex items-center gap-1 hover:underline">
                    <ExternalLink size={11} /> Verify Credential
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
