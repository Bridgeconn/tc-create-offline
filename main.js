const { app, BrowserWindow, ipcMain } = require('electronite');
const path = require('path');
const isDev = !app.isPackaged;
require('@electron/remote/main').initialize()

// Browser Window <- Renderer Process
function createWindow() {
  // Browser Window <- Renderer Process
  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    //minWidth:800,
    //minHeight:700,

    // backgroundColor: "white",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      // will sanitize JS code
      // TODO: explain when React application is initialize
      worldSafeExecuteJavaScript: true,
      // is a feature that ensures that both, your preload scripts and Electron
      // internal logic run in separate context
      contextIsolation: false
    }
  })

  require("@electron/remote/main").enable(win.webContents);

  win.loadFile('index.html')
  win.setMenu(null);
  isDev && win.webContents.openDevTools();
}

if (isDev) {
  require('electron-reload')(__dirname, { electron: path.join(__dirname, 'node_modules', '.bin', 'electronite') })
}
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})
// Chromium -> web eingine for rendering the UI, full Chrome-like web browser
// V8 -> engine that provides capabilities to execute, run, JS code in the browser
// Node JS(V8) -> we are able to run JS code + provides more features

// ipcMain.on('print', (event, options) => {
//   const win = BrowserWindow.getFocusedWindow();
//   win.webContents.print(options);
// });
