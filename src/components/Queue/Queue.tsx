import React, { useEffect, useState } from "react";

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
    
    
    

    return (
        <div>
            <div>
                <div>
                    <button onClick={recogniseAudio} >Start Recording</button>
                    {/* <button onClick={stopRecording} >Stop Recording</button> */}
                </div>
            </div>
            
        </div>
    );
}