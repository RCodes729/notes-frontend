'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '../../components/AuthGuard';
import AppShell from '../../components/AppShell';
import PageTransition from '../../components/PageTransition';
import { api } from '../../lib/api';

type Me = {
  id: string;
  username: string;
  email: string;
  name?: string | null;
};

const AVATAR_KEY = 'notes_avatar_dataurl';

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPass, setSavingPass] = useState(false);

  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/auth/me');
        setMe(res.data);
      } catch (e: any) {
        setErr(e?.response?.data?.message || 'Failed to load profile');
      }
    })();

    const saved = localStorage.getItem(AVATAR_KEY);
    if (saved) setAvatar(saved);
  }, []);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setMsg('');
    setSavingPass(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setMsg('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (e: any) {
      const m = e?.response?.data?.message;
      setErr(Array.isArray(m) ? m.join(', ') : m || 'Could not change password');
    } finally {
      setSavingPass(false);
    }
  }

  function onAvatarChange(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      setAvatar(dataUrl);
      localStorage.setItem(AVATAR_KEY, dataUrl);
      setMsg('Avatar updated locally');
    };
    reader.readAsDataURL(file);
  }

  return (
    <AuthGuard>
      <PageTransition>
        <AppShell title="Settings" showBackTo="/welcome">
          <div className="grid md:grid-cols-2 gap-4">
            <section className="rounded-2xl border border-white/20 bg-white/10 p-5">
              <h2 className="text-lg font-semibold mb-3">Profile</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-700">
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-xl">👤</div>
                  )}
                </div>
                <label className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 cursor-pointer">
                  Upload avatar
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onAvatarChange(e.target.files?.[0])}
                  />
                </label>
              </div>
              <p className="text-sm text-slate-300">Username: {me?.username || '-'}</p>
              <p className="text-sm text-slate-300">Email: {me?.email || '-'}</p>
              <p className="text-sm text-slate-300">Name: {me?.name || '-'}</p>
            </section>

            <section className="rounded-2xl border border-white/20 bg-white/10 p-5">
              <h2 className="text-lg font-semibold mb-3">Change password</h2>
              <form onSubmit={changePassword} className="space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  disabled={savingPass}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500"
                >
                  {savingPass ? 'Saving...' : 'Update password'}
                </button>
              </form>
              <p className="text-xs text-slate-400 mt-2">Must include uppercase, lowercase, number.</p>
            </section>
          </div>

          {msg && <p className="text-emerald-300 mt-4">{msg}</p>}
          {err && <p className="text-rose-300 mt-2">{err}</p>}
        </AppShell>
      </PageTransition>
    </AuthGuard>
  );
}