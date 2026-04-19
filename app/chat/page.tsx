'use client';

import { FormEvent, useState } from 'react';
import AuthGuard from '../../components/AuthGuard';
import AppShell from '../../components/AppShell';
import PageTransition from '../../components/PageTransition';

type Msg = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hi! I am your Notes AI assistant. How can I help?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Msg = { role: 'user', content: input.trim() };
    const nextMessages = [...messages, userMsg];

    setMessages(nextMessages);
    setInput('');
    setErr('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to chat');

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <PageTransition>
        <AppShell title="AI Chat" showBackTo="/welcome">
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-4 md:p-6 h-[75vh] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'ml-auto bg-indigo-600 text-white'
                      : 'mr-auto bg-slate-800/80 text-slate-100'
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="mr-auto bg-slate-800/80 text-slate-300 rounded-2xl px-4 py-3">
                  Thinking...
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="mt-4 flex gap-2">
              <input
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/50 border border-white/15 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold"
              >
                Send
              </button>
            </form>

            {err && <p className="text-rose-300 text-sm mt-2">{err}</p>}
          </div>
        </AppShell>
      </PageTransition>
    </AuthGuard>
  );
}