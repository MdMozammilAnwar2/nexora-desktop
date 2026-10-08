const { app, BrowserWindow, shell, Menu, nativeTheme } = require('electron');
const path = require('path');

// Optional: load a live hosted web app instead of the bundled build
//   NEXORA_WEB_URL=https://app.yourdomain.com npm start
const WEB_URL = process.env.NEXORA_WEB_URL;

let win;
function createWindow() {
  nativeTheme.themeSource = 'light';
  win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 680,
    title: 'Nexora',
    backgroundColor: '#f8fafc',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    icon: path.join(__dirname, 'build', 'icon.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (WEB_URL) win.loadURL(WEB_URL);
  else win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  win.once('ready-to-show', () => win.show());

  // open external links in the default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file://') && !(WEB_URL && url.startsWith(WEB_URL))) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });
}

const template = [
  ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
  { role: 'fileMenu' },
  { role: 'editMenu' },
  {
    label: 'View',
    submenu: [{ role: 'reload' }, { role: 'forceReload' }, { type: 'separator' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' }, { role: 'togglefullscreen' },
      ...(app.isPackaged ? [] : [{ role: 'toggleDevTools' }])],
  },
  { role: 'windowMenu' },
];

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
  app.whenReady().then(() => {
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    createWindow();
    app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow());
  });
  app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
}
