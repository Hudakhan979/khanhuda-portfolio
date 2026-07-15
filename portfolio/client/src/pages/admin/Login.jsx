import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPass, setShowPass] = useState(false);

  // Already logged in
  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
             style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-bold font-mono gradient-text">&lt; admin /&gt;</span>
          <p className="text-white/50 mt-2 text-sm">Sign in to manage your portfolio</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs text-white/50 font-mono uppercase tracking-wide mb-2 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  placeholder="admin@portfolio.dev"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass bg-transparent text-white placeholder-white/30 text-sm outline-none focus:ring-1 focus:ring-primary/60 transition"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-white/50 font-mono uppercase tracking-wide mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl glass bg-transparent text-white placeholder-white/30 text-sm outline-none focus:ring-1 focus:ring-primary/60 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
            >
              {isSubmitting
                ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                : 'Sign In'
              }
            </button>
          </form>

          <p className="text-center text-xs text-white/30 mt-6">
            Default: admin@portfolio.dev / admin123
          </p>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-sm text-white/40 hover:text-white/70 transition-colors">
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  );
}
