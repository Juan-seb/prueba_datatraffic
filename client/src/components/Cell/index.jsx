import { useCharacter } from '@/hooks/useCharacter'
import SquareCell from '../SquareCell'

const Cell = ({ data }) => {

  if (!data.characters) {
    return(
      <></>
    )
  }

  return (
    <div className='grid grid-cols-5 gap-[1px]'>
      {data.characters.map((character)=>(
        <SquareCell url={character} />
      ))}
    </div>
  )

}

export default Cell