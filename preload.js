// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    minimize: () => ipcRenderer.send("manualMinimize"),
    close: () => ipcRenderer.send("manualClose"),
});
