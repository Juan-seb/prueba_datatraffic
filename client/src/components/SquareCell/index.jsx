import { useEffect, useState } from 'react'
import { useCharacter } from '@/hooks/useCharacter'

const SquareCell = ({ url }) => {

  const { data, error, isLoading } = useCharacter(url)
  const [color, setColor] = useState(null)

  useEffect(() => {

    if (!data) return
    console.log(data)
    const colorCharacter = localStorage.getItem(`character-color-${data.id}`)
    let color

    if (!colorCharacter) {

      color = Math.trunc(Math.random() * 1000000)
      localStorage.setItem(`character-color-${data.id}`, color < 100000 ? `0${color}` : color)

      setColor(color)
      return
    }

    setColor(colorCharacter)

  }, [data])

  if(isLoading){
    return(
      <div className='min-h-[5px] bg-slate-400'>
  
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: `#${color}`
    }} className='min-h-[5px]'>

    </div>
  )

}

export default SquareCell