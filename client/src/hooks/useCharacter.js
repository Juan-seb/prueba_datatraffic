import { useEffect, useState } from 'react'
import useSWR from 'swr'

const fetcher = async (url) => {
  const res = await fetch(url)
  const json = await res.json()

  return json
}

const getIdCharacter = (urlCharacter) => {

  const urlSplit = urlCharacter.split('/')

  return urlSplit[urlSplit.length - 1]

}

const createColor = () => {
  let color = Math.trunc(Math.random() * 1000000)

  return color < 100000 ? `0${color}` : color
}

const useCharacter = (url) => {

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {

    const idCharacter = getIdCharacter(url)
    const characterInLocalStorage = localStorage.getItem(`character-${idCharacter}`)

    if(characterInLocalStorage){

      setData(JSON.parse(characterInLocalStorage))
      setError(false)
      setIsLoading(false)
      return
    
    }
    
    const getCharacter = async () => {
      
      const res = await fetch(url)
      const data = res.ok ? res.json() : Promise.reject('Error getting character')
      const json = await data
      
      const color = createColor()

      localStorage.setItem(`character-${idCharacter}`, JSON.stringify({
        ...json,
        color
      }))

      setData({
        ...json,
        color
      })
      setError(false)
      setIsLoading(false)

    }

    getCharacter()

  }, [url])

  return {
    data,
    error,
    isLoading
  }

}

export { useCharacter }