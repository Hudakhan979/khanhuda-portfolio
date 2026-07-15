import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, ExternalLink } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject } from '../../lib/api';

const CATS = ['Full Stack', 'Frontend', 'Backend', 'Mobile', 'AI/ML', 'DevOps', 'Other'];

export default function AdminProjects() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['projects'], queryFn: () => getProjects().then(r => r.data) });
  const projects = data?.projects ?? data ?? [];
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {_id,...} = edit
  const { register, handleSubmit, reset, setValue } = useForm();

  const createMut = useMutation({
    mutationFn: createProject,
    onSuccess: () => { qc.invalidateQueries(['projects']); toast.success('Project created'); setEditing(null); reset(); },
    onError:   (e) => toast.error(e.response?.data?.error || 'Failed'),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: () => { qc.invalidateQueries(['projects']); toast.success('Project updated'); setEditing(null); reset(); },
    onError:   (e) => toast.error(e.response?.data?.error || 'Failed'),
  });
  const deleteMut = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => { qc.invalidateQueries(['projects']); toast.success('Deleted'); },
    onError:   (e) => toast.error(e.response?.data?.error || 'Failed'),
  });

  const openNew = () => { reset(); setEditing({}); };
  const openEdit = (p) => {
    setEditing(p);
    Object.entries(p).forEach(([k, v]) => {
      if (k === 'techStack') setValue(k, Array.isArray(v) ? v.join(', ') : v);
      else setValue(k, v);
    });
  };

  const onSubmit = (form) => {
    const data = { ...form, techStack: form.techStack?.split(',').map(s => s.trim()).filter(Boolean), featured: form.featured === 'true' || form.featured === true };
    if (editing?._id) updateMut.mutate({ id: editing._id, data });
    else createMut.mutate(data);
  };

  const isPending = createMut.isPending || updateMut.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="text-white/50 text-sm mt-1">{projects.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-white/40">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-white/50 font-medium">Title</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium hidden lg:table-cell">Status</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium hidden md:table-cell">Featured</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-white">{p.title}</p>
                    <p className="text-white/40 text-xs truncate max-w-xs">{p.description}</p>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="px-2.5 py-0.5 rounded-full text-xs glass text-white/70">{p.category}</span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    {p.featured && <span className="text-primary text-xs font-medium">★ Featured</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                           className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-white/40 hover:text-primary transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(p._id); }}
                              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{editing?._id ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => { setEditing(null); reset(); }} className="p-2 rounded-xl hover:bg-white/5 transition-colors text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Title *">
                <input {...register('title', { required: true })} placeholder="Project title" className={INPUT} />
              </Field>
              <Field label="Category">
                <select {...register('category')} className={INPUT}>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Description *">
                <textarea {...register('description', { required: true })} rows={3} placeholder="Short description" className={INPUT} />
              </Field>
              <Field label="Long Description">
                <textarea {...register('longDescription')} rows={4} placeholder="Detailed description" className={INPUT} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Live URL"><input {...register('liveUrl')} placeholder="https://…" className={INPUT} /></Field>
                <Field label="GitHub URL"><input {...register('githubUrl')} placeholder="https://github.com/…" className={INPUT} /></Field>
              </div>
              <Field label="Tech Stack (comma-separated)">
                <input {...register('techStack')} placeholder="React, Node.js, MongoDB" className={INPUT} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Status">
                  <select {...register('status')} className={INPUT}>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="archived">Archived</option>
                  </select>
                </Field>
                <Field label="Featured">
                  <select {...register('featured')} className={INPUT}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </Field>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setEditing(null); reset(); }}
                        className="flex-1 py-3 rounded-xl glass text-white/70 hover:text-white transition-all text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={isPending}
                        className="flex-1 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                  {isPending ? 'Saving…' : editing?._id ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const INPUT = 'w-full px-4 py-2.5 rounded-xl glass bg-transparent text-white placeholder-white/30 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition';
function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs text-white/50 font-mono uppercase tracking-wide mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
