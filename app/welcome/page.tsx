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
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
            <h2 className="text-2xl font-bold">You’re logged in 🎉</h2>
            <p className="text-slate-300 mt-1">Manage your notes and settings.</p>
            <div className="mt-5 flex gap-2">
              <Link href="/notes" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500">
                Open Notes
              </Link>
              <Link href="/settings" className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600">
                Settings
              </Link>
            </div>
          </div>
        </AppShell>
      </PageTransition>
    </AuthGuard>
  );
}