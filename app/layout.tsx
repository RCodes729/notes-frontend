import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notes Pro',
  description: 'Secure Notes App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}