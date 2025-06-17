import type { Metadata } from 'next'
import { IM_Fell_English_SC } from 'next/font/google'
import './globals.css'

const medievalFont = IM_Fell_English_SC({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Frostclad',
  description: 'Medieval MMORPG Chat',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen min-w-screen bg-[#1a1206] flex items-center justify-center ${medievalFont.className}`}
      >
        <div
          className="medieval-window shadow-2xl rounded-3xl border-8 border-[#c9ac70] overflow-hidden"
          style={{
            width: '1200px',
            height: '780px',
            maxWidth: '97vw',
            maxHeight: '97vh',
            background: `
              repeating-linear-gradient(135deg, #efe0b7 0px, #e5d6b1 30px, #efe0b7 80px),
              linear-gradient(120deg, #d4bc8a 0%, #e5dab3 100%)
            `,
            boxShadow: '0 16px 64px 0 #2b1e0b99, 0 1.5px 0 #bfa36f inset',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* TOP BAR */}
          <div
            className="window-bar flex items-center px-6 py-2 bg-[#bfa36f]/90 border-b-2 border-[#a78a4b] font-bold text-xl tracking-wide font-serif select-none"
            style={{
              letterSpacing: '2px',
              height: '48px',
              boxShadow: '0 2px 8px #bfa36f33',
              flexShrink: 0,
            }}
          >
            🏰 Frostclad — Medieval Chat
          </div>
          {/* App content */}
          <div className="flex-1 overflow-hidden flex" style={{ height: 'calc(100% - 48px)' }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
