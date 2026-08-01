import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Plus,
  ArrowLeft,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import { authAPI } from '../services/api';

interface Complaint {
  id: number;
  title: string;
  description: string;
  category?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected' | string;
  admin_response?: string;
  created_at?: string;
}

const STATUS_UI: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Kutilmoqda',
    className: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
    icon: <Clock className="w-4 h-4" />,
  },
  in_progress: {
    label: 'Jarayonda',
    className: 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-300',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  resolved: {
    label: 'Hal qilindi',
    className: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  rejected: {
    label: 'Rad etildi',
    className: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'room' | 'food' | 'staff' | 'noise' | 'other'>('other');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = (await authAPI.getComplaints()) as Complaint[];
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklashda xatolik');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (user) load();
  }, [user, load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await authAPI.createComplaint({
        title: title.trim(),
        description: description.trim(),
        category,
      });
      setTitle('');
      setDescription('');
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yuborishda xatolik');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
            Tizimga kirish talab etiladi
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-brand-600 text-white px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors duration-150"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="w-7 h-7 text-brand-500" />
                Shikoyatlar
              </h1>
              <p className="text-sm text-surface-500">Yotoqxona bo&apos;yicha murojaat yuboring</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              className="p-2 rounded-xl border border-surface-200 dark:border-surface-700"
              title="Yangilash"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
            >
              <Plus className="w-4 h-4" />
              Yangi
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300 text-sm">
            {error}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 p-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 space-y-3 shadow-sm"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sarlavha"
              className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 outline-none focus:ring-2 focus:ring-brand-500/40"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800"
            >
              <option value="room">Xona</option>
              <option value="food">Ovqat</option>
              <option value="staff">Xodimlar</option>
              <option value="noise">Shovqin</option>
              <option value="other">Boshqa</option>
            </select>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Batafsil yozing..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 outline-none focus:ring-2 focus:ring-brand-500/40"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold disabled:opacity-50 hover:bg-brand-700"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Yuborilmoqda...' : 'Yuborish'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-surface-200 dark:bg-surface-800 animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="Shikoyatlar yo'q"
            description="Muammo bo'lsa, yangi murojaat yuboring"
            action={{ label: 'Yangi shikoyat', onClick: () => setShowForm(true) }}
          />
        ) : (
          <div className="space-y-3">
            {items.map((c) => {
              const st = STATUS_UI[c.status] || STATUS_UI.pending;
              return (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-surface-900 dark:text-white">{c.title}</h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${st.className}`}
                    >
                      {st.icon}
                      {st.label}
                    </span>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-300 mb-2">
                    {c.description}
                  </p>
                  {c.admin_response && (
                    <p className="text-sm text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/20 rounded-xl p-3">
                      Javob: {c.admin_response}
                    </p>
                  )}
                  {c.created_at && (
                    <p className="text-xs text-surface-400 mt-2">
                      {new Date(c.created_at).toLocaleString('uz-UZ')}
                      {c.category ? ` · ${c.category}` : ''}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;
