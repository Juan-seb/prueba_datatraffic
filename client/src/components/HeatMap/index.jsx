import React, { useState, useEffect, memo, Suspense } from 'react'
import { createArrayOfSeasonsAndEpisodes, createArrayToGrid } from '@/helpers/array_helper_api'

const LazyCell = React.lazy(() => import('@/components/Cell'))

const HeatMap = ({ setEpisode, mode }) => {

  const [url, setUrl] = useState(import.meta.env.VITE_URL_EPISODES)
  const [seasonsInApi, setSeasonInApi] = useState([])
  const [episodesInApi, setEpisodesInApi] = useState([])
  const [idsGrid, setIdsGrid] = useState([])
  const [dataEpisodes, setDataEpisodes] = useState([])

  let flag = 0

  useEffect(() => {

    if (!url) return

    const getEpisodes = async () => {

      try {

        const data = await fetch(url)
        const res = data.ok ? data.json() : Promise.reject('Error getting episodes')
        const { info, results } = await res

        const { seasons, episodes } = createArrayOfSeasonsAndEpisodes(results)

        setSeasonInApi([...new Set([...seasonsInApi, ...seasons])])
        setEpisodesInApi([...new Set([...episodesInApi, ...episodes])])

        if (!info.next) {
          setIdsGrid(createArrayToGrid([...new Set([...seasonsInApi, ...seasons])], [...new Set([...episodesInApi, ...episodes])]))
        }

        setUrl(info.next)

        setDataEpisodes([...dataEpisodes, ...results])

      } catch (error) {
        console.log(error)
      }

    }

    getEpisodes()

  }, [url])

  if (url) {
    return (
      <section className="w-[90%] m-auto"> 
        Cargando el mapa de calor
      </section>
    )
  }

  return (
    <div className="w-[90%] overflow-x-scroll bk:overflow-x-hidden m-auto">
      <section className='w-[1150px] m-auto'>
        <div className='flex flex-wrap w-full py-2 px-5'>
          <div className='w-[8%]'>

          </div>
          <div className='flex flex-grow gap-4 w-[90%] mb-2'>
            {
              episodesInApi.map((episode, index) => (
                <div key={index} className='flex-grow py-1 px-2 bg-red-300 rounded-md'>
                  <h2 className='text-center'>
                    {episode}
                  </h2>
                </div>
              ))
            }
          </div>
          <div className='flex flex-col sticky left-2 w-[8%] gap-4'>
            {
              seasonsInApi.map((season, index) => (
                <div key={index} className='flex-grow mr-3 bg-red-300 rounded-md'>
                  <h2 className='text-center m-auto'>
                    {season}
                  </h2>
                </div>
              ))
            }
          </div>
          <section style={
            {
              gridTemplateColumns: `repeat(${episodesInApi.length.toString()}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${seasonsInApi.length.toString()}, minmax(0, 1fr))`
            }
          } className='grid gap-4 flex-grow'>

            {
              idsGrid.map((id, index) => {
                let episodeToColor = dataEpisodes[flag]

                if (episodeToColor?.episode === id) {
                  flag = flag + 1
                  return (
                    <Suspense key={id} fallback={<div>Loading...</div>}>
                      <LazyCell key={id} data={episodeToColor} mode={mode} idCell={episodeToColor.episode}/>
                    </Suspense>
                  )

                }

                return (
                  <div key={id} className='w-full h-full'>

                  </div>
                )


              })
            }
          </section>
        </div>
      </section>
    </div>
  )

}

export default HeatMap 