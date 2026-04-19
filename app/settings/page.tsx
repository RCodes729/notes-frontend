'use client';

import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import AuthGuard from '../../components/AuthGuard';
import PageTransition from '../../components/PageTransition';
import { api } from '../../lib/api';

type Profile = {
  id: number;
  email: string;
  username?: string;
  name?: string;
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setError('');
      try {
        const data = await api<Profile>('/users/me', { method: 'GET' });
        if (mounted) setProfile(data);
        return;
      } catch {}

      try {
        const data = await api<Profile>('/auth/me', { method: 'GET' });
        if (mounted) setProfile(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load profile');
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg('');

    try {
      await api('/users/change-password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPwMsg('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      return;
    } catch {}

    try {
      await api('/auth/change-password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPwMsg('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (e: any) {
      setPwMsg(e?.message || 'Failed to update password');
    }
  }

  return (
    <AuthGuard>
      <PageTransition>
        <AppShell title="Settings" showBackTo="/welcome">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-6">
              <h2 className="text-4xl font-bold text-white mb-6">Profile</h2>
              <div className="text-white/90 space-y-1 text-2xl">
                <p>Username: {profile?.username ?? '-'}</p>
                <p>Email: {profile?.email ?? '-'}</p>
                <p>Name: {profile?.name ?? '-'}</p>
              </div>
              {error && <p className="text-rose-300 mt-6 text-2xl">{error}</p>}
            </section>

            <section className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-6">
              <h2 className="text-4xl font-bold text-white mb-6">Change password</h2>
              <form onSubmit={updatePassword} className="space-y-4">
                <input
                  className="w-full px-5 py-4 rounded-2xl bg-slate-950/50 border border-white/15 text-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 text-2xl"
                  placeholder="Current password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <input
                  className="w-full px-5 py-4 rounded-2xl bg-slate-950/50 border border-white/15 text-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 text-2xl"
                  placeholder="New password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-2xl">
                  Update password
                </button>
              </form>
              {pwMsg && <p className="text-slate-200 mt-4 text-xl">{pwMsg}</p>}
            </section>
          </div>
        </AppShell>
      </PageTransition>
    </AuthGuard>
  );
}