import {useState} from 'react'
import {HeatMap} from "@/components/HeatMap"

function App() {

  const [episode, setEpisode] = useState(null)

  return(
    <main className='w-screen'>
      <HeatMap setEpisode={setEpisode}/>
    </main>
  )
  
}

export default App
