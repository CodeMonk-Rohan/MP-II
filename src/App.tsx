import { useEffect, useRef } from "react";
import "./App.css";

import MainScreen from "./components/MainScreen/MainScreen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export type song = {
  name: string;
  path: string;
};

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    console.log(audioRef.current);
  }, [audioRef]);
  return (
    <div>
      <MainScreen audioRef={audioRef}></MainScreen>

      <audio ref={audioRef}></audio>
      <ToastContainer
        position="bottom-center"
        hideProgressBar={true}
        autoClose={300}
        
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        stacked={true}
        draggable={true}
      />
    </div>
  );
}

export default App;
