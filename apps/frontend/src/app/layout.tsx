'use client'; // ✅ Required for client-side interactivity

import type { ReactNode } from 'react';
import { useEffect } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const minimizeBtn = document.getElementById("minimize");
    const closeBtn = document.getElementById("close");

    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", () => {
        if (window.electronAPI?.minimize) {
          window.electronAPI.minimize();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (window.electronAPI?.close) {
          window.electronAPI.close();
        }
      });
    }

    // Optional cleanup
    return () => {
      minimizeBtn?.removeEventListener("click", () => { });
      closeBtn?.removeEventListener("click", () => { });
    };
  }, []);

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
          {/* Custom title bar */}
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
              <button id="minimize">min</button>
              <button id="close">close</button>
            </div>
          </div>

          <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
        </div>
      </body>
    </html>
  );
}
