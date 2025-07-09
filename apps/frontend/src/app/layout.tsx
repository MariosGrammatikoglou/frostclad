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
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className="app-window" style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "var(--background)"
      }}>
        <nav>
          <p>Custom title</p>
          <div>
            <button>b1</button>
            <button>b2</button>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}