import { useEffect, useState } from 'react'
import { useCharacter } from '@/hooks/useCharacter'

const SquareCell = ({ url }) => {

  const { data, error, isLoading } = useCharacter(url)
  const [color, setColor] = useState(null)

  useEffect(() => {

    if (!data) return
    
    const character = JSON.parse(localStorage.getItem(`character-${data.id}`))  
    setColor(character.color)

  }, [data])

  return (
    <div style={{
      backgroundColor: `#${color}`
    }} className='min-h-[5px]'>

    </div>
  )

}

export default SquareCell