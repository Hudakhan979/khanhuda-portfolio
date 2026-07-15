import { useEffect, useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { SiGithub } from 'react-icons/si';
import { Linkedin, Twitter } from 'lucide-react';
import { useGetProfile } from '@workspace/api-client-react';
import gsap from 'gsap';

export function Hero() {
  const { data: profile } = useGetProfile();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      gsap.fromTo(
        chars,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const name = profile?.name || 'Alex Johnson';
  const nameChars = name.split('').map((char, i) => (
    <span key={i} className="char inline-block">
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
            animation: 'blob-float-1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)',
            animation: 'blob-float-2 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #F472B6 0%, transparent 70%)',
            animation: 'blob-float-3 18s ease-in-out infinite',
          }}
        />
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        {/* Availability Badge */}
        {profile?.availableForWork && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8" data-testid="availability-badge">
            <span className="w-2 h-2 rounded-full bg-green-400" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
            <span className="text-sm font-medium">Available for Work</span>
          </div>
        )}

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
          <div className="text-white mb-2">Hi, I&apos;m</div>
          <div ref={titleRef} className="gradient-text">
            {nameChars}
          </div>
        </h1>

        {/* Animated Subheading */}
        <div className="text-xl md:text-2xl lg:text-3xl font-medium mb-6 h-10 flex items-center justify-center text-secondary">
          <TypeAnimation
            sequence={[
              'Full Stack Developer',
              2000,
              'React Specialist',
              2000,
              'Node.js Engineer',
              2000,
              'UI/UX Enthusiast',
              2000,
              'Open Source Contributor',
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </div>

        {/* Description */}
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
          {profile?.bio || 'Crafting exceptional digital experiences with modern technologies. Passionate about clean code, elegant design, and solving complex problems.'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => scrollToSection('projects')}
            className="px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 glow-primary"
            style={{ background: 'var(--gradient-primary)' }}
            data-testid="button-view-work"
          >
            View My Work
          </button>
          {profile?.resumeUrl && (
            <a
              href={profile.resumeUrl}
              download
              className="px-8 py-4 rounded-full font-semibold text-lg glass hover:glass-strong transition-all hover:scale-105"
              data-testid="button-download-cv"
            >
              Download CV
            </a>
          )}
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 mb-16">
          {profile?.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:glow-primary transition-all hover:scale-110"
              data-testid="social-link-github"
            >
              <SiGithub className="w-6 h-6" />
            </a>
          )}
          {profile?.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:glow-primary transition-all hover:scale-110"
              data-testid="social-link-linkedin"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          )}
          {profile?.twitter && (
            <a
              href={profile.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:glow-primary transition-all hover:scale-110"
              data-testid="social-link-twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-muted-foreground"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Stats Bar */}
      <div ref={statsRef} className="absolute bottom-0 left-0 right-0 glass-strong border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center" data-testid="stat-experience">
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                {statsInView && <CountUp end={profile?.yearsOfExperience || 5} duration={2} suffix="+" />}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Years Experience</div>
            </div>
            <div className="text-center" data-testid="stat-projects">
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                {statsInView && <CountUp end={profile?.projectsCompleted || 50} duration={2} suffix="+" />}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Projects Completed</div>
            </div>
            <div className="text-center" data-testid="stat-clients">
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                {statsInView && <CountUp end={profile?.happyClients || 30} duration={2} suffix="+" />}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Happy Clients</div>
            </div>
            <div className="text-center" data-testid="stat-contributions">
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                {statsInView && <CountUp end={profile?.openSourceContributions || 10} duration={2} suffix="K+" />}
              </div>
              <div className="text-sm text-muted-foreground mt-1">GitHub Contributions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
