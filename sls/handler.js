'use strict';
const axios = require('axios')
const geocoder = require('geocoder');
const { request } = require('graphql-request')
const { getCurrentWeekGames, getNFLTeamStats } = require('./sportsRadar')
const { 
  updateOrCreateDefense,
  updateOrCreateEfficiency,
  updateOrCreateFieldGoals,
  updateOrCreateFirstDowns,
  updateOrCreateFumbles,
  updateOrCreateInterceptionReturns,
  updateOrCreateInterceptions,
  updateOrCreateKickoffs,
  updateOrCreateKickReturns,
  updateOrCreatePassing,
  updateOrCreatePenalties,
  updateOrCreatePuntReturns,
  updateOrCreatePunts,
  updateOrCreateReceiving,
  updateOrCreateRushing,
  updateOrCreateTouchdowns
} = require('./statsMutations') 
const { lastDayOfWeek, addHours, parse } = require('date-fns')
const endpoint = 'https://api.graph.cool/simple/v1/cjmbxbmx136tq0126bdfvc6a3'

const getTeam = `
  query($abbreviation: String) {
    Team(abbreviation: $abbreviation) {
      id
    }
  }
`
const weatherMutation = `
mutation(
  $id: ID!
  $gameId: ID!
  $condition: String,
  $temperature: String
) {
  updateOrCreateWeather(
    create: {
      gameId: $gameId
      condition: $condition
      temperature: $temperature
    }
    update: {
      id: $id
      condition: $condition
      temperature: $temperature

    }
  ) {
    id
  }
}
`

const checkGameQuery = `
  query($gameKey: String) {
    allGames(filter: {gameKey: $gameKey}) {
      id
    }
  }
`

const checkOddsQuery = `
  query($gameKey: String) {
    allOddses(filter: {gameKey: $gameKey}) {
      id
    }
  }
`

const checkWeatherQuery = `
  query($gameId: ID!) {
    allWeathers(filter: {game: {id: $gameId}}) {
      id
    }
  }
`

const checkVenueQuery = `
  query CheckVenue($name: String!) {
    Venue(name: $name) {
      id
    }
  }
`

const createVenueMutation = `
  mutation(
    $name: String!,
    $city: String,
    $state: String,
    $country: String,
    $zip: String,
    $address: String!,
    $surface: String!,
    $roof_type: String!,
  ) {
    createVenue(
        name: $name,
        city: $city,
        state: $state,
        country: $country,
        zip: $zip,
        address: $address,
        surface: $surface,
        roofType: $roof_type,
    ) {
      id
    }
  }
`

const gameMutation = `
mutation(
  $id: ID!
  $homeTeamId: ID!,
  $awayTeamId: ID!,
  $weatherId: ID,
  $time: DateTime,
  $gameKey: String,
  $oddsId: ID!,
  $venueId: ID!,
  $week: Int!,
  $broadcast: String
) {
  updateOrCreateGame(
    create: {
      homeTeamId: $homeTeamId
      awayTeamId: $awayTeamId 
      weatherId: $weatherId
      time: $time
      gameKey: $gameKey
      oddsId: $oddsId
      week: $week
      broadcast: $broadcast
      venueId: $venueId
    },
    update: {
      id: $id
      homeTeamId: $homeTeamId
      awayTeamId: $awayTeamId 
      weatherId: $weatherId
      time: $time
      gameKey: $gameKey
      oddsId: $oddsId
      week: $week
      broadcast: $broadcast
      venueId: $venueId
    }
  ) {
    id
  }
}
`
const oddsMutation = `
mutation(
  $id: ID!
  $moneyLineHome: Float,
  $moneyLineAway: Float,
  $spreadHome: Float,
  $spreadAway: Float,
  $overPayout: Float,
  $underPayout: Float,
  $homePointSpreadPayout: Float,
  $awayPointSpreadPayout: Float,
  $over: Float,
  $under: Float,
  $gameKey: String
  $gameId: ID
) {
  updateOrCreateOdds(
    create: {
      moneyLineHome: $moneyLineHome,
      moneyLineAway: $moneyLineAway,
      spreadHome: $spreadHome,
      spreadAway: $spreadAway,
      overPayout: $overPayout,
      underPayout: $underPayout,
      homePointSpreadPayout: $homePointSpreadPayout,
      awayPointSpreadPayout: $awayPointSpreadPayout,
      over: $over,
      under: $under,
      gameKey: $gameKey
      gameId: $gameId
    },
    update: {
      id: $id
      moneyLineHome: $moneyLineHome,
      moneyLineAway: $moneyLineAway,
      spreadHome: $spreadHome,
      spreadAway: $spreadAway,
      overPayout: $overPayout,
      underPayout: $underPayout,
      homePointSpreadPayout: $homePointSpreadPayout,
      awayPointSpreadPayout: $awayPointSpreadPayout,
      over: $over,
      under: $under,
      gameKey: $gameKey
      gameId: $gameId
    }
  ) {
    id
  }
}
`

const articleMutation = `
mutation(
	$author: String,
  $title: String!,
  $description: String,
  $url: String,
  $urlToImage: String,
  $publishedAt: DateTime  
) {
  createArticle(
    author: $author,
    title: $title,
    description: $description,
    url: $url,
    urlToImage: $urlToImage,
    publishedAt: $publishedAt
  ) {
    id
  }
}
`
const dailyContestMutation = `
mutation( 
  $name: String!
  $payout: Float
  $fee: Float
  $startTime: DateTime
  $endTime: DateTime  
) {
  createDailyContest(
    name: $name
    payout: $payout
    fee: $fee
    startTime: $startTime
    endTime: $endTime
  ) {
    id
  }
}
`

const currentWeekMutation = `
mutation($id: ID!, $currentWeek: Int!) {
  updateCurrentWeek(
    id: $id,
    currentWeek: $currentWeek
  ) {
    currentWeek
  }
}
`

const createStatsMutation = `
  mutation($teamId: ID!) {
    createStats(teamId: $teamId) {
      id
    }
  }
`

const getCurrentWeek = `
  {
    CurrentWeek(id: "cjmt4lkpx4j3j0183ajk6juiv") {
      currentWeek
    }
  }
`
const currentWeekId = "cjmt4lkpx4j3j0183ajk6juiv"

const gameBuilder = async (event, context, callback) => {
  console.log("BUILDING GAMES")
  // Get the rest of the game info
  const {data: {currentWeek}} = await axios.get(`https://www.fantasyfootballnerd.com/service/schedule/json/g942xwuun3ha/`)
  // Fetch the schedule for current week of the NFL season
  const currentWeekGames = await getCurrentWeekGames(currentWeek)
  await request(endpoint, currentWeekMutation, {id: currentWeekId, currentWeek: parseInt(currentWeek)})
  // // Get betting odds info
  axios.create({
    headers: {"Ocp-Apim-Subscription-Key":"5219ad1f617c4869b4042cd836523b7f"}
  }).get(`https://api.fantasydata.net/v3/nfl/odds/JSON/GameOddsByWeek/2018/${currentWeek}`)
  .then(async ({data}) => {
    // console.log(data)
    await Promise.all(data.map(async (game) => {
      const awayFromOdds = game.AwayTeamName
      const homeFromOdds  = game.HomeTeamName
      const odds = game.PregameOdds[0] || {}
      const gameInfo = currentWeekGames.filter(game => {
        if (game.home.alias === "JAC") game.home.alias = "JAX"
        return game.home.alias === homeFromOdds.toUpperCase()
      })[0]
      // Build game
      const gameKey = gameInfo.sr_id
      const {allOddses} = await request(endpoint, checkOddsQuery, { gameKey })
      const {allGames} = await request(endpoint, checkGameQuery, { gameKey })

      // Get Teams
      const homeTeam = await request(endpoint, getTeam, {abbreviation: homeFromOdds})
      const awayTeam = await request(endpoint, getTeam, {abbreviation: awayFromOdds})
      // Light Rain Temp: 70 F, Humidity: 98%, Wind: South 3 mph
      // Build weather
      let weatherId
      if (gameInfo.weather) {
        const {allWeathers} = await request(endpoint, checkWeatherQuery, { gameId: allGames[0] && allGames[0].id || "" })
        const splitWeather = gameInfo.weather.split(" Temp: ")
        const weatherVars = {
          id: allWeathers[0] && allWeathers[0].id || "",
          gameId: allGames[0] && allGames[0].id || "",
          temperature: splitWeather[1],
          condition: splitWeather[0]
        }
        const {updateOrCreateWeather} = await request(endpoint, weatherMutation, weatherVars)
        weatherId = updateOrCreateWeather.id
      }
      
      // Build odds for game
      const oddsVars = {
        id: allOddses[0] && allOddses[0].id || "",
        moneyLineHome: odds.HomeMoneyLine,
        moneyLineAway: odds.AwayMoneyLine,
        spreadHome: odds.HomePointSpread,
        spreadAway: odds.AwayPointSpread,
        homePointSpreadPayout: odds.HomePointSpreadPayout,
        awayPointSpreadPayout: odds.AwayPointSpreadPayout,
        overPayout: odds.OverPayout,
        underPayout: odds.UnderPayout,
        over: odds.OverUnder,
        under: odds.OverUnder,
        gameKey,
        gameId: allGames[0] ? allGames[0].id : null
      }
      const {updateOrCreateOdds} = await request(endpoint, oddsMutation, oddsVars)
      const oddsId = updateOrCreateOdds.id
      // Check for game by gameKey
      let venueId;
      const { Venue } = await request(endpoint, checkVenueQuery, {name: gameInfo.venue.name})
      if (!Venue) {
        const {
          name,
          city,
          state,
          country,
          zip,
          address,
          surface,
          roof_type,
        } = gameInfo.venue
        const { createVenue } = await request(endpoint, createVenueMutation, {
          name,
          city,
          state,
          country,
          zip,
          address,
          surface,
          roof_type,
        })
        console.log(`created new venue ${name}, ${city}`)
        venueId = createVenue.id
      } else venueId = Venue.id
      // If we dont have a game then continue
      const gameVars = {
        id: allGames[0] && allGames[0].id || "",
        homeTeamId: homeTeam.Team.id,
        awayTeamId: awayTeam.Team.id,
        time: parse(gameInfo.scheduled),
        weatherId,
        gameKey,
        venueId,
        oddsId,
        broadcast: gameInfo.broadcast && gameInfo.broadcast.network || "",
        week: parseInt(currentWeek)
      }
      await request(endpoint, gameMutation, gameVars)
    }))
  })
  .catch(error => {
    console.log(error)
  })
  
  return JSON.stringify({"message": "Success!"})
};

// 5017b1e90844479e8ce26d0dc6440d29
module.exports.articles = async (event, context, callback) => {
  console.log("Getting Articles")
  const res = await axios.get('https://newsapi.org/v2/top-headlines?sources=nfl-news&apiKey=5017b1e90844479e8ce26d0dc6440d29')
  res.data.articles.map(async (article) => {
    const {
      author,
      title,
      description,
      url,
      urlToImage,
      publishedAt,
    } = article
    const res = await request(endpoint, articleMutation, {
      author,
      title,
      description,
      url,
      urlToImage,
      publishedAt: new Date(publishedAt),
    })
    return res
  })
  return res.data
}


module.exports.contests = async (event, context, callback) => {
  console.log("Building contests")
  const multiples = [3, 5, 10, 20]
  const basePayout = 1000
  const { CurrentWeek } = await request(endpoint, getCurrentWeek)
  return multiples.map(async(multiple) => {
    // Sunday Only
    const res = await request(endpoint, dailyContestMutation, {
      name: `$${multiple} Sunday Contest`,
      payout: multiple * basePayout,
      fee: multiple,
      week: parseInt(CurrentWeek.currentWeek),
      startTime: addHours(lastDayOfWeek(new Date(), {weekStartsOn: 1}), 13),
      endTime: addHours(lastDayOfWeek(new Date(), {weekStartsOn: 1}), 24),
    })
    return res
  })
}

const snakeToCamel = (str) => str.replace(/(\_\w)/g, function(m){return m[1].toUpperCase();})

const statBuilder = async (event, context, callback) => {
  const { allTeams } = await request(endpoint, `
    query {
      allTeams {
        id
        radarId
        stats {
          id
          touchdowns {
            id
          }
          rushing {
            id
          }
          receiving {
            id
          }
          punts {
            id
          }
          puntReturns {
            id
          }
          penalties {
            id
          }
          passing {
            id
          }
          kickoffs {
            id
          }
          kickReturns {
            id
          }
          interceptions {
            id
          }
          interceptionReturns {
            id
          }
          fumbles {
            id
          }
          firstDowns {
            id
          }
          fieldGoals {
            id
          }
          efficiency {
            id
          }
          defense {
            id
          }
        }
      }
    }
  `)
  allTeams.map(async (team) => {
    if (!team.radarId || (team.stats && team.stats.defense)) return;
    if (!team.stats || !team.stats.id) {
      const { createStats } = await request(endpoint, createStatsMutation, {teamId: team.id})
      team.stats.id = createStats.id
    }
    const record = await getNFLTeamStats(team.radarId)
    for (const key in record) {
      if (typeof(record[key]) !== "object") {
        delete record[key]
        continue
      }
      record[key].statsId = team.stats.id
      for (let stat in record[key]) {
        if (stat.includes("_")) {
          let newKey = snakeToCamel(stat)
          record[key][newKey] = record[key][stat]
          delete record[key][stat]
        }
      }
      switch(key) {
        case 'games_played':
          // await request(endpoint, , record[key])
          break
        case 'touchdowns':
          if (team.stats[key]) record[key].id = team.stats[key].id
          else record[key].id = ""
          await request(endpoint, updateOrCreateTouchdowns, record[key])
          break
        case 'rushing':
          if (team.stats[key]) record[key].id = team.stats[key].id
          else record[key].id = ""
          await request(endpoint, updateOrCreateRushing, record[key])
          break
        case 'receiving':
          if (team.stats[key]) record[key].id = team.stats[key].id
          else record[key].id = ""
          await request(endpoint, updateOrCreateReceiving, record[key])
          break
        case 'punts':
          if (team.stats[key]) record[key].id = team.stats[key].id
          else record[key].id = ""
          await request(endpoint, updateOrCreatePunts, record[key])
          break
        case 'punt_returns':
          if (team.stats[snakeToCamel(key)]) record[key].id = team.stats[snakeToCamel(key)].id
          else record[key].id = ""
          await request(endpoint, updateOrCreatePuntReturns, record[key])
          break
        case 'penalties':
          if (team.stats[key]) record[key].id = team.stats[key].id
          else record[key].id = ""
          await request(endpoint, updateOrCreatePenalties, record[key])
          break
        case 'passing':
          if (team.stats[key]) record[key].id = team.stats[key].id
          else record[key].id = ""
          await request(endpoint, updateOrCreatePassing, record[key])
          break
        case 'kickoffs':
          if (team.stats[key]) record[key].id = team.stats[key].id
          else record[key].id = ""
          await request(endpoint, updateOrCreateKickoffs, record[key])
          break
        case 'kick_returns':
          if (team.stats[snakeToCamel(key)]) record[key].id = team.stats[snakeToCamel(key)].id
          else record[key].id = ""
          await request(endpoint, updateOrCreateKickReturns, record[key])
          break
        case 'interceptions':
          if (team.stats[key]) record[key].id = team.stats[key].id
          else record[key].id = ""
          await request(endpoint, updateOrCreateInterceptions, record[key])
          break
        case 'int_returns':
          if (team.stats[snakeToCamel(key)]) record[key].id = team.stats[snakeToCamel(key)].id
          else record[key].id = ""
          await request(endpoint, updateOrCreateInterceptionReturns, record[key])
          break
        case 'fumbles':
          if (team.stats[key]) record[key].id = team.stats[key].id
          else record[key].id = ""
          await request(endpoint, updateOrCreateFumbles, record[key])
          break
        case 'first_downs':
          if (team.stats[snakeToCamel(key)]) record[key].id = team.stats[snakeToCamel(key)].id
          else record[key].id = ""
          await request(endpoint, updateOrCreateFirstDowns, record[key])
          break
        case 'field_goals':
          if (team.stats[snakeToCamel(key)]) record[key].id = team.stats[snakeToCamel(key)].id
          else record[key].id = ""
          await request(endpoint, updateOrCreateFieldGoals, record[key])
          break
        case 'efficiency':
          for (let stat in record[key]) {
            if (record[key][stat].pct) record[key][stat] = record[key][stat].pct
          }
          if (team.stats[key]) record[key].id = team.stats[key].id
          else record[key].id = ""
          await request(endpoint, updateOrCreateEfficiency, record[key])
          break
        case 'defense':
          if (team.stats[key]) record[key].id = team.stats[key].id
          else record[key].id = ""
          await request(endpoint, updateOrCreateDefense, record[key])
          break
      }
    }
  })
}
gameBuilder()