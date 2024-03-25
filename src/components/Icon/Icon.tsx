import "./Icon.css";
import { motion } from "framer-motion";
import settingsButton from "../../assets/settings-button.svg";


type customFunc = {
  setter: Function;
  name:string
}

export default function Icon({setter, name}:customFunc) {
  //Currently possesing dummy works
  // TO DO: Implement prop passing, Implement action

  return (
    <motion.div
      className="main-menu-icon-box"
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
      }}
      onClick={()=>{setter(name)}}
    >
      <motion.img
        className="main-menu-icon"
        src={settingsButton}
        whileHover={{
          scale: 1.3,
           
          rotate: 360,
        }}
        transition={{ duration: 5, loop: Infinity, ease: "circOut"}}
        draggable={false}
        // VERY IMPORTANT WILL SAVE YOU GODDAMN LIFE WHEN MAKING THE DAMN SEEKBAR; Stops the drag event from propagating
        onPointerDownCapture={(e) => e.stopPropagation()}
      ></motion.img>
    </motion.div>
  );
}
