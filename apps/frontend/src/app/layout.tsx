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
      <body className="app-window">
        {/* Win98 title bar */}
        <div className="title-bar">
          <div className="title-bar-text">Frostclad — Retro Chat</div>
        </div>

        {/* Main content stretching full window */}
        <div className="window-body">
          {children}
        </div>
      </body>
    </html>
  );
}
