import { useState } from 'react'
import HeatMap from "@/components/HeatMap"
import Header from '@/components/Header'

function App() {

  const [mode, setMode] = useState('cantidad')

  const handleClick = (modeButton) => {
    setMode(modeButton)
  }

  return (
    <main className='w-screen overflow-x-hidden mb-8'>
      <Header />
      <section className='w-[90%] m-auto mb-2 px-1'>
        Instrucciones:
        <ul className='list-disc list-inside'>
          <li>En el modo de cantidad de personajes el numero por cada cuadro significa la cantidad de personajes que aparecen en el episodio</li>
          <li>En color por cada personaje por cada episodio se desplegara una cuadricula que permite ver un color por cada personaje</li>
          <li>En ambos modos al hacer click sobre el episodio se desplegara una ventana modal con mayor información</li>
        </ul>
      </section>
      <section className='w-[90%] m-auto mb-2 px-1'>
        <h2 className='font-bold mb-2'>Cambiar el modo de vista del mapa de calor:</h2>
        <div className='flex mb-4'>
          <button className='px-4 py-3 bg-slate-400 rounded-lg mr-4 focus:ring focus:ring-red-300' onClick={()=>handleClick('cantidad')}>
            Cantidad de personajes
          </button>
          <button className='px-4 py-3 bg-slate-400 rounded-lg mr-4 focus:ring focus:ring-red-300' onClick={()=>handleClick('personaje')}>
            Color por cada personaje
          </button>
        </div>
        <h2 className='font-bold mb-2'>
          Mapa de calor (Haz clic en algun cuadro para ver los personajes a detalle):
        </h2>
        
      </section>
      {
        mode !== 'cantidad' && <p className='w-[90%] m-auto mb-2 px-1'>Espera unos minutos mientras se carga el mapa de calor</p>
      }
      <HeatMap mode={mode} />
    </main>
  )

}

export default App
