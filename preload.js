const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    minimize: () => ipcRenderer.send("manualMinimize"),
    close: () => ipcRenderer.send("manualClose"),
});
