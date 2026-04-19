'use client';

import Link from 'next/link';
import AuthGuard from '../../components/AuthGuard';
import AppShell from '../../components/AppShell';
import PageTransition from '../../components/PageTransition';

export default function WelcomePage() {
  return (
    <AuthGuard>
      <PageTransition>
        <AppShell title="Welcome">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <h2 className="text-2xl font-bold text-white">You’re logged in 🎉</h2>
            <p className="text-slate-200 mt-1">Manage your notes, settings, and AI assistant.</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/notes" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white">
                Open Notes
              </Link>
              <Link href="/settings" className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white">
                Settings
              </Link>
              <Link href="/chat" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white">
                AI Chat
              </Link>
            </div>
          </div>
        </AppShell>
      </PageTransition>
    </AuthGuard>
  );
}