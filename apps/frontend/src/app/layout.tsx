'use client';

import type { ReactNode } from 'react';
import './global.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  const handleMinimize = () => {
    window.electronAPI?.minimize?.();
  };

  const handleClose = () => {
    window.electronAPI?.close?.();
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "var(--background)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div
          style={{
            width: 1200,
            height: 800,
            background: "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* ✅ Custom title bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "gray",
              padding: "4px 8px",
              WebkitAppRegion: "drag",
              userSelect: "none",
            }}
          >
            <p style={{ margin: 0 }}>Frostclad</p>
            <div style={{ display: "flex", gap: "4px", WebkitAppRegion: "no-drag" }}>
              <button onClick={handleMinimize}>min</button>
              <button onClick={handleClose}>close</button>
            </div>
          </div>

          {/* ✅ Content below title bar */}
          <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
        </div>
      </body>
    </html>
  );
}
