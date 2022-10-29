import {useState} from 'react'
import {HeatMap} from "@/components/HeatMap"

function App() {

  const [episode, setEpisode] = useState(null)

  return(
    <HeatMap setEpisode={setEpisode}/>
  )
  
}

export default App
