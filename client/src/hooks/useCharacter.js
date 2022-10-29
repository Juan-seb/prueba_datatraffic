import useSWR from 'swr'

const fetcher = async (url) => {
  const res = await fetch(url)
  const json = await res.json()
  
  return json
}

const useCharacter = (url) => {

  const { data, error } = useSWR(url, fetcher)

  return { 
    data, 
    error,
    isLoading: !error && !data  
  }

}

export { useCharacter }