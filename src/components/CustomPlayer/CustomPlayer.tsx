import { useEffect, useRef, useState } from "react";
import "./CustomPlayer.css";
import {motion} from "framer-motion"

export default function CustomPlayer() {
  const MUSIC_PATH_TEMP =
    "C:/Users/Admin/Desktop/MP-II/Database/Fly me to the moon 王OK.mp3";
  const audioElem = useRef<HTMLAudioElement>(null);

  //Important variables needed to be kept in useState
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.1);

  //Updating the currentTime to be consumed while rendering the seekbar
  useEffect(() => {


    if(audioElem.current){
      audioElem.current.volume = volume;
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
    return `${minutes}:${seconds}`
  }

  //=====To=be=implemented==========
  function handleRepeat() {}
  function handleNext() {}
  function handlePrev() {}
  


  return (
    <div className="custom-player"
    onPointerDownCapture={(e) => e.stopPropagation()}
    >
        
      This is the player
      <audio ref={audioElem} src={MUSIC_PATH_TEMP}></audio>
      <button onClick={handleMusicToggle}>Play/Pause</button>
      <button onClick={handleMusicToggle}>LOG</button>
      <motion.div onPointerDown={(e)=>e.stopPropagation()}>
      <input type="range" min={0} max={duration} value={currentTime} onChange={handleSeek}></input>
      </motion.div>
      <div>Duration: {convertToHumanReadable(duration)}</div>
      <div>Current time: {convertToHumanReadable(currentTime)}</div>
      <motion.div onPointerDown={(e)=>e.stopPropagation()}>
      <input type="range" min={0.0} max={1.0} step="0.01" value={volume} onChange={handleVolume}></input>
      </motion.div>
    </div>
  );
}
