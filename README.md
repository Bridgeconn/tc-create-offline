# tc-create-offline-poc

## how to set up electronite with Reactjs

## create folder and run npm init in order to create the package.json

npm commands :
```
mkdir tc-create-offline-poc && cd tc-create-offline-poc
npm init
```

fill details  and your package.json file should look something like this:

```
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "Hello World!",
  "main": "main.js",
  "author": "Jane Doe",
  "license": "MIT"
}
```


## install electronite

```
npm i electronite
```

## Usage
In your package.json

```
{
    "scripts": {
        "start": "electronite ."
    }
}

```

//
In your javascript
```
const {...} = require("electronite");
```
### need to create main.js and index.html

main.js
```
// Main Process
const { app, BrowserWindow } = require('electronite');

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
  win.webContents.openDevTools();
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
```

index.html
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="script-src 'self'" />
    <title>Electron App</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```



## Now Adding React to the existing Electron App
```
npm install --save react react-dom
```

now insert a folder js inside the src and add index.js for bootstrapping the react
for index.js
```
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';


const root =  createRoot(document.getElementById('container'));
root.render(<h1>Hello React</h1>);
```
and in the index.html there should be a div with an Id 'container' inside which the above h1 wil be rendered.

```
<div id='container'></div>
```
```
<script src='./src/js/index.js'></script>
```


now as import won’t work as electron does’nt understands it,so we need to  recompile our code which will be understood by the electron. For this we need install few packages

```
npm install --save @babel/preset-env @babel/preset-react babel-loader css-loader sass sass-loader style-loader webpack webpack-cli @babel/core
```

webpack.common.js
```
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  // TODO: Explain Source Map
  devtool: 'inline-source-map',
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [[
              '@babel/preset-env', {
                targets: {
                  esmodules: true
                }
              }],
              '@babel/preset-react']
          }
        }
      },
      {
        test: [/\.s[ac]ss$/i, /\.css$/i],
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      }
    ]
  },
  plugins: [],
  resolve: {
    extensions: ['.js'],
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'build', 'js'),
  },
};

```

Set watch script for compiling and watching changes in our files
(it’s placed below the “start” script in package.json)
```
"watch": "webpack --config webpack.common.js --watch"
```

restart the app if it’s running

change the script src in index.html

from : 
```
<script src='./src/js/index.js'></script>
```
to: 
```
<script src='./build/js/app.js'></script>
```
why ?
because of output of build file is in (it's mentioned in webpack.common.js)
```
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'build', 'js'),
  },

```
which means output path is './build/js/app.js'

------

## Now for automatic reload to happen 
 we need to install a package
```
npm install –save-dev electron-reload
```

(update) main.js
```javascript
// Main Process
const { app, BrowserWindow } = require('electronite');
//adding the following for reload
const path = require('path');
const isDev = !app.isPackaged;
//
function createWindow() {
  // Browser Window <- Renderer Process
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      // will sanitize JS code
      // TODO: explain when React application is initialize
      worldSafeExecuteJavaScript: true,
      // is a feature that ensures that both, your preload scripts and Electron
      // internal logic run in sparate context
      contextIsolation: true
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
//
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

// Webpack -> is a module builder, main purpose is to bundle JS files for usage in the browsert
// Babel -> js a JS compiler
```


### Others
create a App.js file inside src folder
```
import React from "react";

React
const App = () => {
    return ( 
        <div>
            <h1>tC create Offline app</h1>
        </div>
     );
}
 
export default App;
```
### install npm package
```
npm install --legacy-peer-deps
```

### to run the app
In one terminal run below code
```
npm run watch
```
Open new terminal and run 
```
npm start
```
