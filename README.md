## To setup vite ReactJS and Electron

1. To install Reactjs
   ```
   npx create-vite
   ```
2. change directory `cd project-folder-name`
3.
   ```
   npm install electron wait-on concurrently cross-env
   ```
4. create a folder 'electron' in root dir
5. Inside electron folder create 2 files (electron.js and preload.js)
6. Paste the below code inside electron.js
   ```
   const path = require('path');
   const { app, BrowserWindow } = require('electron');
   const isDev = process.env.IS_DEV == "true" ? true : false;
   function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 650,
        autoHideMenuBar: true,
        resizable: false,
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    mainWindow.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url);
        return { action: "deny" };
    });
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../dist/index.html')}`
    );
    // Open the DevTools.
    if (isDev) {
        //mainWindow.webContents.openDevTools();
    }
   }
   app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
   });
   app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
   });
   
7. update package.json with the below code.

```
   {
   "main":"electron/electron.js",
   "scripts": {
   "dev": "vite",
   "build": "vite build",
   "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
   "preview": "vite preview",
   "electron": "wait-on tcp:5173 && cross-env IS_DEV=true electron .",
   "electron:pack": "electron-builder --dir",
   "electron:dev": "concurrently -k \"cross-env BROWSER=none npm run dev\" \"npm run electron\"",
   "electron:builder": "electron-builder",
   "build:for:electron": "cross-env ELECTRON=true vite build",
   "app:build": "npm run build:for:electron && npm run electron:builder"
   }
   }

```

8. to run the app
   ```
   npm run electron:dev
   ```

## Learn More

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
- [Basics electron vite react](https://www.youtube.com/watch?v=ONpVol7B7AY)
- [IPC and Context Bridging](https://www.youtube.com/watch?v=uELf5oB-7E0)
- [Electron app React](https://www.youtube.com/watch?v=KvWA3f_IxyE) extra
