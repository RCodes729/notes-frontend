'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppShell from '../../components/AppShell';
import AuthGuard from '../../components/AuthGuard';
import PageTransition from '../../components/PageTransition';
import { api } from '../../lib/api';

type Note = {
  id: string; // Database uses UUID strings
  title: string;
  content_text: string; // Changed from 'content' to match Prisma schema
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [err, setErr] = useState('');

  async function loadNotes() {
    try {
      const data = await api<Note[]>('/notes');
      setNotes(data);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load notes');
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function createNote(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Backend expects 'content_text'
      await api('/notes', {
        method: 'POST',
        body: JSON.stringify({ title, content_text: content }), 
      });
      setTitle('');
      setContent('');
      loadNotes();
    } catch (e: any) {
      setErr(e?.message || 'Failed to create note');
    }
  }

  // New delete function
  async function deleteNote(id: string) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await api(`/notes/${id}`, { method: 'DELETE' });
      // Remove it from the screen immediately without reloading
      setNotes(notes.filter(n => n.id !== id));
    } catch (e: any) {
      setErr(e?.message || 'Failed to delete note');
    }
  }

  return (
    <AuthGuard>
      <PageTransition>
        <AppShell title="Notes" showBackTo="/welcome">
          <div className="grid md:grid-cols-2 gap-4">
            <section className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur h-fit">
              <h2 className="text-xl font-semibold text-white mb-3">Create note</h2>
              <form onSubmit={createNote} className="space-y-3">
                <input
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-white/15 text-white"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-white/15 text-white min-h-32"
                  placeholder="Write your note..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white">
                  Save note
                </button>
              </form>
              {err && <p className="text-rose-300 mt-3">{err}</p>}
            </section>

            <section className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
              <h2 className="text-xl font-semibold text-white mb-3">Your notes</h2>
              <div className="space-y-3">
                {notes.map((n) => (
                  <div key={n.id} className="rounded-xl border border-white/15 bg-slate-900/40 p-4 flex flex-col">
                    <h3 className="text-white font-semibold text-lg">{n.title}</h3>
                    <p className="text-slate-300 text-sm mt-2 whitespace-pre-wrap flex-1">{n.content_text}</p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-4 pt-3 border-t border-white/10 justify-end">
                      <Link href={`/notes/${n.id}`} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                        Edit
                      </Link>
                      <button onClick={() => deleteNote(n.id)} className="text-sm text-rose-400 hover:text-rose-300 font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {!notes.length && <p className="text-slate-300">No notes yet.</p>}
              </div>
            </section>
          </div>
        </AppShell>
      </PageTransition>
    </AuthGuard>
  );
}