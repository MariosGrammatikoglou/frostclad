import type { Metadata } from 'next'
import './globals.css'
import '98.css'

export const metadata: Metadata = {
  title: 'Frostclad',
  description: 'Retro Chat — Win98 Edition',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', minWidth: '100vw', background: '#c0c0c0', margin: 0 }}>
        <div className="window" style={{
          width: 900,
          margin: "6vh auto 0 auto",
          minHeight: 540,
          maxWidth: '97vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="title-bar">
            <div className="title-bar-text">Frostclad — Retro Chat</div>
          </div>
          <div className="window-body" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
