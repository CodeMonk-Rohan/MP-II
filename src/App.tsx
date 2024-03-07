import { useEffect, useState } from 'react'
import './App.css'




function App() {
  const [count, setCount] = useState(0)
  const [change, Change] = useState("main-card")
  useEffect(()=>{

    window.ipcRenderer.on('testing', (event, data)=>{
      console.log(event)
      setCount(data)
      Change("animated")
    })
  }, [])


  async function beta() {
    setCount(await window.api.testFunc())
  }

  return (
    <>
      <div className={change}>if you're reading this you have no life</div>
       
    </>
  )
}

export default App
