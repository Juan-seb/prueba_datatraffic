import React, { useEffect } from 'react'
import Character from '@/components/Character'

const Chapter = ({ chapter, episode }) => {

  if (!chapter) {
    return <></>
  }

  return (
    <section className='flex flex-col py-4 px-6'>
      <h2 className='text-center text-lg font-bold my-2'>
        {episode} - {chapter.characters.length} Personajes
      </h2>
      {
        <div className='flex flex-wrap gap-4'>
          {
            chapter.characters?.map((characterUrl, index) => (
              <Character key={index} characterUrl={characterUrl} />
            ))
          }
        </div>
      }
    </section>
  )

}

export default Chapter