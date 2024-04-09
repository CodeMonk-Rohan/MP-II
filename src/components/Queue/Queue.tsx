import React, { useEffect, useState } from "react";
import "./Queue.css"
import {motion} from "framer-motion"
import yticon from "../../assets/YouTube_full-color_icon_(2017).svg"
import recButton from "../../assets/home-button.svg"

export default function Queue() {
    
    async function recogniseAudio(){
        try{
            console.log("calling the main process....")
            const data = await window.ipcRenderer.invoke("recogniseAudio")
            console.log(data)
        }catch(err){
            console.log(err)
        }
    }
    
    
    
    // onClick={recogniseAudio}

    return (
        <motion.div className="rec-screen" 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0,
          ease: [0, 0.71, 0.2, 1.01]}} >
                <div className="rec-side">
                   <img src={recButton}className="rec-button"></img>
                    {/* <button onClick={stopRecording} >Stop Recording</button> */}
                </div>
                <div className="detail-side">
                    <div className="song-details">
                        <div className="info">
                            <p >Song Name Here</p>
                            <p>Artist Name</p>
                        </div>
                    </div>
                    <div className="link">
                        <img className="yt-icon" src={yticon}></img>
                        <p> Click Here</p>
                    </div>
                </div>
        </motion.div>
    );
}