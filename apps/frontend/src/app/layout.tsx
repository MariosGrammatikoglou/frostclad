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
      <body className="app-window" >
        {/* Title bar */}
        <div className="title-bar" style={{ paddingLeft: '8px', paddingTop: '4px', paddingBottom: '4px' }}>
          <div className="title-bar-text">Frostclad — Retro Chat</div>
        </div>

        {/* Content full-screen */}
        <div className="window-body">
          {children}
        </div>
      </body>
    </html>
  );
}
