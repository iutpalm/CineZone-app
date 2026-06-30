contextBridge.exposeInMainWorld('CineZoneAPI', {

// Securely expose the dynamic FTP fetching API to the UI window
    fetchDirectory: (options) => ipcRenderer.invoke('fetch-category-data', options)
});