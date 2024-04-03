import { useEffect, useState } from "react";
import "./CustomPlayer.css";
import {motion} from "framer-motion"
import { FaPlay, FaPause } from 'react-icons/fa';
import next from "../../assets/next-button.svg"
import prev from "../../assets/prev-button.svg"
import { song } from "../../App";
import { FiSearch } from 'react-icons/fi';


type customPlayer = {
  audioRef:React.RefObject<HTMLAudioElement>,
  currentPlaylist: song[]
}



export default function CustomPlayer({audioRef, currentPlaylist}:customPlayer) {
  
  //This only exists because of difficulty in manual refactor, toomany similar words to run a simple refactor
  const audioElem = audioRef
  
  
  //Important variables needed to be kept in useState
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.1);

  //Updating the currentTime to be consumed while rendering the seekbar
  useEffect(() => {

    //initialising the audio element with the constraints provided
    if(audioElem.current){
      audioElem.current.volume = volume;
      audioElem.current.src = currentPlaylist[0].path
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

    audioElem.current?.addEventListener('timeupdate', updateTime);
    audioElem.current?.addEventListener('loadedmetadata', updateDuration);
    audioElem.current?.addEventListener('volumechange', updateVolume);

    return () => {
      audioElem.current?.removeEventListener('timeupdate', updateTime);
      audioElem.current?.removeEventListener('loadedmetadata', updateDuration);
      audioElem.current?.removeEventListener('volumechange', updateVolume);
    };

  }, []);

  //===========Working===============
  function handleMusicToggle() {
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
    console.log(audioElem.current?.volume)
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

  //=====To=be=implemented==========
  function handleRepeat() {}
  function handleNext() {}
  function handlePrev() {}
  
  

  return (

    <motion.div className="custom-player" initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.8,
      delay: 0,
      ease: [0, 0.71, 0.2, 1.01]
    }}>
          
        <p onPointerDownCapture={(e) => e.stopPropagation()}>{currentPlaylist[0]?.name}</p>
        {/* <audio ref={audioElem} src={MUSIC_PATH_TEMP}></audio> */}
      
        <motion.div>
        <input  className="seekbar" onPointerDownCapture={(e) => e.stopPropagation()} type="range" min={0} max={duration} value={currentTime} onChange={handleSeek}></input>
        </motion.div>

        <div className="timestamp">
        <div className="current-time"> {convertToHumanReadable(currentTime)}</div>
        <div className="duration-time"> {convertToHumanReadable(duration)}</div>
        </div>

        <div className="control">
                <motion.button className="prev-next-buttons" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                  <img className="prev-butt" src={prev}></img>
                </motion.button>
                <div onPointerDownCapture={(e) => e.stopPropagation()} className="playpause-button"onClick={handleMusicToggle} style={{ cursor: 'pointer' }}>
                  <motion.div 
                    initial={false}
                    animate={{ scale: isPlaying ? 0.9 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isPlaying ? <FaPause size={32} /> : <FaPlay size={32} />}

                  </motion.div>

                  <div className="timestamp">
                  <div className="current-time"> {convertToHumanReadable(currentTime)}</div>
                  <div className="duration-time"> {convertToHumanReadable(duration)}</div>
                  </div>

                  <div className="control">

                      <motion.button className="prev-next-buttons" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                          <img className="prev-butt" src={prev}></img>
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
                          <img className="next-butt" src={next}></img>
                        </motion.button>
                        
                </div>

                    <motion.div onPointerDownCapture={(e) => e.stopPropagation()} className="vol-div" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
                    <input type="range" min={0.0} max={1.0} step="0.01" value={volume} onChange={handleVolume} className="vol-bar"></input>
                    </motion.div>
              </div>

              <motion.div className="queue-card" whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  
                  <div className="q-card-search">
                  <input className="q-searchbox" type="text" placeholder="Search" onPointerDownCapture={(e) => e.stopPropagation()}></input>
                   <button className='q-search-icon'><FiSearch /></button>
                  </div>

                  <div className="main-queue-list">
                    <ol className="queue-list" onPointerDownCapture={(e) => e.stopPropagation()}>
                                      <button className="q-item-names"><li >Hello world how we doing </li></button>
                                      <button className="q-item-names"><li >Hello </li></button>
                                      <button className="q-item-names"><li >Hello </li></button>
                                      <button className="q-item-names"><li >Hello </li></button>
                                      <button className="q-item-names"><li >Hello </li></button>
                                   
                    </ol>
                  </div>

              </motion.div>

            </motion.div>


    </>   
  );
}
