import "./Icon.css";
import { motion } from "framer-motion";


type customFunc = {
  setter: Function;
  name:string;
  iconFile:string;
}

export default function Icon({setter, name, iconFile}:customFunc) {
  //Currently possesing dummy works
  // TO DO: Implement prop passing, Implement action | Done, but needs refining  

  return (
    <motion.div
      className="main-menu-icon-box"
      whileHover={{
        scale: 1.05,
      }}
      onClick={()=>{setter(name)}}
    >
      <motion.img
        className="main-menu-icon"
        src={iconFile}
        whileHover={{
          scale: 1.08,
          // rotate: 360,
        }}
        transition={{ duration: 5, loop: Infinity, ease: "circOut"}}
        draggable={false}
        // VERY IMPORTANT WILL SAVE YOU GODDAMN LIFE WHEN MAKING THE DAMN SEEKBAR; Stops the drag event from propagating
        onPointerDownCapture={(e) => e.stopPropagation()}
      ></motion.img>
    </motion.div>
  );
}
