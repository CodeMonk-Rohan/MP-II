import {
    fetchPlaylist,
    copyPlaylist,
    createPlaylist,
    getAllPlaylists
} from "./core"

import { ipcMain } from "electron";

function exposeToFrontEnd(functions:Array<Function>){  
    functions.forEach(func => {
        ipcMain.on(func.name, (event, ...args)=>{
            func(...args)
        })
    });
}

export function setUpDirectoryManager(){
    const functions = [
        fetchPlaylist,
        copyPlaylist,
        createPlaylist,
        getAllPlaylists
    ]
    
    exposeToFrontEnd(functions)
}