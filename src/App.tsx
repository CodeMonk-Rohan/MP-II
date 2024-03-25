import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card/Card";
import Menu from "./components/Menu/Menu";
import ScreenWrapper from "./components/ScreenWrapper/ScreenWrapper";
import { AnimatePresence } from "framer-motion";
import CustomPlayer from "./components/CustomPlayer/CustomPlayer";




function App() {

  //Not going into complicated routing, as there's only a small set of screens (if you can call it that) to be had here
    
  const [active, setActive] = useState<string>("")
  
  function getActiveComponent(target: string){
    // if(target===active){
    //   return ""
    // }
    switch (target){
      case 'player':
        return <ScreenWrapper children={<CustomPlayer/>}/>

      case 'settings':
        return <ScreenWrapper children={<>Settings is not implemented</>}/>
    }
  }

  // // useEffect(()=>{
    

  // //   downloadPlaylist()
  // // })
  
  // async function downloadPlaylist() {
  //   try {
  //     await window.ipcRenderer.invoke("downloadPlaylist", "testPlaylist", "https://youtube.com/playlist?list=PLAtpKAUoxXic6XroxqWVp65Ie9aJCbILl&si=Thvd3fxlxbSgDl0Y");
  //     // setClicked(!clicked);
  //   } catch (err) {
  //     console.log("--------------------Between--------Dwnld-----------------------");
      
  //     console.log(err);
  //   }
  // }

  async function fetchAllPlaylists() {
    const data = await window.ipcRenderer.invoke("fetchAllPlaylists")    
    console.log(data);
    
  
  }
  async function fetchSongs(playlist:string) {
    const data = await window.ipcRenderer.invoke(fetchSongs.name, playlist)
    console.log(data)
  }
  return (
    <>
      <div className="main-area">
        <Card>
          <AnimatePresence>
          {getActiveComponent(active)}
          </AnimatePresence>
          <Menu setter={setActive}/>
          {/* <button onClick={()=>downloadPlaylist()}>DOWNLOAD</button> */}
          <button onClick={()=>{fetchAllPlaylists()}}>Fetch All Playlists</button>
          <button onClick={()=>{fetchSongs("Test")}}>Fetch All Songs</button>
        </Card>
        
      </div>
    </>
  );
}

export default App;
