import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedCursor } from '@/components/ui/AnimatedCursor';
import Landing from '@/pages/Landing';
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import NotFound from '@/pages/not-found';

gsap.registerPlugin(ScrollTrigger);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/admin" component={Login} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/dashboard/projects" component={() => <Dashboard />} />
      <Route path="/admin/dashboard/skills" component={() => <Dashboard />} />
      <Route path="/admin/dashboard/experience" component={() => <Dashboard />} />
      <Route path="/admin/dashboard/testimonials" component={() => <Dashboard />} />
      <Route path="/admin/dashboard/certificates" component={() => <Dashboard />} />
      <Route path="/admin/dashboard/achievements" component={() => <Dashboard />} />
      <Route path="/admin/dashboard/messages" component={() => <Dashboard />} />
      <Route path="/admin/dashboard/analytics" component={() => <Dashboard />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AnimatedCursor />
        <Router />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'glass-strong',
            style: {
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            },
          }}
        />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
