import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../lib/api';

const CATS = ['Frontend', 'Backend', 'Database', 'Cloud', 'Tools', 'AI', 'Languages', 'Other'];

export default function AdminSkills() {
  const qc = useQueryClient();
  const { data: skills = [], isLoading } = useQuery({ queryKey: ['skills'], queryFn: () => getSkills().then(r => r.data) });
  const [active, setActive] = useState('Frontend');
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const createMut = useMutation({ mutationFn: createSkill, onSuccess: () => { qc.invalidateQueries(['skills']); toast.success('Skill created'); setEditing(null); reset(); }, onError: e => toast.error(e.response?.data?.error || 'Failed') });
  const updateMut = useMutation({ mutationFn: ({ id, data }) => updateSkill(id, data), onSuccess: () => { qc.invalidateQueries(['skills']); toast.success('Skill updated'); setEditing(null); reset(); }, onError: e => toast.error(e.response?.data?.error || 'Failed') });
  const deleteMut = useMutation({ mutationFn: deleteSkill, onSuccess: () => { qc.invalidateQueries(['skills']); toast.success('Deleted'); }, onError: e => toast.error(e.response?.data?.error || 'Failed') });

  const openNew = () => { reset({ category: active }); setEditing({}); };
  const openEdit = (s) => { setEditing(s); Object.entries(s).forEach(([k, v]) => setValue(k, v)); };
  const onSubmit = (form) => {
    if (editing?._id) updateMut.mutate({ id: editing._id, data: form });
    else createMut.mutate(form);
  };

  const filtered = skills.filter(s => s.category === active);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Skills</h2>
          <p className="text-white/50 text-sm mt-1">{skills.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATS.map(c => (
          <button key={c} onClick={() => setActive(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${active === c ? 'text-white' : 'glass text-white/60 hover:text-white'}`}
                  style={active === c ? { background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' } : {}}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="glass rounded-2xl p-5 animate-pulse h-24" />)
          : filtered.map(s => (
              <div key={s._id} className="glass rounded-2xl p-5 flex items-center gap-4 hover:glass-strong transition-all group">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{s.name}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.proficiency}%`, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }} />
                    </div>
                    <span className="text-xs text-white/40 flex-shrink-0">{s.proficiency}%</span>
                  </div>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-white/40 hover:text-primary transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(s._id); }} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            ))
        }
        {!isLoading && filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-white/30">No skills in this category yet.</div>
        )}
      </div>

      {/* Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong rounded-3xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{editing?._id ? 'Edit Skill' : 'New Skill'}</h3>
              <button onClick={() => { setEditing(null); reset(); }} className="p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-xs text-white/50 font-mono uppercase tracking-wide mb-1.5 block">Name *</label>
                <input {...register('name', { required: true })} placeholder="e.g. React" className={INPUT} />
              </div>
              <div>
                <label className="text-xs text-white/50 font-mono uppercase tracking-wide mb-1.5 block">Category</label>
                <select {...register('category')} className={INPUT}>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 font-mono uppercase tracking-wide mb-1.5 block">Proficiency (0–100)</label>
                <input {...register('proficiency')} type="number" min="0" max="100" placeholder="85" className={INPUT} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 font-mono uppercase tracking-wide mb-1.5 block">Icon (SI name)</label>
                  <input {...register('icon')} placeholder="SiReact" className={INPUT} />
                </div>
                <div>
                  <label className="text-xs text-white/50 font-mono uppercase tracking-wide mb-1.5 block">Color (hex)</label>
                  <input {...register('color')} placeholder="#61DAFB" className={INPUT} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setEditing(null); reset(); }} className="flex-1 py-3 rounded-xl glass text-white/70 hover:text-white transition-all text-sm font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                  {editing?._id ? 'Save' : 'Create'}
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
