export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className="app-window"
        style={{
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: 0,
          overflow: "hidden",
          background: "var(--background)",
        }}
      >
        {/* ✅ Custom top bar for Electron */}
        <div
          className="title-bar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "gray",
            padding: "4px 8px",
            WebkitAppRegion: "drag", // Important for Electron!
            userSelect: "none",
          }}
        >
          <p style={{ margin: 0 }}>Frostclad</p>
          <div style={{ display: "flex", gap: "4px", WebkitAppRegion: "no-drag" }}>
            <button>b1</button>
            <button>b2</button>
          </div>
        </div>

        {/* Main content */}
        {children}
      </body>
    </html>
  );
}  