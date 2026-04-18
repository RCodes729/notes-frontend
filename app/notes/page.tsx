'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthGuard from '../../components/AuthGuard';
import AppShell from '../../components/AppShell';
import PageTransition from '../../components/PageTransition';
import { api } from '../../lib/api';

type Note = { id: string; title: string; content_text: string | null };

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [err, setErr] = useState('');

  async function loadNotes() {
    try {
      const res = await api.get('/notes');
      setNotes(res.data || []);
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Failed to load notes');
    }
  }

  async function createNote(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/notes', { title, content_text: content });
      setTitle('');
      setContent('');
      loadNotes();
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Create failed');
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <AuthGuard>
      <PageTransition>
        <AppShell title="Your Notes" showBackTo="/welcome">
          <form onSubmit={createNote} className="rounded-2xl border border-white/20 bg-white/10 p-4 mb-5 space-y-2">
            <input
              className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500">Create</button>
          </form>

          {err && <p className="text-rose-300 mb-3">{err}</p>}

          <div className="grid md:grid-cols-2 gap-3">
            {notes.map((n) => (
              <Link key={n.id} href={`/notes/${n.id}`} className="block rounded-xl border border-white/20 bg-white/10 p-4 hover:bg-white/15 transition">
                <h3 className="font-semibold">{n.title}</h3>
                <p className="text-sm text-slate-300 mt-1">{n.content_text || ''}</p>
              </Link>
            ))}
          </div>
        </AppShell>
      </PageTransition>
    </AuthGuard>
  );
}