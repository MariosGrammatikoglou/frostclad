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

  const isMobile = window.innerWidth <= 600; // Check for mobile size

  // Define styles conditionally
  const containerStyles = {
    width: "100%",
    maxWidth: "1200px",  // Desktop width
    height: "100%",
    maxHeight: "800px",  // Desktop height
    background: "#fff",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const topBarStyles = {
    display: isMobile ? "none" : "flex", // Hide top bar on mobile
    justifyContent: "space-between",
    alignItems: "center",
    background: "gray",
    padding: "4px 8px",
    WebkitAppRegion: "drag",
    userSelect: "none",
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
          overflow: "hidden",
        }}
      >
        {/* Wrapper for mobile and desktop */}
        <div style={containerStyles}>
          {/* Custom title bar (only visible on desktop, hidden on mobile) */}
          <div style={topBarStyles}>
            <p style={{ margin: 0 }}>Frostclad</p>
            <div style={{ display: "flex", gap: "4px", WebkitAppRegion: "no-drag" }}>
              <button onClick={handleMinimize}>min</button>
              <button onClick={handleClose}>close</button>
            </div>
          </div>

          {/* Content below the title bar */}
          <div
            style={{
              flex: 1,
              overflow: "auto",
              width: "100%",
              height: "100%",  // Full height content
            }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}