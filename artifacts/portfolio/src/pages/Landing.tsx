import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Services } from '@/components/sections/Services';
import { Achievements } from '@/components/sections/Achievements';
import { Testimonials } from '@/components/sections/Testimonials';
import { Certificates } from '@/components/sections/Certificates';
import { GithubStats } from '@/components/sections/GithubStats';
import { Contact } from '@/components/sections/Contact';

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Services />
        <Achievements />
        <Testimonials />
        <Certificates />
        <GithubStats />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
