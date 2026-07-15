import { useGetTestimonials } from '@workspace/api-client-react';
import { Star } from 'lucide-react';

export function Testimonials() {
  const { data: testimonials = [], isLoading } = useGetTestimonials();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2);
  };

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16" data-testid="section-title-testimonials">
          Client <span className="gradient-text">Testimonials</span>
        </h2>

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-full md:w-96 glass rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="relative">
            <div className="flex gap-6 animate-scroll hover:pause" style={{ animation: 'wave 30s linear infinite' }}>
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="flex-shrink-0 w-full md:w-96 glass rounded-2xl p-6 hover:glass-strong transition-all"
                  data-testid={`testimonial-card-${testimonial.id}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    {testimonial.avatarUrl ? (
                      <img
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: 'var(--gradient-aurora)' }}
                      >
                        {getInitials(testimonial.name)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No testimonials available yet
          </div>
        )}
      </div>
    </section>
  );
}
