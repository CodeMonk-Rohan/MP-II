import { useEffect, useState } from "react";
import "./CustomPlayer.css";
import {motion} from "framer-motion"
import { FaPlay, FaPause } from 'react-icons/fa';
import next from "../../assets/next-button.svg"
import prev from "../../assets/prev-button.svg"
import { song } from "../../App";
import qicon from "../../assets/music-alt.svg"


type customPlayer = {
  audioRef:React.RefObject<HTMLAudioElement>,
  currentPlaylist: song[]
}



export default function CustomPlayer({audioRef, currentPlaylist}:customPlayer) {
  
  //This only exists because of difficulty in manual refactor, too many similar words to run a simple refactor
  const audioElem = audioRef
  
  
  
  //Important variables needed to be kept in useState
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.43);
  const [index, setIndex] = useState(0)
  const [currentTrack, setCurrentTrack] = useState<song>(currentPlaylist[0])
  
  const [filteredSongs, setFilteredSongs] = useState(currentPlaylist)

  useEffect(()=>{
    console.log("Current track update was fired: new value = ", currentTrack.name);
    if(audioElem.current){
      // audioElem.current.src = currentTrack.path
      // audioElem.current.play()
    }
  }, [currentTrack])

  useEffect(()=>{
    console.log("Current index: ", index);
    
  }, [index])

  // Updating the currentTime to be consumed while rendering the seekbar
  // All first time initialisation steps performed here
  useEffect(() => {
    // setCurrentTrack(currentPlaylist[0])
    // console.log(currentTrack.path)
    //initialising the audio element with the constraints provided
    if(audioElem.current){
      audioElem.current.volume = volume;
      
      audioElem.current.src = currentPlaylist[index].path
      if(index !== 0){
        audioElem.current.play()
      }
    }

    function updateTime(){
      if(audioElem.current){
        setCurrentTime(audioElem.current.currentTime)
      }

    }

    function updateDuration(){
      if(audioElem.current){
        setDuration(audioElem.current.duration)
      }
    }

    function updateVolume(){
      if(audioElem.current){
        setVolume(audioElem.current.volume)
      }
    }

    //Adding relevant listeners to the object
    audioElem.current?.addEventListener('timeupdate', updateTime);
    audioElem.current?.addEventListener('loadedmetadata', updateDuration);
    audioElem.current?.addEventListener('volumechange', updateVolume);
    audioElem.current?.addEventListener('ended', handleNext);

    return () => {
      audioElem.current?.removeEventListener('timeupdate', updateTime);
      audioElem.current?.removeEventListener('loadedmetadata', updateDuration);
      audioElem.current?.removeEventListener('volumechange', updateVolume);
      audioElem.current?.removeEventListener('ended', handleNext);
    };

  }, [index]);

  //===========Working===============
  function handleMusicToggle() {
    if (audioElem.current){
      console.log(audioElem.current.src)
      
    }

    if (isPlaying) {
      audioElem.current?.pause();
    } else {
      audioElem.current?.play();
    }
    setPlaying(!isPlaying);
  }

  const handleSeek = (e:React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if(audioElem.current){
      audioElem.current.currentTime = seekTime;
    }
  };

  const handleVolume = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const seekTime = parseFloat(e.target.value);
    setVolume(seekTime);
    // console.log(audioElem.current?.volume)
    if(audioElem.current){
      audioElem.current.volume = volume
    }
  }

  function convertToHumanReadable(time:number){
    const minutes = Math.floor(time /60)
    const seconds = Math.floor(time % 60)
    //altering the string to add padded 00s if the value of minutes or seconds is less than 10
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  function handleNext() {
    console.log("NEXT FUNCTION CALLED");
    
    // index = currentPlaylist.indexOf(currentTrack)
    const length = currentPlaylist.length

    
    

    
    if(audioElem.current){
      let nextIndex = (index+1)%length
      setPlaying(true) //change the play button to reflect this change
      console.log(audioElem.current.src)

      // audioElem.current.src = currentPlaylist[nextIndex].path
      console.log(audioElem.current.src)
      
      setCurrentTrack(currentPlaylist[nextIndex])
      setIndex(index=>(index+1)%length)

    } 
    
    // console.log(nextIndex, "Next: ", currentPlaylist[nextIndex])
  }

  function handlePrev() {

    const index = currentPlaylist.indexOf(currentTrack)
    //Prevent illegal access outside of array
    if (index -1 < 0){
      return
    }
    const length = currentPlaylist.length

    const nextIndex = (index - 1) % length
    setIndex(index=>index-1)
    setCurrentTrack(currentPlaylist[nextIndex])
    if(audioElem.current){
      setPlaying(true) // changing the play button to reflect the change
      audioElem.current.src = currentPlaylist[nextIndex].path
      audioElem.current.play()
    }
    console.log(nextIndex)
  }


  function filterSongs(query:string){
    const filtered = currentPlaylist.filter((song)=>
      song.name.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredSongs(filtered)
  }

  function handleSearchInput(event: React.ChangeEvent<HTMLInputElement>){
    const query = event.target.value.toLowerCase()

    filterSongs(query)

  }

  function changeSong(song:song){
    const indexOfSelectedSong = currentPlaylist.indexOf(song)
    if(audioElem.current){
      setPlaying(true)
      // index = currentPlaylist.indexOf(song)
      setCurrentTrack(song)
      audioElem.current.src = song.path
      setIndex(oldIndex=>indexOfSelectedSong)
      audioElem.current.play()
    }
  }

  //=====To=be=implemented==========
  function handleRepeat() {}


  
  

  return (

    <div  className="custom-player">
    
          {/* PLAYER */}
        <div className="player-side">

          <p className="song-name">{currentTrack.name.slice(0, 74 )} ...</p>
   
          <div className="seekbar-div">
            <input  className="seekbar" onPointerDownCapture={(e) => e.stopPropagation()} type="range" min={0} max={duration} value={currentTime} onChange={handleSeek}></input>
          </div>

          <div className="timestamp">
            <div className="current-time"> {convertToHumanReadable(currentTime)}</div>
            <div className="duration-time"> {convertToHumanReadable(duration)}</div>
          </div>

          <div className="control">
                  <motion.button className="prev-next-buttons" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                    <img className="prev-butt" src={prev} onClick={handlePrev}></img>
                  </motion.button>

                  <div onPointerDownCapture={(e) => e.stopPropagation()} className="playpause-button"onClick={handleMusicToggle} style={{ cursor: 'pointer' }}>
                    <motion.div 
                      initial={false}
                      animate={{ scale: isPlaying ? 0.9 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isPlaying ? <FaPause size={32} /> : <FaPlay size={32} />}

                    </motion.div>
                  </div>

                    <motion.button className="prev-next-buttons" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                      <img className="next-butt" src={next} onClick={handleNext}></img>
                    </motion.button>

                      
                  
          </div>

          <motion.div onPointerDownCapture={(e) => e.stopPropagation()} className="vol-div" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
                      <input type="range" min={0.0} max={1.0} step="0.01" value={volume} onChange={handleVolume} className="vol-bar"></input>
          </motion.div>

        </div>
              
        {/* QUEUE */}
        <div className="queue-card">
            
            <div className="q-card-search">
              <input className="q-searchbox" type="text" onChange={handleSearchInput} placeholder={`Search Playlist`} onPointerDownCapture={(e) => e.stopPropagation()}></input>
              {/* <button className='q-search-icon'><FiSearch /></button> */}
            </div>

            <div className="main-queue-list">
              <div className="queue-list" onPointerDownCapture={(e) => e.stopPropagation()}>

                    {filteredSongs.map((song, index)=>(
                      // Currently I am making it so that when you click on the song block, you will start playing that song, let me know if you need to switch this to a specfic button on it instead
                      <button key={index} className="q-item-names"><img src={qicon} className="queue-icon"></img>    <div onClick={()=>changeSong(song)}> {(song.name.slice(0, -5)).slice(0, 30)}... </div></button>

                    ))}
                              
              </div>
            </div>

        </div>

    </div>


     
  );
}
