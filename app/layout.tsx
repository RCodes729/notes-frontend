import './globals.css';
import type { Metadata } from 'next';
import ThemeBoot from '../components/ThemeBoot';
import BackgroundSwitch from '../components/BackgroundSwitch';

export const metadata: Metadata = {
  title: 'Notes Pro',
  description: 'Secure Notes App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen text-[var(--fg)]">
        <ThemeBoot />
        <BackgroundSwitch />
        {children}
      </body>
    </html>
  );
}