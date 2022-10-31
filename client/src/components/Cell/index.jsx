import React, { Suspense, useEffect, useState } from 'react'
import { useModal } from '@/hooks/useModal'
import Modal from '@/components/Modal'
import Chapter from '@/components/Chapter'

const LazySquareCell = React.lazy(() => import('@/components/SquareCell'))

const Cell = ({ data, mode, idCell }) => {

  const { open, openModal, closeModal } = useModal()
  const [color, setColor] = useState(null)

  useEffect(() => {

    if (!(mode === 'cantidad')) return

    const colorCell = localStorage.getItem(`color-${data.characters.length}`)
    const color = createColor()
    
    if (colorCell) {
      setColor(colorCell)
      return
    }

    localStorage.setItem(`color-${data.characters.length}`, color)

    setColor(color)

  }, [])

  const handleClick = (e) => {
    openModal()
  }

  const createColor = () => {
    let color = Math.trunc(Math.random() * 1000000)

    return color < 100000 ? `0${color}` : `${color}`
  }

  if (!data.characters) {
    return (
      <></>
    )
  }

  if (mode === 'cantidad') {

    return (
      <div style={{ backgroundColor: `#${color}`}} 
        className='flex w-[78px] h-[78px] justify-center items-center rounded-md cursor-pointer' 
        onClick={handleClick}
      >
        <p className='text-xl font-bold'>
          {data.characters.length}
        </p>
        {
        open &&
        <Modal closeModal={closeModal}>
          <Chapter chapter={data} episode={data.episode} />
        </Modal>
      }
      </div>
    )
  }

  return (
    <div className='grid grid-cols-5 gap-[1px] bg-slate-200 rounded-md cursor-pointer' onClick={handleClick}>
      {data.characters.map((character, index) => {

        return (
          <Suspense key={index} fallback={<div className='bg-slate-300 min-h-[5px]'></div>}>
            <LazySquareCell key={index} url={character} />
          </Suspense>
        )
      })}
      {
        open &&
        <Modal closeModal={closeModal}>
          <Chapter chapter={data} episode={data.episode} />
        </Modal>
      }
    </div>
  )

}

export default Cell