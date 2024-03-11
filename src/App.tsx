import { useState } from 'react'

import './App.css'
import Card from './components/Card/Card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='main-area'>
          <Card>yo</Card>
      </div>
    </>
  )
}

export default App
