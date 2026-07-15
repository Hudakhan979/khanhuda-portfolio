import { useState } from 'react';
import { useGetProjects } from '@workspace/api-client-react';
import { SiGithub } from 'react-icons/si';
import { ExternalLink } from 'lucide-react';

const categories = ['All', 'Web', 'Mobile', 'Desktop', 'API', 'Library', 'Other'];

export function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: projects = [], isLoading } = useGetProjects();

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8" data-testid="section-title-projects">
          Featured <span className="gradient-text">Projects</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          A collection of my recent work showcasing various technologies and problem-solving approaches
        </p>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-6 py-3 rounded-full glass focus:glass-strong outline-none transition-all"
            data-testid="input-search-projects"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'text-white glow-primary'
                    : 'glass text-muted-foreground hover:text-white'
                }`}
                style={activeCategory === category ? { background: 'var(--gradient-primary)' } : {}}
                data-testid={`filter-${category.toLowerCase()}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-6">
                  <div className="h-6 bg-muted rounded mb-3" />
                  <div className="h-4 bg-muted rounded mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-16" />
                    <div className="h-6 bg-muted rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="space-y-8">
            {/* Featured Projects - Larger Cards */}
            {featuredProjects.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group glass rounded-2xl overflow-hidden hover:glass-strong transition-all hover:scale-[1.02]"
                    data-testid={`project-card-${project.id}`}
                  >
                    <div className="relative h-64 overflow-hidden">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-6xl font-bold text-white/10"
                          style={{ background: 'var(--gradient-aurora)' }}
                        >
                          {project.title[0]}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold group-hover:gradient-text transition-all">
                          {project.title}
                        </h3>
                        <span className="px-3 py-1 rounded-full glass text-xs font-medium">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                            data-testid={`tech-${tech.toLowerCase()}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:glow-primary transition-all text-sm font-medium"
                            data-testid={`button-live-${project.id}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:glow-secondary transition-all text-sm font-medium"
                            data-testid={`button-github-${project.id}`}
                          >
                            <SiGithub className="w-4 h-4" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Regular Projects - Smaller Cards */}
            {regularProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group glass rounded-2xl overflow-hidden hover:glass-strong transition-all hover:scale-105"
                    data-testid={`project-card-${project.id}`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/10"
                          style={{ background: 'var(--gradient-aurora)' }}
                        >
                          {project.title[0]}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <span className="px-2 py-1 rounded-full glass text-xs">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.techStack.slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-full glass hover:glow-primary transition-all text-xs"
                            data-testid={`button-live-${project.id}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Live
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-full glass hover:glow-secondary transition-all text-xs"
                            data-testid={`button-github-${project.id}`}
                          >
                            <SiGithub className="w-3 h-3" />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            {searchQuery || activeCategory !== 'All'
              ? 'No projects found matching your criteria'
              : 'No projects available yet'}
          </div>
        )}
      </div>
    </section>
  );
}
