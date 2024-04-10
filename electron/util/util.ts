import { BrowserWindow, ipcMain, protocol, net, shell } from "electron";
import { globalShortcut } from "electron";
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");



//Setting up relative paths, so the app is independent of its position in the file tree
const dataFolderPath = path.join(__dirname, "data");
const userFile = path.join(__dirname, "userData.txt");
const pythonDir = path.join(__dirname, "python/utility2.py"); //utility2 is the updated version of the script with better file writing
const recordingDirectory = path.join(__dirname, "sysAudioRecorder");

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

//implemented
export function fetchAllPlaylists() {
  try {
    // Lesson that I learnt. Just save the damn file in JSONified string instead of parsing it every damn time 😭
    // TO DO: Rework the python script to avoid this mess of transforming between two formats
    const fileData: string = fs.readFileSync(userFile, "utf-8");
    const playlist = fileData.split("\n");
    const fileDataJSON: Object[] = [];
    playlist.forEach((item) => {
      const MetaData = item.split("|sep|");
      if (MetaData.length === 0) {
        return;
      }
      const url = MetaData[1];
      const name = MetaData[0];
      fileDataJSON.push({ name: name, url: url });
    });
    return fileDataJSON;
  } catch (err) {
    console.log(err);
  }
}

//implemented
export function fetchSongs(playlist: string) {
  //Read text file within the folder, this will get you the data
  const playlistFolder = path.join(dataFolderPath, playlist);
  const playlistDataFile = path.join(playlistFolder, `downloaded_files.txt`);
  try {
    const fileData = fs.readFileSync(playlistDataFile, "utf-8");
    const fileDataJSON: Object[] = [];

    const songs: string[] = fileData.split("\n");

    songs.forEach((song) => {
      //ignore empty lines
      if (song.length === 0) return;

      const songPath = song;
      const songName = path.basename(song);
      fileDataJSON.push({ name: songName, path: songPath });
    });

    return fileDataJSON;
  } catch (err) {
    console.log(err);
  }
}

//impmlemented
export async function downloadPlaylist(
  url: string,
  name: string,
  win: BrowserWindow | null
) {
  if (url.length == 0 || name.length == 0) {
    console.log("Empty fields, stopping creation of creation of subprocess");
    return;
  }

  // Invoke yt-dlp python scripts
  // Also write to the userfile
  const dataToAdd = "\n" + name + "|sep|" + url;
  // Just a simple regex to replace the backward slash paths with the forward slashes, as it can cause errors in python due to \s
  // like characters being interpreted as special characters instead of simple strings
  // const dataFolder = dataFolderPath.replace(/\\/g, "/");
  const downloadScript = pythonDir.replace(/\\/g, "/");

  try {

    fs.readFileSync(userFile, 'utf8', (err:any, fileContent:string) => {
      if (err) {
          // Handle error reading the file
          return console.error(err);
      }

      if (!fileContent.includes(dataToAdd)) {
          fs.appendFileSync(userFile, dataToAdd, (err:any) => {
              if (err) {
                  console.error(err);
              } else {
                  console.log('Line written successfully!');
              }
          });
      } else {
          console.log('Line already exists!');
      }
  });
    // const data = await fs.appendFileSync(userFile, dataToAdd);

    //Python process to be called here
    console.log("calling process...");

    const pythonProcess = spawn("python", [downloadScript, name, url], {
      stdio: ["inherit", "inherit", "inherit"],
      encoding: "utf8",
    });

    console.log("calling script: ", downloadScript);

    pythonProcess.on("exit", (code: any, signal: any) => {
      console.log(
        `Python process exited with code ${code} and signal ${signal}`
      );
      win?.webContents.send("Downloaded");
    });

    pythonProcess.on("error", (err: any) => {
      console.error("Failed to start Python process:", err);
      console.log(win, win?.webContents);
      win?.webContents.send(`Failed`);
    });
    //return?
    
  } catch (err) {
    console.log(err);
  }
}

//new approach
export async function recogniseAudio(win:BrowserWindow|null) {

  const recordedAudioPath = path.join(recordingDirectory);
  //It was hell researching how to record system audio 😭
  const pathToRecorder = path.join(recordingDirectory, "Rec.exe");
  let pythonOutput = ""
  
  console.log("calling Rec.exe");
  
  const recorder = spawn(pathToRecorder, [recordingDirectory+"\\"], {
    stdio: ["pipe", "pipe", "pipe"],
    encoding: "utf8",
  });


  recorder.on("error", (err: any) => {
    console.error("Recorder encountered an error");
  })
  
  recorder.on("exit", (code: any, signal: any) => {
    console.log("Recorder Finished Recording")
    console.log(pythonDir)
    
    setTimeout(()=>{
      const audio_sample_path = path.join(recordedAudioPath, "myRecording.wav")
      const pythonRecogniseScript = path.join(__dirname, "python/acrCloud/acrTest.py")
      const pythonProcess = spawn("python", [pythonRecogniseScript, audio_sample_path], {
        stdio: ["pipe", "pipe", "pipe"],
        encoding: "utf8",
      });
      // win?.webContents.send("found-song", "Fetching Results")
      
      pythonProcess.on("error", (err: any) => {
        console.error("Recorder encountered an error");
      })

      pythonProcess.on("exit", (code:any, signal:any)=>{
        console.log("Finished without errors")
        console.log(pythonOutput)
        win?.webContents.send("found-song", pythonOutput.toString())
      })

      if(pythonProcess.stdout){
        pythonProcess.stdout.on('data', (data:any) => {
          // console.log(`stdout: ${data}`);
          // Append the data to the variable
          pythonOutput += data.toString('utf8').trim();
          // console.log(pythonOutput)
            
          console.log("Sending 'found-song' signal");
          
          
        });
      }
      

    }, 500)
  });
  
    
}

export function openBrowser(url:string){
  shell.openExternal(url)
}

//OLD APPROACH, I found a better solution using a wrapper over windows core audio API to capture direct speaker output. It's implemented above.
//---Mic Audio NOT SYSTEM AUDIO---
//audio stream variable
// let audioStream :any;
// const filePath = path.join(__dirname, 'recorded_audio.wav');
// const fileStream = fs.createWriteStream(filePath, { encoding: 'binary' });

// export function recordAudio(){

//   audioStream = record.record({
//     sampleRate:44100,
//     channels:1,
//     verbose:true,
//   }).stream()

//   audioStream.pipe(fileStream);

//   console.log('Recording started. Audio will be saved to:', filePath);}

// export function stopRecording(){
//    if(audioStream){
//     audioStream.unpipe(fileStream); //stop writing to the file
//     fileStream.end() //end of file stream
//     console.log("File saved to : ", filePath)
//    }
// }
