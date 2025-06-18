const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    // In dev, load local Next.js server. In prod, load Vercel frontend.
    const isDev = !app.isPackaged;
    if (isDev) {
        win.loadURL('http://localhost:3000');
    } else {
        win.loadURL('https://frostclad-frontend.vercel.app');
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
