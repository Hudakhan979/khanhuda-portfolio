import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useGetSkills } from '@workspace/api-client-react';
import * as SiIcons from 'react-icons/si';

const categories = [
  { id: 'Frontend', label: 'Frontend' },
  { id: 'Backend', label: 'Backend' },
  { id: 'Database', label: 'Database' },
  { id: 'Cloud', label: 'Cloud' },
  { id: 'Tools', label: 'Tools' },
  { id: 'AI', label: 'AI' },
  { id: 'Languages', label: 'Languages' },
];

export function Skills() {
  const [activeTab, setActiveTab] = useState('Frontend');
  const { data: skills = [], isLoading } = useGetSkills();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const filteredSkills = skills.filter(skill => skill.category === activeTab);

  const getIcon = (iconName: string) => {
    const IconComponent = (SiIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8" /> : null;
  };

  return (
    <section id="skills" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16" data-testid="section-title-skills">
          My <span className="gradient-text">Skills</span>
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === category.id
                  ? 'text-white glow-primary'
                  : 'glass text-muted-foreground hover:text-white'
              }`}
              style={activeTab === category.id ? { background: 'var(--gradient-primary)' } : {}}
              data-testid={`tab-${category.id.toLowerCase()}`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-3" />
                <div className="h-2 bg-muted rounded" />
              </div>
            ))
          ) : filteredSkills.length > 0 ? (
            filteredSkills.map((skill, index) => (
              <div
                key={skill.id}
                className="glass rounded-2xl p-6 hover:glass-strong transition-all hover:scale-105"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${index * 0.1}s`,
                }}
                data-testid={`skill-card-${skill.id}`}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: skill.color || 'var(--gradient-primary)',
                  }}
                >
                  {getIcon(skill.icon)}
                </div>
                <h3 className="text-xl font-bold mb-3">{skill.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Proficiency</span>
                    <span>{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: inView ? `${skill.proficiency}%` : '0%',
                        background: 'var(--gradient-primary)',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No skills found in this category
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
