import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast';
import { Send, MapPin, Mail, Clock } from 'lucide-react';
import { submitContact } from '../../lib/api';

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await submitContact(data);
      toast.success('Message sent! I\'ll get back to you soon.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send. Please try again.');
    }
  };

  const INFO = [
    { icon: Mail,   label: 'Email',    value: 'alex@portfolio.dev' },
    { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
    { icon: Clock,  label: 'Response', value: 'Within 24 hours' },
  ];

  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-secondary text-sm font-mono text-center mb-3 tracking-widest uppercase">Get In Touch</p>
        <h2 className="section-title">
          Let&apos;s <span className="gradient-text">Work Together</span>
        </h2>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto"
        >
          {/* Info */}
          <div>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Have a project in mind? I&apos;d love to hear about it. Send me a message and let&apos;s create something amazing together.
            </p>
            <div className="space-y-4">
              {INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="glass rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                       style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))' }}>
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wide font-mono">{label}</p>
                    <p className="text-white/90 font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 font-mono uppercase tracking-wide mb-1.5 block">Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl glass bg-transparent text-white placeholder-white/30 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-xs text-white/50 font-mono uppercase tracking-wide mb-1.5 block">Email *</label>
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl glass bg-transparent text-white placeholder-white/30 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 font-mono uppercase tracking-wide mb-1.5 block">Subject</label>
              <input
                {...register('subject')}
                placeholder="Project inquiry, collaboration, etc."
                className="w-full px-4 py-3 rounded-xl glass bg-transparent text-white placeholder-white/30 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition"
              />
            </div>

            <div>
              <label className="text-xs text-white/50 font-mono uppercase tracking-wide mb-1.5 block">Message *</label>
              <textarea
                {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'At least 10 characters' } })}
                rows={5}
                placeholder="Tell me about your project..."
                className="w-full px-4 py-3 rounded-xl glass bg-transparent text-white placeholder-white/30 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition resize-none"
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <><Send size={18} /> Send Message</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
