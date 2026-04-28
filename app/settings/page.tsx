'use client';

import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import AuthGuard from '../../components/AuthGuard';
import PageTransition from '../../components/PageTransition';
import { api } from '../../lib/api';

type Profile = {
  id: string; // Updated to string since your DB uses UUIDs
  email: string;
  username?: string;
  name?: string;
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');

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

  return (
    <AuthGuard>
      <PageTransition>
        <AppShell title="Settings" showBackTo="/welcome">
          <div className="max-w-2xl mx-auto">
            <section className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-6">
              <h2 className="text-4xl font-bold text-white mb-6">Profile</h2>
              <div className="text-white/90 space-y-1 text-2xl">
                <p>Username: {profile?.username ?? '-'}</p>
                <p>Email: {profile?.email ?? '-'}</p>
                <p>Name: {profile?.name ?? '-'}</p>
              </div>
              {error && <p className="text-rose-300 mt-6 text-2xl">{error}</p>}
            </section>
          </div>
        </AppShell>
      </PageTransition>
    </AuthGuard>
  );
}