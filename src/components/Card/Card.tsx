import React, { useRef } from "react";
import "./Card.css";
import Draggable from "react-draggable";

type childrenProp = {
  children: React.ReactNode;
};

export default function Card({ children }: childrenProp) {

    const ref = useRef(null);


  function handleMouseEnter() {
    // console.log("Mouse is in");
    window.ipcRenderer.invoke("mouseEnter");
  }

  function handleMouseLeave() {
    // console.log("Mouse is out");
    window.ipcRenderer.invoke("mouseLeave");
  }

  return (
    <Draggable nodeRef={ref}
        bounds="parent"
        handle=".card"
        defaultPosition={{x: 0, y: 0}}
        
        
        scale={1}
        >
        
      <div
        ref={ref}
        className="card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </Draggable>
  );
}
