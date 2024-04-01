import "./BrowsePlay.css"
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import plus from "../../assets/plus-button.svg"

export default function BrowsePlay() {
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });

  return (
    <>
      <motion.ul className="add-ul" initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0,
            ease: [0, 0.71, 0.2, 1.01]}}ref={ref}>
              <motion.li className="add-li" onPointerDownCapture={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <button className="add-butt"><img className="add-button"src={plus}></img></button>
                  <div className="add-data">
                  <input className="txt-box" type="text" placeholder="Enter Name"></input>
                  <input className="txt-box" type="text" placeholder="Enter URL"></input>
                  </div>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}></motion.li>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}></motion.li>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}></motion.li>
              <motion.li whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}></motion.li>
      </motion.ul>
    </>
  );
}


