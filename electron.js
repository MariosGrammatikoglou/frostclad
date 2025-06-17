const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const isDev = !app.isPackaged;
let nextProcess;

// Setup logger to file
const logPath = path.join(__dirname, 'frostclad-log.txt');
function log(msg) {
    const timestamp = `[${new Date().toISOString()}] `;
    fs.appendFileSync(logPath, `${timestamp}${msg}\n`);
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1260,
        height: 820,
        resizable: false,
        maximizable: false,
        minimizable: true,
        autoHideMenuBar: true,
        show: true,
        webPreferences: {
            nodeIntegration: false,
        },
    });

    const url = 'http://localhost:3000';

    if (!isDev) {
        const frontendPath = path.join(__dirname, 'apps', 'frontend');
        const nextBinary = path.join(frontendPath, 'node_modules', '.bin', 'next');
        const nextExecutable = process.platform === 'win32' ? `${nextBinary}.cmd` : nextBinary;

        log('[electron] Starting Next.js server...');
        try {
            nextProcess = spawn(nextExecutable, ['start', '-p', '3000'], {
                cwd: frontendPath,
            });

            nextProcess.stdout.on('data', (data) => log(`[next] ${data}`));
            nextProcess.stderr.on('data', (data) => log(`[next error] ${data}`));
        } catch (err) {
            log(`❌ Failed to start Next.js: ${err.message}`);
        }
    }

    setTimeout(() => {
        log(`[electron] Loading frontend from: ${url}`);
        win.loadURL(url).catch(err => {
            log(`❌ loadURL error: ${err.message}`);
        });

        win.webContents.on('did-fail-load', (_, __, errorDescription) => {
            log(`❌ Failed to load URL: ${errorDescription}`);
        });

        win.webContents.openDevTools({ mode: 'detach' });
    }, 1500);
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (nextProcess) nextProcess.kill();
    if (process.platform !== 'darwin') app.quit();
});
