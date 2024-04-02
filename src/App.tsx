import { createContext, useContext, useEffect, useRef, useState } from "react";
import "./App.css";

import MainScreen from "./components/MainScreen/MainScreen";


export type song = {
  name:string,
  path:string
}

function App() {


  const audioRef = useRef<HTMLAudioElement>(null)
  useEffect(()=>{
    console.log(audioRef.current);
    
  }, [audioRef])
  return <div>

    <MainScreen audioRef={audioRef} ></MainScreen>

    <audio ref={audioRef}></audio>
  </div>
  
}

export default App;
