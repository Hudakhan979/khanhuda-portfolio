import { useState } from 'react';
import { useGetCertificates } from '@workspace/api-client-react';
import { format } from 'date-fns';
import { Award, ExternalLink } from 'lucide-react';

export function Certificates() {
  const { data: certificates = [], isLoading } = useGetCertificates();
  const [flipped, setFlipped] = useState<number[]>([]);

  const toggleFlip = (id: number) => {
    setFlipped(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <section id="certificates" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16" data-testid="section-title-certificates">
          Certifications & <span className="gradient-text">Credentials</span>
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="relative h-64 cursor-pointer"
                style={{ perspective: '1000px' }}
                onClick={() => toggleFlip(cert.id)}
                data-testid={`certificate-card-${cert.id}`}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped.includes(cert.id) ? 'rotateY(180deg)' : 'rotateY(0)',
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 glass rounded-2xl p-6 backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 glow-primary"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{cert.title}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{cert.issuer}</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Issued: {format(new Date(cert.issueDate), 'MMM yyyy')}
                      {cert.expiryDate && (
                        <> • Expires: {format(new Date(cert.expiryDate), 'MMM yyyy')}</>
                      )}
                    </p>
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded bg-primary/10 text-primary text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 3 && (
                          <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs">
                            +{cert.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                      Click to flip
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 glass-strong rounded-2xl p-6 backface-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div className="h-full flex flex-col justify-center items-center text-center">
                      {cert.credentialId && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-1">Credential ID</p>
                          <p className="font-mono text-sm">{cert.credentialId}</p>
                        </div>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:glow-primary transition-all text-sm"
                          onClick={(e) => e.stopPropagation()}
                          data-testid={`certificate-link-${cert.id}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Verify Credential
                        </a>
                      )}
                      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                        Click to flip
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No certificates available yet
          </div>
        )}
      </div>
    </section>
  );
}
