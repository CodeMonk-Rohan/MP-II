import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card/Card";
import Menu from "./components/Menu/Menu";
import ScreenWrapper from "./components/ScreenWrapper/ScreenWrapper";
import { AnimatePresence } from "framer-motion";
import CustomPlayer from "./components/CustomPlayer/CustomPlayer";
import BrowsePlay, { playlist } from "./components/BrowsePlay/BrowsePlay";
import Queue from "./components//Queue/Queue";


export type song = {
  name:string,
  path:string
}

function App() {

  //Not going into complicated routing, as there's only a small set of screens (if you can call it that) to be had here
    
  const [active, setActive] = useState<string>("")
  const [playlistData, setPlaylistData] = useState<playlist[]>([])
  const [currentPlaylist, setCurrentPlaylist] = useState<song[]>([])

  useEffect(()=>{
    async function fetchAllPlaylists() {
      const data = await window.ipcRenderer.invoke("fetchAllPlaylists")    
      await setPlaylistData(data)
      await fetchSongs(data[0].name)
      console.log(currentPlaylist)
    }

    fetchAllPlaylists()

    async function fetchSongs(playlist:string) {
      const data = await window.ipcRenderer.invoke(fetchSongs.name, playlist)
      console.log(data)
      setCurrentPlaylist(data)
    }

  }, [])

  
  function getActiveComponent(target: string){
    // if(target===active){
    //   return ""
    // }
    switch (target){
      case 'Browse':
        return <ScreenWrapper children={<BrowsePlay data={playlistData} />}/>

      case 'Player':
        return <ScreenWrapper children={<CustomPlayer/>}/>

       case 'Queue':
        return <ScreenWrapper children={<Queue data={currentPlaylist}/>}/>
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

  
  
  return (
    <>
      <div className="main-area">
        <Card>
          <AnimatePresence>
          {getActiveComponent(active)}
          </AnimatePresence>
          <Menu setter={setActive}/>
          {/* <button onClick={()=>downloadPlaylist()}>DOWNLOAD</button> */}
          {/* <button onClick={()=>{fetchAllPlaylists()}}>Fetch All Playlists</button> */}
          {/* <button onClick={()=>{fetchSongs("Test")}}>Fetch All Songs</button> */}
        </Card>
        
      </div>
    </>
  );
}

export default App;
