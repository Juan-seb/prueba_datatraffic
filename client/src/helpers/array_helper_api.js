
const createArrayOfSeasonsAndEpisodes = (results) => {

  const seasons = []
  const episodes = []

  results.forEach(result => {
    const season = result.episode.substring(0, 3)
    const episode = result.episode.substring(3, 6)

    if (!seasons.find(seasonInArray => seasonInArray === season)) {
      seasons.push(season)
    }

    if (!episodes.find(episodeInArray => episodeInArray === episode)) {
      episodes.push(episode)
    }

  })

  return { seasons, episodes }

}

const createArrayToGrid = (seasonArray, episodesArray) => {

  const arrayGridId = []

  seasonArray.forEach(season => {
    episodesArray.forEach(episode => {
      arrayGridId.push(`${season}${episode}`)
    })
  })

  return arrayGridId

}

export {
  createArrayOfSeasonsAndEpisodes,
  createArrayToGrid
}