import "./BrowsePlay.css";
import '../SearchBar/SearchBar.css'
import { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import refresh from "../../assets/refresh-button.svg"
import itemicon from "../../assets/home-button.svg"
import plus from "../../assets/plus-button.svg";
import { song } from "../../App";
import { FiSearch } from "react-icons/fi";


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
  

  useEffect(()=>{
    setFilteredPlaylist(data)
    
  }, [data])
  // TO DO:
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
    setFormData({name:"", url:""})
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
          <div>
            <input type="text" placeholder="Search" onChange={handleSearchInput} onPointerDownCapture={(e) => e.stopPropagation()}></input>
            <FiSearch className='search-icon'/>
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
                
                <motion.li className="add-li" onPointerDownCapture={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <button className="add-butt" onClick={()=>{downloadPlaylist(formData.name, formData.url)}}><img className="add-button"src={plus}></img></button>
                    <div className="add-data">
                    <input className="txt-box" type="text" placeholder="Name" value={formData.name} onChange={handleInputChange} name="name"></input>
                    <input className="txt-box" type="text" placeholder="URL" value={formData.url} onChange={handleInputChange} name="url"></input>
                    </div>
                </motion.li>

                {filteredPlaylist.map((item, index)=>(
                    <motion.li className="item-cards" key={index} whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}> 
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
