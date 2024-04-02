import { BrowserWindow, ipcMain, protocol, net } from "electron";
import { globalShortcut } from "electron";
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

//Setting up relative paths, so the app is independent of its position in the file tree
const dataFolderPath = path.join(__dirname, "data");
const userFile = path.join(__dirname, "userData.txt");
const pythonDir = path.join(__dirname, "python/utility2.py"); //utility2 is the updated version of the script with better file writing

//Logic to display and hide the overlay as needed, the shorcut key may be remapped to whatever, in the main.ts file
export function setUpShortcut(
  keyCombination: string,
  win: BrowserWindow | null
) {
  globalShortcut.register(keyCombination, () => {
    //Guard clause to deal with possibly null window

    if (win?.isVisible()) {
      win.hide();
    } else {
      win?.show();
      win?.maximize();
    }
  });
}

export function setUpMouseListeners(win: BrowserWindow | null) {
  //If the render process says the mouse is on the overlay element (Card.JSX in this case)
  ipcMain.handle("mouseEnter", () => {
    // console.log("Mouse in recieved");
    win?.setIgnoreMouseEvents(false);
  });

  ipcMain.handle("mouseLeave", () => {
    // console.log("Mouse leave recieved");
    win?.setIgnoreMouseEvents(true, { forward: true });
  });
}

//useless function, maybe if we have time in the future
export function setUpFileProtocol(protocolName: string) {
  // Taken straight from the electron docs (expand)
  // My understanding is that this captures the "file:\\\" request from the renderer process,
  // and then executes it in the main process, not sure how that makes things more secure, but
  // this seems to be the best practice according to the Electron Documentation
  // Source: https://www.electronjs.org/docs/latest/api/protocol
  protocol.handle(protocolName, (request) =>
    net.fetch("file://" + request.url.slice(`${protocolName}`.length))
  );
}

//Functions related to the data fetching, downloading and storing.
export function createDataFolder() {
  const subFolders = ["settings"];
  console.log(dataFolderPath);

  if (!fs.existsSync(dataFolderPath)) {
    try {
      fs.mkdirSync(dataFolderPath);
      console.log("No Data Folder Found, Creating one now.");
      fs.writeFileSync(userFile, "");
      // subFolders.forEach((subFolder)=>{
      //   const subFolderPath = path.join(dataFolderPath, subFolder)
      //   fs.mkdirSync(subFolderPath)

      // })
    } catch (err) {
      console.log("Error Creating Data folders", err);
    }
  }
}

//implemented - Needs more work
export function fetchAllPlaylists() {
  try {
    // Lesson that I learnt. Just save the damn file in JSONified string instead of parsing it every damn time 😭
    // TO DO: Rework the python script to avoid this mess of transforming between two formats
    const fileData: string = fs.readFileSync(userFile, "utf-8");
    const playlist = fileData.split("\n");
    const fileDataJSON: Object[] = [];
    playlist.forEach((item) => {
      const MetaData = item.split("|sep|");
      const url = MetaData[1];
      const name = MetaData[0];
      fileDataJSON.push({ name: name, url: url });
    });
    return fileDataJSON;
  } catch (err) {
    console.log(err);
  }
}

//implementing
export function fetchSongs(playlist: string) {
  //Read text file within the folder, this will get you the data
  const playlistFolder = path.join(dataFolderPath, playlist);
  const playlistDataFile = path.join(playlistFolder, `downloaded_files.txt`);
  try {
    const fileData = fs.readFileSync(playlistDataFile, 'utf-8');
    const fileDataJSON:Object[] = []
    
    const songs : string[] = fileData.split("\n")
    
    songs.forEach((song)=>{
      const songPath = song
      const songName = path.basename(song)
      fileDataJSON.push({name:songName, path:songPath})
    })
 
    return fileDataJSON

  } catch (err) {
    console.log(err);
  }
}

export async function downloadPlaylist(url: string, name: string) {
  // Invoke yt-dlp python scripts, with the global data path defined above
  // Also write to the userfile
  const dataToAdd = "\n" + name + "|sep|" + url;
  // Just a simple regex to replace the backward slash paths with the forward slashes, as it can cause errors in python due to \s
  // like characters being interpreted as special characters instead of simple strings
  // const dataFolder = dataFolderPath.replace(/\\/g, "/");
  const downloadScript = pythonDir.replace(/\\/g, "/");

  try {
    const data = fs.appendFileSync(userFile, dataToAdd);

    //Python process to be called here
    console.log("calling process...");

    const pythonProcess = spawn("python", [
      downloadScript,
      name,
      url
    ], {stdio: ['inherit', 'inherit', 'inherit']});

    

    // const pythonProcess = spawn("python", [downloadScript], {stdio: ['inherit', 'inherit', 'inherit']})

    console.log("calling script: ", downloadScript);
    // console.log("download folder: ", dataFolder)
    // pythonProcess.stdout.on("data", (data: any) => {
    //   // Send data to renderer process
    //   let myData: Uint8Array = data;
    //   console.log("this");
    //   console.dir(myData.toString());
    // });
    // pythonProcess.on("error", (err: any) => {
    //   console.error("Error spawning Python process:", err);
    //   console.dir(err);
    // });

    pythonProcess.on('exit', (code:any, signal:any) => {
      console.log(`Python process exited with code ${code} and signal ${signal}`);
    });
    
    pythonProcess.on('error', (err:any) => {
      console.error('Failed to start Python process:', err);
    });
    //return?
    // return data;
  } catch (err) {
    console.log(err);
  }
}
