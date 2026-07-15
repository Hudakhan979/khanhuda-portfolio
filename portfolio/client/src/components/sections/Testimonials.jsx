import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { getTestimonials } from '../../lib/api';

export default function Testimonials() {
  const { data: all = [], isLoading } = useQuery({ queryKey: ['testimonials'], queryFn: () => getTestimonials().then(r => r.data) });
  const [idx, setIdx] = useState(0);
  const items = all.length ? all : [];

  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

  if (isLoading) return null;
  if (!items.length) return null;

  const item = items[idx];

  return (
    <section id="testimonials" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-secondary text-sm font-mono text-center mb-3 tracking-widest uppercase">Social Proof</p>
        <h2 className="section-title">
          What People <span className="gradient-text">Say</span>
        </h2>

        <div className="max-w-3xl mx-auto">
          <div className="relative glass rounded-3xl p-8 md:p-12">
            <Quote size={48} className="absolute top-8 right-8 text-primary/20" />

            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 italic">
                  &ldquo;{item.content}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                       style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                    {item.name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-white/50">{item.role}{item.company ? `, ${item.company}` : ''}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {items.length > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <button onClick={prev} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {items.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-primary' : 'bg-white/30'}`} />
                  ))}
                </div>
                <button onClick={next} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
