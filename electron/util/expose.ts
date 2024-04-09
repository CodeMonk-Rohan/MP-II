import {
    fetchAllPlaylists,
    downloadPlaylist,
    fetchSongs,
    recogniseAudio
} from "./util"

import { BrowserWindow, ipcMain } from "electron";

function exposeToFrontEnd(functions:Array<Function>, window: BrowserWindow | null){  
    functions.forEach(func => {

        

        ipcMain.handle(func.name, async (event, ...args)=>{
         
            

            try{
                //special case for download playlist, as it needs two way communication unlike the other functions which work fine with one way comms
                if(func == downloadPlaylist || func == recogniseAudio){
                    return func(...args, window);
                }
                // console.log("Set up main handles for: ",func.name)
                return await func(...args)
            }catch(err){
                console.log("Error bc: ", err)
            }
        })
    });
}

export function setUpDirectoryManager(win: BrowserWindow | null){
    const functions = [
        fetchAllPlaylists,
        downloadPlaylist,
        fetchSongs,
        recogniseAudio
    ]
    // console.log(functions)
    
    exposeToFrontEnd(functions, win=win)
}