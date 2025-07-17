'use client';

import { ReactNode, useEffect, useState } from 'react';
import './global.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false); // State to track screen width

  useEffect(() => {
    // Check if window is defined (we are on the client-side)
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 600);
      };

      // Set initial state
      handleResize();

      // Add event listener for resizing
      window.addEventListener('resize', handleResize);

      // Cleanup listener on unmount
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleMinimize = () => {
    if (typeof window !== 'undefined') {
      window.electronAPI?.minimize?.();
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.electronAPI?.close?.();
    }
  };

  // Define styles conditionally based on screen size
  const containerStyles = {
    width: '100%',
    maxWidth: '1200px',  // Desktop width
    height: '100%',
    maxHeight: '800px',  // Desktop height
    background: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const topBarStyles = {
    display: isMobile ? 'none' : 'flex', // Hide top bar on mobile
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'gray',
    padding: '4px 8px',
    WebkitAppRegion: 'drag',
    userSelect: 'none',
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
          background: 'var(--background)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        {/* Wrapper for mobile and desktop */}
        <div style={containerStyles}>
          {/* Custom title bar (only visible on desktop, hidden on mobile) */}
          <div style={topBarStyles}>
            <p style={{ margin: 0 }}>Frostclad</p>
            <div style={{ display: 'flex', gap: '4px', WebkitAppRegion: 'no-drag' }}>
              <button onClick={handleMinimize}>min</button>
              <button onClick={handleClose}>close</button>
            </div>
          </div>

          {/* Content below the title bar */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              width: '100%',
              height: '100%',  // Full height content
            }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
