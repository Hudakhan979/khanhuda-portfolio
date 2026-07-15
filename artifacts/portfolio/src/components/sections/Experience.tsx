import { useGetExperience } from '@workspace/api-client-react';
import { format } from 'date-fns';

export function Experience() {
  const { data: experiences = [], isLoading } = useGetExperience();

  const sortedExperiences = [...experiences].sort((a, b) => b.order - a.order);

  return (
    <section id="experience" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16" data-testid="section-title-experience">
          Work <span className="gradient-text">Experience</span>
        </h2>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

          {isLoading ? (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded mb-3 w-1/2" />
                  <div className="h-4 bg-muted rounded mb-2 w-1/3" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : sortedExperiences.length > 0 ? (
            <div className="space-y-12">
              {sortedExperiences.map((exp, index) => {
                const isLeft = index % 2 === 0;
                const companyInitial = exp.company[0];

                return (
                  <div
                    key={exp.id}
                    className={`relative ${isLeft ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'}`}
                    data-testid={`experience-card-${exp.id}`}
                  >
                    {/* Timeline Dot */}
                    <div className="hidden md:block absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary glow-primary" />

                    <div
                      className={`glass rounded-2xl p-6 hover:glass-strong transition-all ${
                        isLeft ? 'md:mr-8' : 'md:ml-8'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Company Logo */}
                        <div
                          className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                            isLeft ? '' : 'md:order-2'
                          }`}
                          style={{ background: 'var(--gradient-aurora)' }}
                        >
                          {companyInitial}
                        </div>

                        <div className={`flex-1 ${isLeft ? '' : 'md:text-right'}`}>
                          {/* Current Badge */}
                          {exp.current && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium mb-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
                              Current
                            </span>
                          )}

                          <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                          <div className="text-lg text-primary font-medium mb-2">{exp.company}</div>
                          <div className="text-sm text-muted-foreground mb-3">
                            {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                            {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}
                            {exp.location && ` • ${exp.location}`}
                          </div>

                          {exp.description && (
                            <p className="text-muted-foreground mb-4">{exp.description}</p>
                          )}

                          {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <ul className={`space-y-2 mb-4 ${isLeft ? '' : 'md:list-inside'}`}>
                              {exp.responsibilities.map((resp, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-primary mt-1">▹</span>
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {exp.techStack && exp.techStack.length > 0 && (
                            <div className={`flex flex-wrap gap-2 ${isLeft ? '' : 'md:justify-end'}`}>
                              {exp.techStack.map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-full glass text-xs font-medium"
                                  data-testid={`tech-${tech.toLowerCase()}`}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No experience entries yet
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
