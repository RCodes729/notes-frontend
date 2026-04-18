'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '../../lib/api';
import { setToken } from '../../lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { username, name, email, password });
      setToken(res.data.token);
      router.push('/welcome');
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setErr(Array.isArray(msg) ? msg.join(', ') : msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 space-y-4 shadow-2xl">
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        {err && <p className="text-rose-300 text-sm">{err}</p>}

        <input className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-white" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-white" placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-white" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-white" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button disabled={loading} className="w-full rounded-xl py-2 bg-emerald-600 hover:bg-emerald-500 text-white">
          {loading ? 'Creating...' : 'Sign up'}
        </button>

        <p className="text-sm text-slate-300">
          Already have an account? <Link className="text-indigo-300 underline" href="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}