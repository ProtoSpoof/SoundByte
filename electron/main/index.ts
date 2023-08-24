import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { GlobalKeyboardListener} from 'node-global-key-listener';
import Store from 'electron-store';
import path from 'path';
import * as gtts from '@google-cloud/text-to-speech';
require('dotenv').config({
    path: app.isPackaged
    ? path.join(app.getPath('exe').substring(0, app.getPath('exe').lastIndexOf('\\')), './resources/keys/.env')
    : path.resolve(process.cwd(), '.env')
});

const KEYBOARD_LISTENER = new GlobalKeyboardListener();
const STORE = new Store();
const TTS_CLIENT = new gtts.TextToSpeechClient();
const TTS_DIRECTORY = path.join(app.getPath('userData'), './temp/')

const synthesizeSpeech = async (message) => {
    const request = {
        input: {text: message},
        // Select the language and SSML voice gender (optional)
        voice: {languageCode: 'en-US', ssmlGender: 'FEMALE', name: 'en-US-Neural2-F'},
        audioConfig: {audioEncoding: 'OGG_OPUS', pitch: 0.80, speakingRate: 1.19},
        
    }
    const filename = TTS_DIRECTORY + new Date().getMilliseconds() + '.ogg';
    const [response] = await TTS_CLIENT.synthesizeSpeech(request);
    return(response.audioContent);
}

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.VITE_PUBLIC, 'logo.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false,
    },
    width: 1072,
    height: 607,
    resizable: false,
    fullscreenable: false,
  })

  win.setMenuBarVisibility(false);

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    // win.webContents.openDevTools()
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

KEYBOARD_LISTENER.addListener((e, down) => {
    if (down[e.name] || !STORE.has(`keybind.${e.rawKey.name}`)) return;
    synthesizeSpeech(STORE.get(`keybind.${e.rawKey.name}`)).then((url) => {
        win.webContents.send('send-message', url);
    });
});

// IPC Handlers
ipcMain.on("set-keybind", (event, key, message) => {
    let value = {};
    value[key] = message;
    STORE.set('keybind', value);
});

ipcMain.on("remove-keybind", (event, key) => {
    STORE.delete(`keybind.${key}`);
});

ipcMain.on("save-settings", (event, settings) => {

    STORE.set('settings', settings);

});

ipcMain.handle("get-settings", (event) => {
    return STORE.get('settings');
});

ipcMain.handle("get-message", (event, key) => {
    return STORE.get(`keybind.${key}`) || "";
});


ipcMain.handle("get-audio", async (event, message) => {  
    return synthesizeSpeech(message);
});
