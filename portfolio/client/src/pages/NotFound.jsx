import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
      <p className="text-2xl font-semibold text-white mb-2">Page Not Found</p>
      <p className="text-white/50 mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-all"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
      >
        <Home size={18} /> Back Home
      </Link>
    </div>
  );
}
