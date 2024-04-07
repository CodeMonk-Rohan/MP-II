"use strict";
const electron = require("electron");
const path$1 = require("node:path");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const record = require("node-record-lpcm16");
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
      if (MetaData.length === 0) {
        return;
      }
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
      if (song.length === 0)
        return;
      const songPath = song;
      const songName = path.basename(song);
      fileDataJSON.push({ name: songName, path: songPath });
    });
    return fileDataJSON;
  } catch (err) {
    console.log(err);
  }
}
async function downloadPlaylist(url, name, win2) {
  if (url.length == 0 || name.length == 0) {
    console.log("Empty fields, stopping creation of creation of subprocess");
    return;
  }
  const dataToAdd = "\n" + name + "|sep|" + url;
  const downloadScript = pythonDir.replace(/\\/g, "/");
  try {
    const data = await fs.appendFileSync(userFile, dataToAdd);
    console.log("calling process...");
    const pythonProcess = spawn(
      "python",
      [
        downloadScript,
        name,
        url
      ],
      {
        stdio: ["inherit", "inherit", "inherit"],
        encoding: "utf-8"
      }
    );
    console.log("calling script: ", downloadScript);
    pythonProcess.on("exit", (code, signal) => {
      console.log(`Python process exited with code ${code} and signal ${signal}`);
      win2 == null ? void 0 : win2.webContents.send("Downloaded");
    });
    pythonProcess.on("error", (err) => {
      console.error("Failed to start Python process:", err);
      console.log(win2, win2 == null ? void 0 : win2.webContents);
      win2 == null ? void 0 : win2.webContents.send(`Failed`);
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}
let audioStream;
const filePath = path.join(__dirname, "recorded_audio.wav");
const fileStream = fs.createWriteStream(filePath, { encoding: "binary" });
function recordAudio() {
  audioStream = record.record({
    sampleRate: 44100,
    channels: 1,
    verbose: true
  }).stream();
  audioStream.pipe(fileStream);
  console.log("Recording started. Audio will be saved to:", filePath);
}
function stopRecording() {
  if (audioStream) {
    audioStream.unpipe(fileStream);
    fileStream.end();
    console.log("File saved to : ", filePath);
  }
}
function exposeToFrontEnd(functions, window) {
  functions.forEach((func) => {
    electron.ipcMain.handle(func.name, async (event, ...args) => {
      try {
        if (func == downloadPlaylist) {
          return func(...args, window);
        }
        return await func(...args);
      } catch (err) {
        console.log("Error bc: ", err);
      }
    });
  });
}
function setUpDirectoryManager(win2) {
  const functions = [
    fetchAllPlaylists,
    downloadPlaylist,
    fetchSongs,
    recordAudio,
    stopRecording
  ];
  exposeToFrontEnd(functions, win2 = win2);
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
      webSecurity: false,
      nodeIntegration: true
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
  createWindow();
  setUpDirectoryManager(win);
  win == null ? void 0 : win.webContents.openDevTools({ mode: "detach" });
  setUpShortcut("Alt+M", win);
  setUpMouseListeners(win);
}
electron.app.whenReady().then(startApp);
