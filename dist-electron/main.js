"use strict";
const electron = require("electron");
const path$1 = require("node:path");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const dataFolderPath = path.join(__dirname, "data");
const userFile = path.join(__dirname, "userData.txt");
const pythonDir = path.join(__dirname, "python/utility2.py");
function setUpShortcut(keyCombination, win2) {
  electron.globalShortcut.register(keyCombination, () => {
    if (win2 == null ? void 0 : win2.isVisible()) {
      win2.hide();
    } else {
      win2 == null ? void 0 : win2.show();
      win2 == null ? void 0 : win2.maximize();
    }
  });
}
function setUpMouseListeners(win2) {
  electron.ipcMain.handle("mouseEnter", () => {
    win2 == null ? void 0 : win2.setIgnoreMouseEvents(false);
  });
  electron.ipcMain.handle("mouseLeave", () => {
    win2 == null ? void 0 : win2.setIgnoreMouseEvents(true, { forward: true });
  });
}
function createDataFolder() {
  console.log(dataFolderPath);
  if (!fs.existsSync(dataFolderPath)) {
    try {
      fs.mkdirSync(dataFolderPath);
      console.log("No Data Folder Found, Creating one now.");
      fs.writeFileSync(userFile, "");
    } catch (err) {
      console.log("Error Creating Data folders", err);
    }
  }
}
function fetchAllPlaylists() {
  try {
    const fileData = fs.readFileSync(userFile, "utf-8");
    const playlist = fileData.split("\n");
    const fileDataJSON = [];
    playlist.forEach((item) => {
      const MetaData = item.split("|sep|");
      const url = MetaData[1];
      const name = MetaData[0];
      fileDataJSON.push({ name, url });
    });
    return fileDataJSON;
  } catch (err) {
    console.log(err);
  }
}
function fetchSongs(playlist) {
  const playlistFolder = path.join(dataFolderPath, playlist);
  const playlistDataFile = path.join(playlistFolder, `downloaded_files.txt`);
  try {
    const fileData = fs.readFileSync(playlistDataFile, "utf-8");
    const fileDataJSON = [];
    const songs = fileData.split("\n");
    songs.forEach((song) => {
      const songPath = song;
      const songName = path.basename(song);
      fileDataJSON.push({ name: songName, path: songPath });
    });
    return fileDataJSON;
  } catch (err) {
    console.log(err);
  }
}
async function downloadPlaylist(url, name) {
  if (url.length == 0 || name.length == 0) {
    console.log("Empty fields, stopping creation of creation of subprocess");
    return;
  }
  const dataToAdd = "\n" + name + "|sep|" + url;
  const downloadScript = pythonDir.replace(/\\/g, "/");
  try {
    const data = await fs.appendFileSync(userFile, dataToAdd);
    console.log("calling process...");
    const pythonProcess = spawn("python", [
      downloadScript,
      name,
      url
    ], { stdio: ["inherit", "inherit", "inherit"] });
    console.log("calling script: ", downloadScript);
    pythonProcess.on("exit", (code, signal) => {
      console.log(`Python process exited with code ${code} and signal ${signal}`);
    });
    pythonProcess.on("error", (err) => {
      console.error("Failed to start Python process:", err);
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}
function exposeToFrontEnd(functions) {
  functions.forEach((func) => {
    electron.ipcMain.handle(func.name, async (event, ...args) => {
      try {
        return await func(...args);
      } catch (err) {
        console.log("Error bc: ", err);
      }
    });
  });
}
function setUpDirectoryManager() {
  const functions = [
    fetchAllPlaylists,
    downloadPlaylist,
    fetchSongs
  ];
  exposeToFrontEnd(functions);
}
process.env.DIST = path$1.join(__dirname, "../dist");
process.env.VITE_PUBLIC = electron.app.isPackaged ? process.env.DIST : path$1.join(process.env.DIST, "../public");
let win;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  win = new electron.BrowserWindow({
    icon: path$1.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path$1.join(__dirname, "preload.js"),
      webSecurity: false
    },
    frame: false,
    transparent: true,
    skipTaskbar: true,
    fullscreen: true,
    show: true
    //when starting 
  });
  win == null ? void 0 : win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "normal");
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(process.env.DIST, "index.html"));
  }
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
    win = null;
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
function startApp() {
  createDataFolder();
  setUpDirectoryManager();
  createWindow();
  win == null ? void 0 : win.webContents.openDevTools({ mode: "detach" });
  setUpShortcut("Alt+M", win);
  setUpMouseListeners(win);
}
electron.app.whenReady().then(startApp);
