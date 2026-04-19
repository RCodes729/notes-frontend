'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { setToken } from '../../lib/auth';
import PageTransition from '../../components/PageTransition';

type LoginResponse = {
  token: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      const res = await api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(res.token);
      router.push('/welcome');
    } catch (error: any) {
      setErr(error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <main className="relative min-h-screen flex items-center justify-center px-4">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/backgrounds/login-bg.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-black/35" />

        <form
          onSubmit={onSubmit}
          className="w-full max-w-xl rounded-3xl border border-white/20 bg-slate-900/55 backdrop-blur-xl p-8 shadow-2xl"
        >
          <h1 className="text-5xl font-bold text-white mb-8 leading-tight">Welcome back</h1>

          <div className="space-y-4">
            <input
              className="w-full px-5 py-4 rounded-2xl bg-slate-950/50 border border-white/15 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full px-5 py-4 rounded-2xl bg-slate-950/50 border border-white/15 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold text-xl transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          {err && <p className="text-rose-300 text-sm mt-4">{err}</p>}

          <p className="text-slate-300 mt-6 text-lg">
            No account?{' '}
            <Link href="/signup" className="text-indigo-300 underline hover:text-indigo-200">
              Sign up
            </Link>
          </p>
        </form>
      </main>
    </PageTransition>
  );
}