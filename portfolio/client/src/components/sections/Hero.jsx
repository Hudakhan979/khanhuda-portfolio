import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { SiGithub } from 'react-icons/si';
import { Linkedin, Twitter, Download, ArrowDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../lib/api';
import gsap from 'gsap';

export default function Hero() {
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => getProfile().then(r => r.data) });
  const titleRef = useRef(null);
  const { ref: statsRef, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // GSAP character-by-character name reveal
  useEffect(() => {
    if (!titleRef.current) return;
    const chars = titleRef.current.querySelectorAll('.char');
    gsap.fromTo(chars,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out', delay: 0.3 }
    );
  }, [profile?.name]);

  const name = profile?.name || 'Alex Johnson';
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-25 blur-3xl animate-blob-float"
             style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl"
             style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)', animation: 'blobFloat 25s ease-in-out infinite 3s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full opacity-20 blur-3xl"
             style={{ background: 'radial-gradient(circle, #F472B6 0%, transparent 70%)', animation: 'blobFloat 18s ease-in-out infinite 6s' }} />
      </div>
      <div className="noise" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center pt-20">
        {/* Available badge */}
        {profile?.availableForWork && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
            <span className="text-sm font-medium text-white/80">Available for Work</span>
          </motion.div>
        )}

        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-white/60 text-lg mb-2"
        >
          Hi, I&apos;m
        </motion.p>

        {/* Name */}
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-black mb-4 leading-none"
          aria-label={name}
        >
          {name.split('').map((char, i) => (
            <span key={i} className="char inline-block gradient-text-aurora" style={{ opacity: 0 }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Typing subtitle */}
        <div className="text-xl md:text-2xl font-medium mb-6 h-10 flex items-center justify-center text-secondary">
          <TypeAnimation
            sequence={['Full Stack Developer', 2000, 'React Specialist', 2000, 'Node.js Engineer', 2000, 'UI/UX Enthusiast', 2000, 'Open Source Contributor', 2000]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/60 max-w-2xl mx-auto mb-10 text-lg leading-relaxed"
        >
          {profile?.bio || 'Crafting exceptional digital experiences with modern technologies. Passionate about clean code, elegant design, and solving complex problems.'}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <button
            onClick={() => scrollTo('projects')}
            className="px-8 py-4 rounded-full font-semibold text-lg text-white glow-primary hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
          >
            View My Work
          </button>
          {profile?.resumeUrl && (
            <a
              href={profile.resumeUrl}
              download
              className="px-8 py-4 rounded-full font-semibold text-lg glass hover:glass-strong hover:scale-105 transition-all flex items-center gap-2"
            >
              <Download size={18} />
              Download CV
            </a>
          )}
        </motion.div>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer"
               className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:glow-primary hover:scale-110 transition-all">
              <SiGithub size={22} />
            </a>
          )}
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
               className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:glow-primary hover:scale-110 transition-all">
              <Linkedin size={22} />
            </a>
          )}
          {profile?.twitter && (
            <a href={profile.twitter} target="_blank" rel="noopener noreferrer"
               className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:glow-primary hover:scale-110 transition-all">
              <Twitter size={22} />
            </a>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <button onClick={() => scrollTo('about')} className="text-white/40 hover:text-white/70 transition-colors animate-bounce">
          <ArrowDown size={28} />
        </button>
      </div>

      {/* Stats bar */}
      <div ref={statsRef} className="absolute bottom-0 left-0 right-0 glass-strong border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { end: profile?.yearsOfExperience || 5,  suffix: '+', label: 'Years Experience' },
            { end: profile?.projectsCompleted || 50,  suffix: '+', label: 'Projects Completed' },
            { end: profile?.happyClients || 30,       suffix: '+', label: 'Happy Clients' },
            { end: profile?.openSourceContributions || 200, suffix: '+', label: 'OSS Contributions' },
          ].map(({ end, suffix, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold gradient-text">
                {inView ? <CountUp end={end} duration={2} suffix={suffix} /> : `0${suffix}`}
              </div>
              <div className="text-sm text-white/50 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
