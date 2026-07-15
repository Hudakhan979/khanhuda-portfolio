import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('portfolio_token');
      if (window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin' &&
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(err);
  }
);

// ── Public endpoints ──────────────────────────────────────────────────────────
export const getProfile      = ()           => api.get('/profile');
export const getProjects     = (params)     => api.get('/projects', { params });
export const getProject      = (id)         => api.get(`/projects/${id}`);
export const getSkills       = (params)     => api.get('/skills', { params });
export const getExperience   = ()           => api.get('/experience');
export const getTestimonials = (params)     => api.get('/testimonials', { params });
export const getCertificates = ()           => api.get('/certificates');
export const getAchievements = ()           => api.get('/achievements');
export const getGithubStats  = ()           => api.get('/github-stats');
export const submitContact   = (data)       => api.post('/contact', data);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const login  = (email, password) => api.post('/auth/login', { email, password });
export const getMe  = ()                => api.get('/auth/me');

// ── Admin — Projects ─────────────────────────────────────────────────────────
export const createProject = (data)     => api.post('/projects', data);
export const updateProject = (id, data) => api.patch(`/projects/${id}`, data);
export const deleteProject = (id)       => api.delete(`/projects/${id}`);

// ── Admin — Skills ────────────────────────────────────────────────────────────
export const createSkill   = (data)     => api.post('/skills', data);
export const updateSkill   = (id, data) => api.patch(`/skills/${id}`, data);
export const deleteSkill   = (id)       => api.delete(`/skills/${id}`);

// ── Admin — Experience ────────────────────────────────────────────────────────
export const createExperience = (data)     => api.post('/experience', data);
export const updateExperience = (id, data) => api.patch(`/experience/${id}`, data);
export const deleteExperience = (id)       => api.delete(`/experience/${id}`);

// ── Admin — Messages ─────────────────────────────────────────────────────────
export const getMessages     = (params)     => api.get('/contact/messages', { params });
export const updateMessage   = (id, data)   => api.patch(`/contact/messages/${id}`, data);
export const deleteMessage   = (id)         => api.delete(`/contact/messages/${id}`);

// ── Admin — Analytics ────────────────────────────────────────────────────────
export const getAnalytics    = ()           => api.get('/analytics');

// ── Admin — Profile ───────────────────────────────────────────────────────────
export const updateProfile   = (data)       => api.patch('/profile', data);

export default api;
