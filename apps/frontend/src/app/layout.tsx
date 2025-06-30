// apps/frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import './global.css'; // Import global CSS
import '98.css'; // Import retro CSS for the win98 style (if needed)

export const metadata: Metadata = {
  title: 'Frostclad',
  description: 'Retro Chat — Win98 Edition',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Optional: FontAwesome for icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
      </head>

      <body className="app-window">
        <nav id="custom-topbar">
          {/* Left Icon */}
          <span className="icon">
            <i className="fas fa-home"></i> {/* FontAwesome icon */}
          </span>

          {/* Title */}
          <span className="title">Frostclad</span>

          {/* Right Side Buttons */}
          <div className="buttons">
            <button id="minimize">Minimize</button>
            <button id="close">Close</button>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
