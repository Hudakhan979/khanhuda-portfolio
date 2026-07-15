import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Mail, Calendar, Code2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../lib/api';

export default function About() {
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => getProfile().then(r => r.data) });
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const details = [
    { icon: MapPin,    label: 'Location', value: profile?.location || 'San Francisco, CA' },
    { icon: Mail,      label: 'Email',    value: profile?.email    || 'alex@portfolio.dev' },
    { icon: Calendar,  label: 'Available',value: profile?.availableForWork ? 'Open to opportunities' : 'Not available' },
    { icon: Code2,     label: 'Focus',    value: 'Full Stack Development' },
  ];

  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Text */}
          <div>
            <p className="text-secondary text-sm font-mono mb-3 tracking-widest uppercase">About Me</p>
            <h2 className="section-title text-left mb-6">
              Passionate about <span className="gradient-text">great code</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              {profile?.bio || "I'm a passionate Full Stack Developer with 5+ years of experience building exceptional digital experiences. I specialize in React, Node.js, and cloud architecture — turning complex problems into elegant, performant solutions."}
            </p>
            <p className="text-white/50 text-base leading-relaxed mb-8">
              When I&apos;m not coding, I&apos;m contributing to open source, speaking at conferences, or exploring the latest in AI/ML. I believe the best software is built at the intersection of technical excellence and delightful user experience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="glass rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                       style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))' }}>
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 font-mono uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-white/90 font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual card stack */}
          <div className="relative flex items-center justify-center h-96">
            {/* Background cards */}
            <div className="absolute w-64 h-80 glass rounded-3xl rotate-6 opacity-40"
                 style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))' }} />
            <div className="absolute w-64 h-80 glass rounded-3xl -rotate-3 opacity-60"
                 style={{ background: 'linear-gradient(135deg, rgba(244,114,182,0.08), rgba(124,58,237,0.05))' }} />
            {/* Main card */}
            <div className="relative w-64 h-80 glass-strong rounded-3xl p-6 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                   style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                👨‍💻
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">{profile?.name || 'Alex Johnson'}</p>
                <p className="text-sm text-white/60 mt-1">{profile?.title || 'Full Stack Developer'}</p>
              </div>
              <div className="w-full pt-3 border-t border-white/10">
                <p className="text-xs text-center text-white/40 font-mono">{profile?.tagline || 'Building things that matter'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
