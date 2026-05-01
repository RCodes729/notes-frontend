const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Core API Wrapper
 * Automatically handles Base URL, JSON parsing, and Authorization headers.
 */
export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || data?.error || `Request failed: ${res.status}`;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }

  return data as T;
}

/**
 * Authentication Helpers
 */

export async function signup(payload: { name: string; email: string; password: string }) {
  const res = await api<{ user: { id: string; name: string; email: string }; accessToken: string }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // ✅ Fixed: Ensure we save accessToken to prevent "Unauthorized" on redirect
  if (typeof window !== 'undefined' && res?.accessToken) {
    localStorage.setItem('token', res.accessToken);
  }

  return res;
}

export async function login(payload: { email: string; password: string }) {
  const res = await api<{ user: { id: string; name: string; email: string }; accessToken: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // ✅ Fixed: Use accessToken to match backend response
  if (typeof window !== 'undefined' && res?.accessToken) {
    localStorage.setItem('token', res.accessToken);
  }

  return res;
}

/**
 * Note Management Helpers
 * Note: These use 'content_text' to match the database schema.
 */

export async function createNote(payload: { title: string; content_text: string }) {
  return api('/notes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateNote(id: string, payload: { title?: string; content_text?: string }) {
  return api(`/notes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteNote(id: string) {
  return api(`/notes/${id}`, {
    method: 'DELETE',
  });
}