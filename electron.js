const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 950,
        resizable: false,
        frame: false,        // ☑️ Removes the OS title bar and frame

        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
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


ipcMain.on('window-minimize', () => BrowserWindow.getFocusedWindow()?.minimize());
ipcMain.on('window-maximize', () => {
    const w = BrowserWindow.getFocusedWindow();
    w?.isMaximized() ? w.unmaximize() : w.maximize();
});
ipcMain.on('window-close', () => BrowserWindow.getFocusedWindow()?.close());


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
