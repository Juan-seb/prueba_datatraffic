import { useState, useEffect } from 'react'
import { useCharacter } from '@/hooks/useCharacter'

const Character = ({ characterUrl }) => {

  const { data, error, isLoading } = useCharacter(characterUrl)

  if (!data) {
    return <></>
  }

  return (
    <article className='flex flex-grow rounded-md border min-w-[300px] w-[45%] p-2'>
      <img src={data.image} alt={data.name} className='w-[200px] h-[200px]' />

      <div className='flex flex-col px-2'>
        <div>
          <p className='inline font-bold'>Nombre: </p>
          <p className='inline'>{data.name}</p>
        </div>
        <div>
          <p className='inline font-bold'>Status: </p>
          <p className='inline'>{data.status}</p>
        </div>
        <div>
          <p className='inline font-bold'>Genero: </p>
          <p className='inline'>{data.gender}</p>
        </div>
        <div>
          <p className='inline font-bold'>Especie: </p>
          <p className='inline'>{data.species}</p>
        </div>
        <p className='font-bold'>Color en el mapa de calor:</p>
        <div style={{backgroundColor: `#${data.color}`}} className='w-[40px] h-[40px]'>

        </div>
      </div>
    </article>
  )

}

export default Character
