'use client';

import { usePathname } from 'next/navigation';
import BackgroundRotator from './BackgroundRotator';

export default function BackgroundSwitch() {
  const pathname = usePathname();

  // Disable global rotator on auth pages
  if (pathname === '/login' || pathname === '/signup') return null;

  return <BackgroundRotator />;
}