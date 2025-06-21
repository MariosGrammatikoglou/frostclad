// app/frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'Frostclad',
  description: 'Retro Chat — Win98 Edition',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%', margin: 0 }}>
      <body className="app-window">
        {/* Title bar */}
        <div className="title-bar">
          <div className="title-bar-text">Frostclad — Retro Chat</div>
        </div>

        {/* Main content takes full window */}
        <div className="content-area">{children}</div>
      </body>
    </html>
  );
}
