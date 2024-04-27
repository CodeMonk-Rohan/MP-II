import React, { useEffect, useState } from "react";
import "./Queue.css"
import {motion} from "framer-motion"
import yticon from "../../assets/YouTube_full-color_icon_(2017).svg"
import recButton from "../../assets/home-button.svg"

export default function Queue() {
    

    const [songdata, setSongdata] = useState<any>({})
    const [songName, setName] = useState("Wanna find what's playing right now?")
    const [artistName, setArtist] = useState("Click on the Music Icon to record and find out!")
    const [ytLink, setYtLink] = useState("")
    useEffect(()=>{
        console.log(songName);
        
    }, [songName])
    useEffect(()=>{

        async function handleFound(event:any, data:any){
            console.log("found potential match")
            data = data.slice(2,-3)
            console.log(data)
            // data = decodeURIComponent(data)
            // data = data.replace(/\\/g, '/');
            // data = Buffer.from(data, 'utf-8').toString()
            data = decodeURI(data)
            
            try{
                data = JSON.parse(data)
            }catch(err){
                //Treating parsing failure as the same as not finding a song for now
                setName("Could not find the song")
                setArtist("Try again?")
                setYtLink("")
                console.log(err)
            }
            

            
            if(data.status){
                if(data.status.msg !== "Success"){
                    setName("Could not find the song")
                    setArtist("Try again?")
                    setYtLink("")
                }
            }
            if(data.metadata){
                if(data.status.msg === "Success"){
                    setName(data.metadata.music[0].title)
                    setArtist("By "+data.metadata.music[0].artists[0].name)

                    if(data.metadata.music[0].external_metadata){
                        if(data.metadata.music[0].external_metadata.youtube){
                            setYtLink(`https://www.youtube.com/watch?v=${data.metadata.music[0].external_metadata.youtube.vid}`)
                        }else{
                            //Handle if theres no youtube link found
                            setYtLink(`https://www.youtube.com/results?search_query=${data.metadata.music[0].title}`)
                        }
                    }else{
                        //This is the situation where no external yt_links were found
                    }   
                }else{
                    // Request failed, could not identify
                    setName("Could not identify the song")
                    setArtist("Click on the button to try again")
                    setYtLink("")
                }
                
            
            }

            console.log(data);
            // resulting data has the following keys
            // result_type : Currently have not made enough calls to know what kind of information this represents. No documentation mentions this either.
            // status : {
            //      "msg"    : Sucess | Failed  // Pretty much common sense
            //      "code"   : Integer value, 0 for most songs I queried.
            //      "version": Irrelvant to us
            //  }
            // metadata.music[0].title
            // metadata.music[0].artists[0].name
            //
        }

        window.ipcRenderer.on("found-song", handleFound)

        return ()=>{
            window.ipcRenderer.removeListener("found-song", handleFound)
        }
    }, [])


    function openBrowser(url:string){
        window.ipcRenderer.invoke(openBrowser.name, url)
    }

    useEffect(()=>{
        console.log(songdata); 
    }, [songdata])

    async function recogniseAudio(){
        setName("Recording...")
        setTimeout(()=>{
            setArtist("This can take a while...")
        }, 7000)

        try{
            console.log("calling the main process....")
            const data = await window.ipcRenderer.invoke("recogniseAudio")
            console.log("data recieved from the Main process: ", data)
        }catch(err){
            console.log(err)
            setName("There was an error while detecting.")
            setArtist("Click on the button to try again")
            setYtLink("")
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
                   <img src={recButton} className="rec-button" onClick={recogniseAudio}></img>
                    {/* <button onClick={stopRecording} >Stop Recording</button> */}
                </div>
                <div className="detail-side">
                    <div className="song-details">
                        <div className="info">
                            <p>{songName}</p>
                            <p>{artistName}</p>
                        </div>
                    </div>
                    {ytLink === "" ? <></> : <div className="link" onClick={()=>openBrowser(ytLink)}>
                        <img className="yt-icon" src={yticon}></img>
                        <div>{songName}</div>
                    </div>}
                </div>
        </motion.div>

    );
}