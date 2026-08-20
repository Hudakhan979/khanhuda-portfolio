import { useState, useEffect } from 'react';
import { SiGithub } from 'react-icons/si';
import { Linkedin, Twitter, ArrowUp } from 'lucide-react';

const SOCIAL = [
  { icon: SiGithub,  label: 'GitHub',   href: 'https://github.com/Hudakhan979' },
  { icon: Linkedin,  label: 'LinkedIn', href: 'https://www.linkedin.com/in/huda-khan-432430313/' },
  // { icon: Twitter,   label: 'Twitter',  href: 'https://twitter.com/Hudakhan' },
];

const LINKS = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative glass-strong border-t border-white/10">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold font-mono gradient-text mb-2">&lt; dev /&gt;</h3>
            <p className="text-white/50 text-sm">
              Building digital experiences that matter.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4 text-white/80">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {LINKS.map((l) => (
                <button
                  key={l}
                  onClick={() => scrollTo(l)}
                  className="text-sm text-white/50 hover:text-primary text-left transition-colors"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-white/80">Connect</h4>
            <div className="flex gap-3">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:glow-primary transition-all hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Khan Huda. All rights reserved.
          </p>
        </div>
      </div>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full glass-strong glow-primary flex items-center justify-center hover:scale-110 transition-all z-40"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </footer>
  );
}
