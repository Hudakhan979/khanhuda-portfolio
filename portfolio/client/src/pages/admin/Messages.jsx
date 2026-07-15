import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { MailOpen, Mail, Trash2, Reply } from 'lucide-react';
import { getMessages, updateMessage, deleteMessage } from '../../lib/api';

export default function AdminMessages() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const params = filter === 'unread' ? { read: false } : filter === 'read' ? { read: true } : {};
  const { data, isLoading } = useQuery({ queryKey: ['messages', filter], queryFn: () => getMessages(params).then(r => r.data) });
  const messages = data?.messages ?? [];

  const markRead = useMutation({
    mutationFn: ({ id }) => updateMessage(id, { read: true }),
    onSuccess: () => qc.invalidateQueries(['messages']),
  });
  const deleteMut = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => { qc.invalidateQueries(['messages']); toast.success('Deleted'); setSelected(null); },
    onError:   e => toast.error(e.response?.data?.error || 'Failed'),
  });

  const open = (msg) => {
    setSelected(msg);
    if (!msg.read) markRead.mutate({ id: msg._id });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Messages</h2>
          <p className="text-white/50 text-sm mt-1">{data?.total ?? 0} total</p>
        </div>
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'text-white' : 'glass text-white/60 hover:text-white'}`}
                    style={filter === f ? { background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' } : {}}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="glass rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-white/40">Loading…</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-white/30">No messages</div>
          ) : (
            <div className="divide-y divide-white/5">
              {messages.map(msg => (
                <button
                  key={msg._id}
                  onClick={() => open(msg)}
                  className={`w-full text-left px-5 py-4 hover:bg-white/3 transition-colors flex gap-3 ${selected?._id === msg._id ? 'bg-white/5' : ''}`}
                >
                  <div className="mt-0.5">
                    {msg.read
                      ? <MailOpen size={16} className="text-white/30" />
                      : <Mail size={16} className="text-primary" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium ${msg.read ? 'text-white/70' : 'text-white'}`}>{msg.name}</span>
                      <span className="text-xs text-white/30 flex-shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-white/40 truncate">{msg.email}</p>
                    <p className="text-xs text-white/50 truncate mt-0.5">{msg.message}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-white text-lg">{selected.name}</h3>
                <a href={`mailto:${selected.email}`} className="text-secondary text-sm hover:underline">{selected.email}</a>
              </div>
              <div className="flex gap-2">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                   className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs glass text-white/60 hover:text-white transition-all">
                  <Reply size={13} /> Reply
                </a>
                <button
                  onClick={() => { if (confirm('Delete?')) deleteMut.mutate(selected._id); }}
                  className="p-2 rounded-xl glass text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {selected.subject && (
              <p className="text-sm text-white/50 mb-4 font-medium">{selected.subject}</p>
            )}
            <div className="glass rounded-xl p-4">
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <p className="text-xs text-white/30 mt-4">{new Date(selected.createdAt).toLocaleString()}</p>
          </div>
        ) : (
          <div className="glass rounded-2xl flex items-center justify-center text-white/30 text-sm">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  );
}
