import { BrowserWindow, ipcMain } from "electron";
import { globalShortcut } from "electron";

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
