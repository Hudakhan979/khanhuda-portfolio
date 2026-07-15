import { useEffect, useState, useRef } from 'react';
import { Link } from 'wouter';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar() {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setScrollDir('up');
      } else if (currentScrollY > lastScrollY) {
        setScrollDir('down');
      } else {
        setScrollDir('up');
      }
      
      setLastScrollY(currentScrollY);

      // Update active section
      const sections = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleHireMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    buttonRef.current.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  };

  const handleHireMouseLeave = () => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'translate(0, 0)';
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          scrollDir === 'down' && lastScrollY > 100 ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="glass-strong border-b border-white/10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <button
                onClick={() => scrollToSection('home')}
                className="text-2xl font-bold gradient-text"
                data-testid="logo-link"
              >
                &lt; dev /&gt;
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <div className="relative flex items-center gap-6">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`text-sm font-medium transition-colors relative ${
                        activeSection === section.id
                          ? 'text-white'
                          : 'text-muted-foreground hover:text-white'
                      }`}
                      data-testid={`nav-link-${section.id}`}
                    >
                      {section.label}
                      {activeSection === section.id && (
                        <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                <a
                  ref={buttonRef}
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('contact');
                  }}
                  onMouseMove={handleHireMouseMove}
                  onMouseLeave={handleHireMouseLeave}
                  className="px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 glow-primary"
                  style={{ background: 'var(--gradient-primary)' }}
                  data-testid="button-hire-me"
                >
                  Hire Me
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative h-full flex flex-col items-center justify-center gap-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-3xl font-bold text-white hover:gradient-text transition-all"
                data-testid={`mobile-nav-link-${section.id}`}
              >
                {section.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="mt-4 px-8 py-3 rounded-full font-medium text-lg"
              style={{ background: 'var(--gradient-primary)' }}
              data-testid="mobile-button-hire-me"
            >
              Hire Me
            </button>
          </div>
        </div>
      )}
    </>
  );
}
