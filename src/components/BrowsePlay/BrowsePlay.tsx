import "./BrowsePlay.css";
import '../SearchBar/SearchBar.css'
import { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import refresh from "../../assets/refresh-button.svg"
import itemicon from "../../assets/home-button.svg"
import plus from "../../assets/plus-button.svg";
import { song } from "../../App";
import { FiSearch } from "react-icons/fi";


import { toast } from "react-toastify";


type data = {
  data: playlist[];
  changeScreen: React.Dispatch<React.SetStateAction<string>>;
  changePlaylist: React.Dispatch<React.SetStateAction<song[]>>;
  setPlaylistData: React.Dispatch<React.SetStateAction<playlist[]>>
};

export type playlist = {
  name: string;
  url: string;
};

export default function BrowsePlay({ data, changeScreen, changePlaylist, setPlaylistData}: data) {
  const ref = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
  });
  
  const [filteredPlaylist, setFilteredPlaylist] = useState(data)
  const [downloading, setDownloading] = useState(false)

  //variable to prevent multiple toasts from being generated (main process sends a lot of signals, can't do anything about that)
  const [recievedSignal, setRecieved] = useState(false)
  useEffect(()=>{

    let count = 0
    function handleDownloaded(event:Electron.Event, arg:any){
      if(recievedSignal == false){
        
      

        console.log("Downloaded signal received:", event);
        setRecieved(true)
        console.log(`Recieved: ${recievedSignal}`);
        count = count + 1
        console.log(count);
        
        setDownloading(false);
        // toast("Playlist Updated");
      
        fetchAllPlaylists();
      }
    }

    window.ipcRenderer.on("Downloaded", handleDownloaded)
  })


  useEffect(()=>{
    //search functionality
    setFilteredPlaylist(data)


    //handle the signal sent by the main process when the download finishes
    
    
  }, [data])


  // This function is to be called when the python process sends a signal with a response code from the main process  
  async function fetchAllPlaylists() {
    const data = await window.ipcRenderer.invoke("fetchAllPlaylists") 
    //Read userdata file and load every playlist written into it.   
    await setPlaylistData(data)
    console.log("Playlists: ",data);

  }

  



  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const { scrollXProgress } = useScroll({ container: ref });
  // console.log(data)

  async function downloadPlaylist(URL: string, PlaylistName: string) {
    if(URL.length === 0 || PlaylistName.length === 0){
      toast.warn("Invalid Input")
      return
    }
    
    
    if(downloading == true){
      toast.warn("Busy")
      return
    }

    //add a form validation step here to save on accidental calls to youtube
    //---TODO---

    //Reset the name and url to be empty
    setFormData({name:"", url:""})

    //disabled the download button, and notify the user that the download request is underway
    setDownloading(true)

    //set the recieved signal to be false (This variable exists to prevent multiple toasts from being generated needlessly)
    setRecieved(false)
    toast(`Pulling Changes for \n${PlaylistName}`)

    try {
      const data = await window.ipcRenderer.invoke(
        "downloadPlaylist",
        PlaylistName,
        URL
      );
      console.log(data);
    } catch (err) {
      console.log(
        "--------------------Between--------Dwnld-----------------------"
      );
      console.log(err);
    }
  }




  async function fetchSongs(playlist:string) {
    const data = await window.ipcRenderer.invoke(fetchSongs.name, playlist)
    console.log(data)
    return data
  }

  async function setPlaylist(name:any) {
    
    const data = await fetchSongs(name)
    changePlaylist(data)
    changeScreen("Player")
  }

  function filterPlaylist(query:string){
    const filtered = data.filter((playlist)=>
      playlist.name.toLowerCase().includes(query)
    )
    setFilteredPlaylist(filtered)
  }

  function handleSearchInput(event: React.ChangeEvent<HTMLInputElement>){
    const query = event.target.value.toLowerCase()
    filterPlaylist(query)

  }

  return (
    <>
     <motion.div className="box" initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0,
              ease: [0, 0.71, 0.2, 1.01]}}ref={ref}>

          {/* Search Bar */}
          <div className="search-pill">
            <input className="browse-search" type="text" placeholder="Search" onChange={handleSearchInput} onPointerDownCapture={(e) => e.stopPropagation()}></input>
            <FiSearch className='search-icon'/>
            {/* REFRESH BUTTON */}
              <img className="refresh-global" src={refresh} onClick={fetchAllPlaylists}></img>
          </div>

        </motion.div>
        
    <div className="main-div">
       
        
        <motion.ul className="add-ul" initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0,
              ease: [0, 0.71, 0.2, 1.01]}}
              ref={ref}>
                {/* Download Playlist Card */}
                <motion.li className="add-li" onPointerDownCapture={(e) => e.stopPropagation()}>
                    <button className="add-butt" onClick={()=>{downloadPlaylist(formData.name, formData.url)}}><img className="add-button"src={plus}></img></button>
                    <div className="add-data">
                    <input className="txt-box" type="text" placeholder="Name" value={formData.name} onChange={handleInputChange} name="name"></input>
                    <input className="txt-box" type="text" placeholder="URL" value={formData.url} onChange={handleInputChange} name="url"></input>
                    </div>
                </motion.li>

                {/* User Playlist Cards */}
                {filteredPlaylist.map((item, index)=>(
                    <motion.li className="item-cards" key={index}> 
                      <div className="item-div">
                          <div >
                            <img className="item-icon" src={itemicon} onClick={()=>{setPlaylist(item.name)}} ></img>
                          </div>
                            {item.name}
                            <img className="refresh-icon" src={refresh}></img>
                      </div>
            

                    </motion.li>

                ))}

                
                
        </motion.ul>
        
      </div>             
    </>
  );
}
