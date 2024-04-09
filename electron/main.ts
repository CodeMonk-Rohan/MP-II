import { app, BrowserWindow, ipcMain} from 'electron'

import path from 'node:path'
import { createDataFolder, recogniseAudio, setUpMouseListeners, setUpShortcut } from './util/util'
import { setUpDirectoryManager } from './util/expose'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity:false,
      nodeIntegration:true,
    },
    frame:false,
    transparent:true, 
    skipTaskbar:true,
    fullscreen:true,
    show:true, //when starting 
  })

  win?.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen:true})
  win.setAlwaysOnTop(true, "normal")

  
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


function startApp(){

  // // Creating the protocol for allowing mp3 files to be accessed securely
  // setUpFileProtocol("cprotocol:/")
  // Create/Verify the existence of the data folders
  createDataFolder()

  

  //Create the actual window
  createWindow()

  //functions requiring window must be called after creating the damn window (who would have thought?)
  setUpDirectoryManager(win)


  //Opening dev tools
  win?.webContents.openDevTools({mode:"detach"})

  //attaching shortcuts
  setUpShortcut("Alt+M", win)

  //set up mouse listeners (this ensures that the mouse events are ignore if its not within the application)
  setUpMouseListeners(win)
}




app.whenReady().then(startApp)
