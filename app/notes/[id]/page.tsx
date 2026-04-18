'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../lib/api';

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await api.get(`/notes/${id}`);
    setTitle(res.data.title || '');
    setContent(res.data.content_text || '');
  }

  async function save() {
    await api.patch(`/notes/${id}`, { title, content_text: content });
    setMsg('Saved ✅');
  }

  async function del() {
    await api.delete(`/notes/${id}`);
    router.push('/notes');
  }

  useEffect(() => {
    if (id) load();
  }, [id]);

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Note</h1>
        <Link href="/notes" className="px-3 py-2 bg-slate-700 rounded-xl">Back</Link>
      </div>

      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 space-y-3">
        <input
          className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows={10}
          className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {msg && <p className="text-emerald-300 text-sm">{msg}</p>}
        <div className="flex gap-2">
          <button onClick={save} className="px-4 py-2 bg-emerald-600 rounded-xl">Save</button>
          <button onClick={del} className="px-4 py-2 bg-rose-700 rounded-xl">Delete</button>
        </div>
      </div>
    </main>
  );
}