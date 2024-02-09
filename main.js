// Main Process
const { app, BrowserWindow } = require('electron');

//adding the following for reload
const path = require('path');
const isDev = !app.isPackaged;

function createWindow() {
  // Browser Window <- Renderer Process
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
  //adding the isDev condition for the dev Tools
  isDev && win.webContents.openDevTools();
}

//adding the following for reload
if (isDev) {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, 'node_modules', '.bin', 'electronite')
    })
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