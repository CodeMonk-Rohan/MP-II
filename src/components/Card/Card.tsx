
import "./Card.css";

import { motion } from "framer-motion";
export type childrenProp = {
  children: React.ReactNode;
};

export default function Card({ children }: childrenProp) {


  const draggingSettings = {
    top: -300,
    left: -520,
    right: 520,
    bottom: 300,
  }


  function handleMouseEnter() {
    // console.log("Mouse is in");
    window.ipcRenderer.invoke("mouseEnter");
  }

  function handleMouseLeave() {
    // console.log("Mouse is out");
    window.ipcRenderer.invoke("mouseLeave");
  }



  return (
    <motion.div className="main-area"
      drag
      dragConstraints={
        draggingSettings
      }
      whileDrag={{scale:0.9}}
      
    >
      <div

        className="card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </motion.div>
    
  );
}
