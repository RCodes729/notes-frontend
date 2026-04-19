'use client';

import { useEffect, useState } from 'react';

const IMAGES = [
  '/backgrounds/bg1.jpg',
  '/backgrounds/bg2.jpg',
  '/backgrounds/bg3.jpg',
  '/backgrounds/bg4.jpg',
];

export default function BackgroundRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${src}')`,
            opacity: i === index ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/45 dark:bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900/20 to-black/40" />
    </div>
  );
}