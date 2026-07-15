import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { Globe, Smartphone, Server, Palette, Cloud, Brain } from 'lucide-react';
import { getProfile } from '../../lib/api';

const ICON_MAP = { Globe, Smartphone, Server, Palette, Cloud, Brain };
const DEFAULT_SERVICES = [
  { title: 'Web Development',   description: 'Full-stack web apps with React, Node.js, and modern databases.',          icon: 'Globe' },
  { title: 'Mobile Apps',       description: 'Cross-platform mobile apps with React Native and Expo.',                  icon: 'Smartphone' },
  { title: 'API Design',        description: 'RESTful and GraphQL APIs that scale to millions of requests.',             icon: 'Server' },
  { title: 'UI/UX Design',      description: 'Pixel-perfect interfaces with Figma and modern CSS.',                     icon: 'Palette' },
  { title: 'Cloud Architecture',description: 'AWS & GCP infrastructure, CI/CD pipelines, Docker, Kubernetes.',          icon: 'Cloud' },
  { title: 'AI Integration',    description: 'LLM-powered features using OpenAI, LangChain, and custom models.',        icon: 'Brain' },
];

export default function Services() {
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => getProfile().then(r => r.data) });
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const services = profile?.services?.length ? profile.services : DEFAULT_SERVICES;

  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-secondary text-sm font-mono text-center mb-3 tracking-widest uppercase">What I Do</p>
        <h2 className="section-title">
          My <span className="gradient-text">Services</span>
        </h2>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const Icon = ICON_MAP[s.icon] || Globe;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl p-6 hover:glass-strong hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                     style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))' }}>
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
