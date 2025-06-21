// apps/frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import './global.css';
import '98.css';

export const metadata: Metadata = {
  title: 'Frostclad',
  description: 'Retro Chat — Win98 Edition',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="app-window" style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "var(--background)"
      }}>
        {/* REMOVE outer title bar and window-body */}
        {children}
      </body>
    </html>
  );
}
