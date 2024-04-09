import React, { useEffect, useState } from "react";
import "./Queue.css"
import {motion} from "framer-motion"
import yticon from "../../assets/YouTube_full-color_icon_(2017).svg"
import recButton from "../../assets/home-button.svg"

export default function Queue() {
    

    const [songdata, setSongdata] = useState({})

    useEffect(()=>{

        async function handleFound(event:any, data:string){
            console.log("found - s o n g ")
            data = data.slice(2,-3)
            data = JSON.parse(data)
            console.log(data);
            // resulting data has the following keys
            // result_type : Currently have not made enough calls to know what kind of information this represents. No documentation mentions this either.
            // status : {
            //      "msg"    : Sucess | Failed  // Pretty much common sense
            //      "code"   : Integer value, 0 for most songs I queried.
            //      "version": Irrelvant to us
            //}
            //
        }

        window.ipcRenderer.on("found-song", handleFound )

        return ()=>{
            window.ipcRenderer.removeListener("found-song", handleFound)
        }
    }, [])

    useEffect(()=>{
        console.log(songdata); 
    }, [songdata])

    async function recogniseAudio(){
        try{
            console.log("calling the main process....")
            const data = await window.ipcRenderer.invoke("recogniseAudio")
            console.log("data recieved from the Main process: ", data)
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