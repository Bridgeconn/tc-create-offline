This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Setup nextjs and Electron

1. npx create-next-app@latest electron-nextjs-project
2. npm install --save-dev electron electron-builder concurrently
3. npm install electron-serve
4. Modify the package.json like below

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
'''
```

5. Configuring Next.JS - modify next.config.js file.

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

6. Create a folder 'main' and create 2 file 'main.js' and 'preload.js'
7. inside main.js paste the below code

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

8. set up preload.js

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

9. to start the app: 'npm run dev'

10. Build the app. create a file 'electron-builder.yaml' and paste the below code.

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

11. to start build - 'npm run build'
