import {
    fetchAllPlaylists,
    downloadPlaylist,
    fetchSongs,
} from "./util"

import { ipcMain } from "electron";

function exposeToFrontEnd(functions:Array<Function>){  
    functions.forEach(func => {
        ipcMain.handle(func.name, async (event, ...args)=>{
            try{
                return await func(...args)
            }catch(err){
                console.log("Error bc: ", err)
            }
        })
    });
}

export function setUpDirectoryManager(){
    const functions = [
        fetchAllPlaylists,
        downloadPlaylist,
        fetchSongs,
    ]
    
    exposeToFrontEnd(functions)
}