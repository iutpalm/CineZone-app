const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ftp = require('basic-ftp');

// --- CINEZONE MULTI-SERVER ARCHITECTURE ---
const SERVERS = {
    "MOVIES_7":   { host: "172.16.50.7",  user: "anonymous", password: "" },
    "MOVIES_14":  { host: "172.16.50.14", user: "anonymous", password: "" }
};

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 850,
        backgroundColor: '#141414',
        title: "CineZone Premium Media Hub",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Secure Multi-Server Dynamic IPC Data Handlers
ipcMain.handle('fetch-category-data', async (event, { serverKey, targetPath }) => {
    const client = new ftp.Client();
    const config = SERVERS[serverKey];
    
    if (!config) return { error: "Target server allocation config missing." };

    try {
        await client.access(config);
        const list = await client.list(targetPath);
        
        return list.map(file => ({
            name: file.name,
            isDirectory: file.isDirectory,
            size: file.size,
            url: `ftp://${config.user}:${config.password}@${config.host}${targetPath}/${encodeURIComponent(file.name)}`
        }));
    } catch (err) {
        console.error(`Error on server connection [${config.host}]:`, err);
        return { error: err.message };
    } finally {
        client.close();
    }
});