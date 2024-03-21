This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup nextjs and Electron

1. Install nextjs
   ```
   npx create-next-app@latest electron-nextjs-project
   ```
2. Install electron inside the created project folder (cd electron-nextjs-project)
   ```
   npm install --save-dev electron electron-builder concurrently
   ```
   ```
   npm install electron-serve
   ```
3. Modify the package.json like below

```
{
  ...
  "main": "main/main.js",
  "author": "Joel",
  "description": "Electron + NextJS example project",
  "scripts": {
    "dev": "concurrently -n \"NEXT,ELECTRON\" -c \"yellow,blue\" --kill-others \"next dev\" \"electron .\"",
    "build": "next build && electron-builder",
    ...
  }
  ...
}
```

4. Configuring Next.JS - modify next.config.js file.

```
const nextConfig = {
  ...
  output: "export",
  images: {
    unoptimized: true
  }
  ...
}
```

5. Create a folder 'main' and inside create 2 files 'main.js' and 'preload.js'
6. Inside main.js paste the below code

```
const { app, BrowserWindow } = require("electron");
const serve = require("electron-serve");
const path = require("path");

const appServe = app.isPackaged ? serve({
    directory: path.join(__dirname, "../out")
}) : null;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    if (app.isPackaged) {
        appServe(win).then(() => {
            win.loadURL("app://-");
        });
    } else {
        win.loadURL("http://localhost:3000");
        win.webContents.openDevTools();
        win.webContents.on("did-fail-load", (e, code, desc) => {
            win.webContents.reloadIgnoringCache();
        });
    }
}

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
```

7. set up preload.js

```
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    on: (channel, callback) => {
        ipcRenderer.on(channel, callback);
    },
    send: (channel, args) => {
        ipcRenderer.send(channel, args);
    }
});
```

8. to start the app: 
    ```
   npm run dev
    ```

9. For building the app. create a file 'electron-builder.yaml' and paste the below code.

```
appId: "io.github.rbfraphael.electron-next"
productName: "Electron Next.JS"
copyright: "Copyright (c) 2023 RBFraphael"
win:
  target: ["dir", "portable", "zip"]
  icon: "resources/icon.ico"
linux:
  target: ["dir", "appimage", "zip"]
  icon: "resources/icon.png"
mac:
  target: ["dir", "dmg", "zip"]
  icon: "resources/icon.icns"

```

10. to start build
    ```
    npm run build
    ```


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

