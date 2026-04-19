'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearToken } from '../lib/auth';
import { getTheme, toggleTheme } from '../lib/theme';
import ConfirmModal from './ConfirmModal';

export default function AppShell({
  title,
  children,
  showBackTo,
}: {
  title: string;
  children: React.ReactNode;
  showBackTo?: string;
}) {
  const router = useRouter();
  const [askLogout, setAskLogout] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getTheme());

  function onToggleTheme() {
    const t = toggleTheme();
    setTheme(t);
  }

  function onLogout() {
    clearToken();
    router.push('/login');
  }

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <div className="flex gap-2">
          {showBackTo && (
            <Link href={showBackTo} className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white">
              Back
            </Link>
          )}
          <button onClick={onToggleTheme} className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white">
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button onClick={() => setAskLogout(true)} className="px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white">
            Logout
          </button>
        </div>
      </div>

      {children}

      <ConfirmModal
        open={askLogout}
        title="Logout?"
        description="You will need to login again to access your notes."
        confirmText="Yes, logout"
        cancelText="Stay"
        onCancel={() => setAskLogout(false)}
        onConfirm={onLogout}
      />
    </main>
  );
}