// apps/frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import './global.css'; // keep this if you need your own base styles
// import '98.css'; ❌ removed

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
        style={{
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* ✅ Simple custom top bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#333',
            color: '#fff',
            padding: '6px 12px',
            WebkitAppRegion: 'drag',
            userSelect: 'none',
          }}
        >
          <div>Frostclad</div>
          <div style={{ display: 'flex', gap: '8px', WebkitAppRegion: 'no-drag' }}>
            <button
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid #555',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
            >
              _
            </button>
            <button
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid #555',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
            >
              ☐
            </button>
            <button
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid #555',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* App content */}
        {children}
      </body>
    </html>
  );
}
