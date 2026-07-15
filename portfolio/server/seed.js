require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Admin = require('./models/Admin');
const Profile = require('./models/Profile');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Testimonial = require('./models/Testimonial');
const Certificate = require('./models/Certificate');
const Achievement = require('./models/Achievement');

async function seed() {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear existing data
  await Promise.all([
    Admin.deleteMany(),
    Profile.deleteMany(),
    Project.deleteMany(),
    Skill.deleteMany(),
    Experience.deleteMany(),
    Testimonial.deleteMany(),
    Certificate.deleteMany(),
    Achievement.deleteMany(),
  ]);

  // Admin user — password is "admin123"
  await Admin.create({
    name: 'Alex Johnson',
    email: 'admin@portfolio.dev',
    passwordHash: 'admin123',  // hashed in pre-save hook
  });
  console.log('✅ Admin created (email: admin@portfolio.dev, password: admin123)');

  // Profile
  await Profile.create({
    name: 'Alex Johnson',
    title: 'Full Stack Developer & UI Engineer',
    bio: "I'm a passionate Full Stack Developer with 5+ years of experience building exceptional digital experiences. I specialize in React, Node.js, and cloud architecture — turning complex problems into elegant, performant solutions.",
    location: 'San Francisco, CA',
    email: 'alex@portfolio.dev',
    github: 'https://github.com/alexjohnson',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    twitter: 'https://twitter.com/alexjohnson',
    tagline: 'Building digital products that people love',
    yearsOfExperience: 5,
    projectsCompleted: 50,
    happyClients: 30,
    openSourceContributions: 200,
    availableForWork: true,
    services: [
      { title: 'Web Development', description: 'Full-stack web apps with React, Node.js, and modern databases.', icon: 'Globe' },
      { title: 'Mobile Apps', description: 'Cross-platform mobile apps with React Native and Expo.', icon: 'Smartphone' },
      { title: 'API Design', description: 'RESTful and GraphQL APIs that scale to millions of requests.', icon: 'Server' },
      { title: 'UI/UX Design', description: 'Pixel-perfect interfaces with Figma and modern CSS.', icon: 'Palette' },
      { title: 'Cloud Architecture', description: 'AWS & GCP infrastructure, CI/CD pipelines, Docker, Kubernetes.', icon: 'Cloud' },
      { title: 'AI Integration', description: 'LLM-powered features using OpenAI, LangChain, and custom models.', icon: 'Brain' },
    ],
  });
  console.log('✅ Profile created');

  // Projects
  await Project.insertMany([
    { title: 'NexaCloud — SaaS Platform', description: 'Enterprise cloud management platform with real-time analytics, multi-tenant architecture, and AI-powered cost optimization.', longDescription: 'A comprehensive SaaS platform built for enterprises to manage their cloud infrastructure.', category: 'Full Stack', techStack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS'], liveUrl: 'https://nexacloud.demo', githubUrl: 'https://github.com/alexjohnson/nexacloud', featured: true, order: 1, status: 'completed' },
    { title: 'Aura — AI Writing Assistant', description: 'GPT-4 powered writing tool with real-time collaboration, version history, and smart content suggestions.', category: 'AI/ML', techStack: ['Next.js', 'TypeScript', 'OpenAI API', 'Supabase', 'TailwindCSS'], liveUrl: 'https://aura-ai.demo', githubUrl: 'https://github.com/alexjohnson/aura', featured: true, order: 2, status: 'completed' },
    { title: 'Flux — Design System', description: 'Production-ready React component library with 80+ components, dark mode, and comprehensive Storybook documentation.', category: 'Frontend', techStack: ['React', 'TypeScript', 'Storybook', 'Radix UI'], liveUrl: 'https://flux-ds.demo', githubUrl: 'https://github.com/alexjohnson/flux-ds', featured: true, order: 3, status: 'completed' },
    { title: 'TradeVault — Crypto Dashboard', description: 'Real-time cryptocurrency trading dashboard with portfolio tracking, price alerts, and advanced charting.', category: 'Full Stack', techStack: ['React', 'WebSockets', 'Node.js', 'MongoDB', 'Chart.js'], githubUrl: 'https://github.com/alexjohnson/tradevault', featured: false, order: 4, status: 'completed' },
    { title: 'Orbit — Project Management', description: 'Notion-like project management app with kanban boards, nested docs, and team collaboration features.', category: 'Full Stack', techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Framer Motion', 'Tiptap'], githubUrl: 'https://github.com/alexjohnson/orbit', featured: false, order: 5, status: 'completed' },
    { title: 'Pulse — Health & Fitness App', description: 'Cross-platform fitness tracking app with AI workout planning, nutrition logging, and social features.', category: 'Mobile', techStack: ['React Native', 'Expo', 'Node.js', 'MongoDB', 'TensorFlow'], githubUrl: 'https://github.com/alexjohnson/pulse', featured: false, order: 6, status: 'completed' },
  ]);
  console.log('✅ Projects created');

  // Skills
  const skillData = [
    { name: 'React', category: 'Frontend', proficiency: 95, icon: 'SiReact', color: '#61DAFB', order: 1 },
    { name: 'Next.js', category: 'Frontend', proficiency: 90, icon: 'SiNextdotjs', color: '#000000', order: 2 },
    { name: 'TypeScript', category: 'Frontend', proficiency: 92, icon: 'SiTypescript', color: '#3178C6', order: 3 },
    { name: 'Tailwind CSS', category: 'Frontend', proficiency: 95, icon: 'SiTailwindcss', color: '#06B6D4', order: 4 },
    { name: 'Framer Motion', category: 'Frontend', proficiency: 85, icon: 'SiFramer', color: '#0055FF', order: 5 },
    { name: 'Node.js', category: 'Backend', proficiency: 92, icon: 'SiNodedotjs', color: '#339933', order: 1 },
    { name: 'Express.js', category: 'Backend', proficiency: 90, icon: 'SiExpress', color: '#000000', order: 2 },
    { name: 'Python', category: 'Backend', proficiency: 82, icon: 'SiPython', color: '#3776AB', order: 3 },
    { name: 'GraphQL', category: 'Backend', proficiency: 80, icon: 'SiGraphql', color: '#E10098', order: 4 },
    { name: 'MongoDB', category: 'Database', proficiency: 88, icon: 'SiMongodb', color: '#47A248', order: 1 },
    { name: 'PostgreSQL', category: 'Database', proficiency: 85, icon: 'SiPostgresql', color: '#4169E1', order: 2 },
    { name: 'Redis', category: 'Database', proficiency: 80, icon: 'SiRedis', color: '#DC382D', order: 3 },
    { name: 'Docker', category: 'Cloud', proficiency: 88, icon: 'SiDocker', color: '#2496ED', order: 1 },
    { name: 'AWS', category: 'Cloud', proficiency: 82, icon: 'SiAmazonaws', color: '#FF9900', order: 2 },
    { name: 'Kubernetes', category: 'Cloud', proficiency: 72, icon: 'SiKubernetes', color: '#326CE5', order: 3 },
    { name: 'JavaScript', category: 'Languages', proficiency: 95, icon: 'SiJavascript', color: '#F7DF1E', order: 1 },
    { name: 'TypeScript', category: 'Languages', proficiency: 92, icon: 'SiTypescript', color: '#3178C6', order: 2 },
    { name: 'Python', category: 'Languages', proficiency: 82, icon: 'SiPython', color: '#3776AB', order: 3 },
    { name: 'Go', category: 'Languages', proficiency: 70, icon: 'SiGo', color: '#00ADD8', order: 4 },
    { name: 'OpenAI API', category: 'AI', proficiency: 85, icon: 'SiOpenai', color: '#412991', order: 1 },
    { name: 'LangChain', category: 'AI', proficiency: 78, icon: 'SiLangchain', color: '#1C3C3C', order: 2 },
    { name: 'Git', category: 'Tools', proficiency: 95, icon: 'SiGit', color: '#F05032', order: 1 },
    { name: 'Figma', category: 'Tools', proficiency: 82, icon: 'SiFigma', color: '#F24E1E', order: 2 },
    { name: 'Jest', category: 'Tools', proficiency: 85, icon: 'SiJest', color: '#C21325', order: 3 },
  ];
  await Skill.insertMany(skillData);
  console.log('✅ Skills created');

  // Experience
  await Experience.insertMany([
    { company: 'Vercel', role: 'Senior Full Stack Engineer', description: 'Led development of key platform features for the world\'s fastest frontend deployment platform.', responsibilities: ['Architected and built new Edge Functions runtime serving 1M+ deployments/day', 'Led a team of 6 engineers on the Analytics product, increasing MRR by 40%', 'Reduced cold start times by 60%'], startDate: new Date('2022-03-01'), current: true, companyUrl: 'https://vercel.com', location: 'Remote', techStack: ['React', 'Next.js', 'TypeScript', 'Go', 'AWS'], order: 1 },
    { company: 'Stripe', role: 'Full Stack Engineer', description: 'Worked on Stripe\'s developer experience and dashboard products.', responsibilities: ['Built and maintained the Stripe Dashboard component library used by 200+ engineers', 'Optimized React rendering performance, reducing dashboard load time by 45%'], startDate: new Date('2020-06-01'), endDate: new Date('2022-02-28'), current: false, companyUrl: 'https://stripe.com', location: 'San Francisco, CA', techStack: ['React', 'Ruby', 'TypeScript', 'PostgreSQL', 'Redis'], order: 2 },
    { company: 'Linear', role: 'Frontend Engineer', description: 'Early engineer at Linear, helping build the fastest issue tracking tool in the world.', responsibilities: ['Built core UI features from scratch including the command palette', 'Implemented real-time sync using operational transforms and WebSockets'], startDate: new Date('2019-01-01'), endDate: new Date('2020-05-31'), current: false, companyUrl: 'https://linear.app', location: 'San Francisco, CA', techStack: ['React', 'TypeScript', 'Electron', 'Node.js'], order: 3 },
  ]);
  console.log('✅ Experience created');

  // Testimonials
  await Testimonial.insertMany([
    { name: 'Sarah Chen', role: 'VP of Engineering', company: 'Vercel', content: 'Alex is one of the most talented engineers I\'ve worked with. His ability to balance clean architecture with shipping speed is rare. He took our Edge Functions runtime from prototype to production in record time.', rating: 5, featured: true, order: 1 },
    { name: 'Marcus Webb', role: 'CTO', company: 'Stripe', content: 'Working with Alex was a revelation. He doesn\'t just write great code — he thinks deeply about the product and the user. His dashboard redesign improved our NPS by 18 points.', rating: 5, featured: true, order: 2 },
    { name: 'Priya Patel', role: 'Product Manager', company: 'Linear', content: 'Alex built features that became defining parts of Linear\'s identity. The command palette he designed is still one of our most loved features years later.', rating: 5, featured: false, order: 3 },
    { name: 'Jordan Kim', role: 'Founder', company: 'Orbit.app', content: 'I hired Alex as a freelancer and ended up offering him a full-time role. His code quality is exceptional, he communicates clearly, and he delivers on time. Genuinely rare.', rating: 5, featured: false, order: 4 },
  ]);
  console.log('✅ Testimonials created');

  // Certificates
  await Certificate.insertMany([
    { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', issueDate: new Date('2023-09-01'), credentialId: 'AWS-SA-2023-XJ9K4', credentialUrl: 'https://aws.amazon.com/certification', skills: ['AWS', 'Cloud Architecture', 'EC2', 'S3', 'Lambda'], order: 1 },
    { title: 'Google Professional Cloud Developer', issuer: 'Google Cloud', issueDate: new Date('2023-06-01'), credentialId: 'GCP-DEV-2023-8TH2', credentialUrl: 'https://cloud.google.com/certification', skills: ['GCP', 'Kubernetes', 'Cloud Functions'], order: 2 },
    { title: 'Meta React Developer', issuer: 'Meta', issueDate: new Date('2022-12-01'), credentialId: 'META-REACT-2022-5BX9', credentialUrl: 'https://developers.facebook.com/certification', skills: ['React', 'JavaScript', 'Redux'], order: 3 },
    { title: 'MongoDB Certified Developer', issuer: 'MongoDB Inc', issueDate: new Date('2022-08-01'), credentialId: 'MDB-DEV-2022-7KP3', credentialUrl: 'https://university.mongodb.com/certification', skills: ['MongoDB', 'NoSQL', 'Aggregation'], order: 4 },
  ]);
  console.log('✅ Certificates created');

  // Achievements
  await Achievement.insertMany([
    { title: 'Awwwards Site of the Day', description: 'Portfolio recognized by Awwwards for exceptional UI/UX design and technical execution.', icon: 'Trophy', year: 2024, url: 'https://awwwards.com', order: 1 },
    { title: '1K+ GitHub Stars', description: 'Open source design system Flux reached 1,000+ stars on GitHub within 3 months of launch.', icon: 'Star', year: 2024, url: 'https://github.com/alexjohnson/flux-ds', order: 2 },
    { title: 'React Conf Speaker', description: 'Invited to speak at React Conf 2023 on performance optimization patterns.', icon: 'Mic', year: 2023, url: 'https://reactconf.com', order: 3 },
    { title: 'Google Developer Expert', description: 'Recognized as a Google Developer Expert for expertise in Web Technologies.', icon: 'Award', year: 2023, url: 'https://developers.google.com/community/experts', order: 4 },
    { title: 'Forbes 30 Under 30', description: 'Named in Forbes 30 Under 30 in Technology for contributions to open source and developer tooling.', icon: 'Medal', year: 2022, url: 'https://forbes.com', order: 5 },
  ]);
  console.log('✅ Achievements created');

  console.log('\n🎉 Database seeded successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
