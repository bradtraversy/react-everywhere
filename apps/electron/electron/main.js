import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const devServer = process.env.VITE_DEV_SERVER_URL;

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 760,
    backgroundColor: '#0b0d10',
    show: false,
    webPreferences: {
      preload: path.join(dir, 'preload.js'),
      contextIsolation: true,
      sandbox: false,
    },
  });

  win.once('ready-to-show', () => win.show());

  if (devServer) {
    win.loadURL(devServer);
  } else {
    win.loadFile(path.join(dir, '..', 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
