import React, { useEffect, useState } from "react";

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
    
    
    

    return (
        
    );
}