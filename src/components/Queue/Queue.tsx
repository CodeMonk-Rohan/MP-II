import React, { useEffect, useState } from "react";

export default function Queue() {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [chunks, setChunks] = useState<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

    useEffect(()=>{
        console.log(recordedBlob);
        console.log(chunks)
    }, [recordedBlob, chunks])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (event) => {
                console.log("Something");
                
                setChunks((prevChunks) => [...prevChunks, event.data]);
            };
            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
            if (chunks.length > 0) {
                const recordedBlob = new Blob(chunks, { type: chunks[0].type });
                setRecordedBlob(recordedBlob);
            }
            setChunks([]);
        }
    };

    return (
        <div>
            <div>
                <div>
                    <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
                    <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
                </div>
            </div>
            {recordedBlob && (
                <audio controls>
                    <source src={URL.createObjectURL(recordedBlob)} type={recordedBlob.type} />
                </audio>
            )}
        </div>
    );
}