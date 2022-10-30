import React, { useState, useEffect, Suspense } from 'react'
import SquareCell from '../SquareCell'

const LazySquareCell = React.lazy(() => import('@/components/SquareCell'))

const Cell = ({ data, setProof }) => {

  const handleClick = (e) => {
    setProof(data)
  }

  if (!data.characters) {
    return (
      <></>
    )
  }

  return (
    <div className='grid grid-cols-5 gap-[1px] bg-slate-200' onClick={handleClick}>
      {data.characters.map((character, index) => {

        return (
          <Suspense key={index} fallback={<div className='bg-slate-300 min-h-[5px]'></div>}>
            <LazySquareCell key={index} url={character} />
          </Suspense>
        )
      })}
    </div>
  )

}

export default Cell