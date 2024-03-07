import { BrowserWindow, globalShortcut } from "electron";

// Miscellaneous utlility functions, to keep from cluttering the main.ts file in electron.

export function setUpShortcut(window: BrowserWindow | null, debugOptions: boolean) {
    globalShortcut.register("Alt+M", () => {
    targetAction(window);
    //sending the information that a toggle has been requested
    window?.webContents.send("testing")
    //temporary measure, ideally this would toggle between hidden and maximised instead
    window?.maximize()
  });

  if (debugOptions){
    globalShortcut.register("Alt+D", () => {
        bringUpDebugger(window)
    })
  }
}

function targetAction(window: BrowserWindow | null) {
  window?.show()
}
function bringUpDebugger(window: BrowserWindow | null) {
    console.log("Debugger Summoned");
    window?.webContents.openDevTools({mode:"detach"});
}
