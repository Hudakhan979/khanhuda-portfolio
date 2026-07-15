import { useGetProfile } from '@workspace/api-client-react';

export function About() {
  const { data: profile } = useGetProfile();

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)
    : 'AJ';

  return (
    <section id="about" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16" data-testid="section-title-about">
          About <span className="gradient-text">Me</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image with Rings */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative" data-testid="profile-image">
              {/* Animated Rings */}
              <div className="absolute inset-0 -m-8">
                <div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
                />
                <div
                  className="absolute inset-0 -m-4 rounded-full border-2 border-secondary/20"
                  style={{ animation: 'pulse-glow 3s ease-in-out infinite 0.5s' }}
                />
                <div
                  className="absolute inset-0 -m-8 rounded-full border-2 border-accent/10"
                  style={{ animation: 'pulse-glow 3s ease-in-out infinite 1s' }}
                />
              </div>

              {/* Avatar Circle */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden">
                <div
                  className="w-full h-full flex items-center justify-center text-8xl font-bold text-white"
                  style={{ background: 'var(--gradient-aurora)' }}
                >
                  {initials}
                </div>
              </div>
            </div>
          </div>

          {/* Bio Content */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold">{profile?.title || 'Full Stack Developer'}</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {profile?.bio || 'I am a passionate full-stack developer with extensive experience in building modern web applications. I specialize in React, Node.js, and cloud technologies.'}
            </p>

            {profile?.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{profile.location}</span>
              </div>
            )}

            {profile?.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{profile.email}</span>
              </div>
            )}

            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:glass-strong transition-all hover:scale-105"
                data-testid="button-download-resume"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </a>
            )}

            {/* Tech Stack Tags */}
            <div className="pt-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">CORE TECHNOLOGIES</h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full glass text-sm font-medium hover:glass-strong transition-all"
                    data-testid={`tech-tag-${tech.toLowerCase()}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
