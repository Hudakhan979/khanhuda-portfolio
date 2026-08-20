import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { getExperience, createExperience, updateExperience, deleteExperience } from '../../lib/api';

export default function AdminExperience() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ['experience'], queryFn: () => getExperience().then(r => r.data) });
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const createMut = useMutation({ mutationFn: createExperience, onSuccess: () => { qc.invalidateQueries(['experience']); toast.success('Created'); setEditing(null); reset(); }, onError: e => toast.error(e.response?.data?.error || 'Failed') });
  const updateMut = useMutation({ mutationFn: ({ id, data }) => updateExperience(id, data), onSuccess: () => { qc.invalidateQueries(['experience']); toast.success('Updated'); setEditing(null); reset(); }, onError: e => toast.error(e.response?.data?.error || 'Failed') });
  const deleteMut = useMutation({ mutationFn: deleteExperience, onSuccess: () => { qc.invalidateQueries(['experience']); toast.success('Deleted'); }, onError: e => toast.error(e.response?.data?.error || 'Failed') });

  const openEdit = (item) => {
    setEditing(item);
    Object.entries(item).forEach(([k, v]) => {
      if (k === 'responsibilities' || k === 'techStack') setValue(k, Array.isArray(v) ? v.join('\n') : v);
      else if (k === 'startDate' || k === 'endDate') setValue(k, v ? new Date(v).toISOString().split('T')[0] : '');
      else setValue(k, v);
    });
  };

  const onSubmit = (form) => {
    const data = {
      ...form,
      responsibilities: form.responsibilities?.split('\n').map(s => s.trim()).filter(Boolean),
      techStack: form.techStack?.split(',').map(s => s.trim()).filter(Boolean),
      current: form.current === 'true' || form.current === true,
    };
    if (editing?._id) updateMut.mutate({ id: editing._id, data });
    else createMut.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Experience</h2>
          <p className="text-white/50 text-sm mt-1">{items.length} entries</p>
        </div>
        <button onClick={() => { reset(); setEditing({}); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
          <Plus size={16} /> Add Entry
        </button>
      </div>

      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass rounded-2xl p-6 animate-pulse h-32" />)
          : items.map(item => (
              <div key={item._id} className="glass rounded-2xl p-6 hover:glass-strong transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-white">{item.role}</h3>
                      {item.current && <span className="px-2 py-0.5 rounded-full text-xs text-white" style={{ background: 'rgba(124,58,237,0.4)' }}>Current</span>}
                    </div>
                    <p className="text-secondary font-medium text-sm">{item.company}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {item.startDate ? new Date(item.startDate).getFullYear() : '?'} — {item.current ? 'Present' : (item.endDate ? new Date(item.endDate).getFullYear() : '?')}
                      {item.location ? ` · ${item.location}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-white/40 hover:text-primary transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(item._id); }} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))
        }
      </div>

      {/* Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{editing?._id ? 'Edit Experience' : 'New Experience'}</h3>
              <button onClick={() => { setEditing(null); reset(); }} className="p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LBL}>Company *</label>
                 <input {...register('company', { required: true })} placeholder="Nebulaiit"className={INPUT}/>
                </div>
                <div>
                  <label className={LBL}>Role *</label>
                <input {...register('role', { required: true })}placeholder="Frontend Developer Intern"className={INPUT}/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LBL}>Start Date</label>
                  <input {...register('startDate')} type="date" className={INPUT} />
                </div>
                <div>
                  <label className={LBL}>End Date</label>
                  <input {...register('endDate')} type="date" className={INPUT} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LBL}>Location</label>
                 <input{...register('location')}placeholder="Mumbai, Maharashtra" className={INPUT} />
                </div>
                <div>
                  <label className={LBL}>Currently Here?</label>
                  <select {...register('current')} className={INPUT}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={LBL}>Description</label>
               <textarea {...register('description')}rows={2}placeholder="Worked as a Frontend Developer Intern at Nebulaiit, developing responsive React.js applications and integrating REST APIs."
className={INPUT} />
              </div>
              <div>
                <label className={LBL}>Responsibilities (one per line)</label>
                <textarea {...register('responsibilities')} rows={5} placeholder="Led team of 6 engineers..." className={INPUT} />
              </div>
              <div>
                <label className={LBL}>Tech Stack (comma-separated)</label>
                <input {...register('techStack')} placeholder="React, Node.js, AWS" className={INPUT} />
              </div>
              <div>
                <label className={LBL}>Company URL</label>
                <input {...register('companyUrl')} placeholder="https://vercel.com" className={INPUT} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setEditing(null); reset(); }} className="flex-1 py-3 rounded-xl glass text-white/70 hover:text-white transition-all text-sm font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
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

const INPUT = 'w-full px-4 py-2.5 rounded-xl glass bg-transparent text-white placeholder-white/30 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition resize-none';
const LBL = 'text-xs text-white/50 font-mono uppercase tracking-wide mb-1.5 block';
