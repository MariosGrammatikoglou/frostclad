const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        resizable: false,
        frame: false,
        roundedCorners: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    const isDev = !app.isPackaged;
    if (isDev) {
        win.loadURL('http://localhost:3000');
    } else {
        win.loadURL('https://frostclad-frontend.vercel.app');
    }

    // Optional: Show update progress dialog
    autoUpdater.on('update-downloaded', (info) => {
        dialog.showMessageBox(win, {
            type: 'info',
            title: 'Update Ready',
            message: 'A new version has been downloaded. Restart the app to apply the update?',
            buttons: ['Restart', 'Later']
        }).then(result => {
            if (result.response === 0) autoUpdater.quitAndInstall();
        });
    });
}

ipcMain.on('window-minimize', () => BrowserWindow.getFocusedWindow()?.minimize());
ipcMain.on('window-maximize', () => {
    const w = BrowserWindow.getFocusedWindow();
    w?.isMaximized() ? w.unmaximize() : w.maximize();
});
ipcMain.on('window-close', () => BrowserWindow.getFocusedWindow()?.close());

app.whenReady().then(() => {
    createWindow();

    // Auto-update: only check for updates in production
    if (app.isPackaged) {
        autoUpdater.checkForUpdatesAndNotify();
    }
});

ipcMain.on("manualMinimize", () => {
    win.minimize();
})

ipcMain.on("manualClose", () => {
    app.quit();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});