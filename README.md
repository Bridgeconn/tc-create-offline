# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### To setup vite ReactJS and Electron

1. npx create-vite
2. cd into folder
3. npm install electron wait-on concurrently cross-env //for installing electron
4. create a folder 'electron' in root dir
5. Inside electron folder create 2 files (electron.js and preload.js)
6. update package.json with below code

   '''
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

'''

7. to run the app : 'npm run electron:dev'
