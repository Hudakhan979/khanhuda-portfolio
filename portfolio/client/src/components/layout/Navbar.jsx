import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Experience',   href: '#experience' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Contact',      href: '#contact' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [hidden,      setHidden]      = useState(false);
  const [lastY,       setLastY]       = useState(0);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [active,      setActive]      = useState('home');

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastY && y > 80);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  // Highlight active section via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: hidden ? -80 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-glass' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo('#home')}
          className="text-xl font-bold font-mono gradient-text hover:opacity-80 transition-opacity"
        >
          &lt; dev /&gt;
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.slice(1);
            return (
              <li key={label}>
                <button
                  onClick={() => scrollTo(href)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    active === id
                      ? 'text-white gradient-text'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scrollTo('#contact')}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white glow-primary transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
          >
            Hire Me
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/10"
          >
            <ul className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all"
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={() => scrollTo('#contact')}
                  className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white text-center"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
                >
                  Hire Me
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
