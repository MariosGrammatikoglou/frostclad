const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        // Optional: Uncomment frame: false for fully custom Win98 title bar!
        // frame: false, // <- Use this for custom, draggable title bar with 98.css (see notes below)
        webPreferences: {
            nodeIntegration: false, // Good security (keep it false)
            contextIsolation: true, // Good security (keep it true)
        }
    });

    // Load local app in development, Vercel in production
    const isDev = !app.isPackaged;
    if (isDev) {
        win.loadURL('http://localhost:3000');
    } else {
        win.loadURL('https://frostclad-frontend.vercel.app');
    }
}

// App ready
app.whenReady().then(createWindow);

// Quit on all windows closed, except on macOS (common Electron pattern)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// For macOS: re-create window on dock click if no window open
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
