import { useState, useEffect, memo } from 'react'
import { createArrayOfSeasonsAndEpisodes, createArrayToGrid } from '@/helpers/array_helper_api'
import Cell from '@/components/Cell'

const Map = ({ setEpisode }) => {

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
      <main>
        Cargando el mapa de calor
      </main>
    )
  }

  const generateCols = () => `grid-cols-${episodesInApi.length.toString()}`
  const generateRows = () => `grid-rows-${seasonsInApi.length.toString()}`

  return (
    <main className='w-screen h-max'>
      <section className='flex flex-wrap w-full py-2 px-5'>
        <div className='w-[10%]'>

        </div>
        <div className='flex flex-grow w-[90%]'>
          {
            episodesInApi.map((episode, index) => (
              <div key={index} className='flex-grow'>
                <h2 className='text-center'>
                  {episode}
                </h2>
              </div>
            ))
          }
        </div>
        <div className='flex flex-col w-[10%] h-min'>
          {
            seasonsInApi.map((season, index) => (
              <div key={index} className='flex-grow h-[70px]'>
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
                  <Cell key={id} data={episodeToColor} />
                )

              }

              return (
                <div key={id} className='w-full h-full'>

                </div>
              )


            })
          }
        </section>
      </section>
    </main>
  )

}

export const HeatMap = memo(Map)