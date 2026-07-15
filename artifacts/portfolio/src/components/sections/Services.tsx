import { Code, Smartphone, Palette, Database, Cloud, Users } from 'lucide-react';

const services = [
  {
    icon: Code,
    title: 'Web Development',
    description: 'Full-stack web applications using modern frameworks and best practices',
    price: '$50 - $150/hr',
    color: '#7C3AED',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Cross-platform mobile applications with React Native',
    price: '$60 - $140/hr',
    color: '#06B6D4',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Pixel-perfect interfaces that users love to interact with',
    price: '$40 - $120/hr',
    color: '#F472B6',
  },
  {
    icon: Database,
    title: 'API Development',
    description: 'Scalable REST and GraphQL APIs with proper documentation',
    price: '$50 - $130/hr',
    color: '#10B981',
  },
  {
    icon: Cloud,
    title: 'Cloud Architecture',
    description: 'AWS and GCP infrastructure setup and optimization',
    price: '$70 - $160/hr',
    color: '#F59E0B',
  },
  {
    icon: Users,
    title: 'Tech Consulting',
    description: 'Expert guidance on technology decisions and architecture',
    price: '$80 - $200/hr',
    color: '#8B5CF6',
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8" data-testid="section-title-services">
          What I <span className="gradient-text">Offer</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Professional services tailored to bring your ideas to life
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group glass rounded-2xl p-6 hover:glass-strong transition-all hover:scale-105"
                style={{
                  transitionDelay: `${index * 0.1}s`,
                }}
                data-testid={`service-card-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${service.color}, ${service.color}88)`,
                    boxShadow: `0 0 30px ${service.color}40`,
                  }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <div className="pt-4 border-t border-white/10">
                  <span className="text-sm font-semibold text-primary">{service.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
