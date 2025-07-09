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
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className="app-window"
        style={{
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          background: 'var(--background)',
        }}
      >
        {/* 🖱️ Win98-style title bar */}
        <div
          className="title-bar"
          style={{
            WebkitAppRegion: 'drag', // for Electron drag
            userSelect: 'none',
          }}
        >
          <div className="title-bar-text">Frostclad</div>
          <div className="title-bar-controls" style={{ WebkitAppRegion: 'no-drag' }}>
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>

        {/* Main content */}
        <div className="window-body" style={{ height: 'calc(100vh - 24px)', overflow: 'auto' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
