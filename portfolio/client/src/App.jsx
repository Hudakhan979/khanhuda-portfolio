import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/Projects';
import AdminSkills from './pages/admin/Skills';
import AdminExperience from './pages/admin/Experience';
import AdminMessages from './pages/admin/Messages';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />

      {/* Admin auth */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin protected */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"  element={<AdminDashboard />} />
        <Route path="projects"   element={<AdminProjects />} />
        <Route path="skills"     element={<AdminSkills />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="messages"   element={<AdminMessages />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
