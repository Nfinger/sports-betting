const rp = require('request-promise');
const cheerio = require('cheerio');
const { request } = require('graphql-request')
const endpoint = 'https://api.graph.cool/simple/v1/cjmbxbmx136tq0126bdfvc6a3'

const getCurrentWeek =  `
{
    CurrentWeek(id: "cjmt4lkpx4j3j0183ajk6juiv") {
        currentWeek
    }
}`

const getTeamForGame = `
query($teamAbbreviation: String) {
    Team(abbreviation: $teamAbbreviation) {
      awayGames {
        id
        week
      }
      homeGames {
        id
        week
      }
    }
}`

const getPlayer = `
  query($name: String!) {
    allPlayers(filter: {name: $name}) {
      id
    }
  }
`

const playerMutation = `
mutation(
    $name: String!
    $position: String
    $image: String
    $stats: String
    $teamId: ID!
) {
  createPlayer(
    name: $name
    position: $position
    image: $image
    stats: $stats
    teamId: $teamId
  ) {
    id
  }
}
`
const playerUpdate = `
mutation(
    $playerId: ID!
    $name: String
    $position: String
    $image: String
    $stats: String
    $teamId: ID!
) {
  updatePlayer(
    id: $playerId
    name: $name
    position: $position
    image: $image
    stats: $stats
    teamId: $teamId
  ) {
    id
  }
}
`

const getTeam = `
  query($abbreviation: String) {
    Team(abbreviation: $abbreviation) {
      id
      homeGames {
        id
      }
      awayGames {
        id
      }
    }
  }
`

const gameUpdate = `
    mutation($gameId: ID!, $storyHeader: String, $storyBody: String) {
        updateGame(
            id: $gameId
            storyHeader: $storyHeader
            storyBody: $storyBody
        ) {
            id
        }
    }
`

const updateGameScore = `
    mutation($gameId: ID!, $score: String) {
        updateGame(
            id: $gameId
            score: $score
        ) {
            id
        }
    }
`

module.exports.scraper = async () => {
    console.log("Scraping")
    // Go to the NFL scoreboard
    const {CurrentWeek: {currentWeek}} = await request(endpoint, getCurrentWeek)
    const options = {
        uri: `http://www.espn.com/nfl/scoreboard`,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    rp(options)
    .then(($) => {
        const gameIds = []
        $('script').each(async (i, elem) => {
            if (elem.children && elem.children[0] && elem.children[0].data && elem.children[0].data.includes('window.espn.scoreboardData \t=')) {
                const scoreboardData = elem.children[0].data
                const scoreboardObj = scoreboardData.split('= ')[1].split(';window')[0]
                const scoreboardJSON = JSON.parse(scoreboardObj)
                const games = scoreboardJSON.events
                await Promise.all(games.map(async (game) => {
                    // Grab each game ID
                    const gameId = game.links[0].href.split('?')[1]
                    gameIds.push({gameId, game})
                    if (gameId.includes('&')) return
                    game.competitions[0].competitors.map(async (team) => {
                        const playerTeam = team.team.abbreviation.toLowerCase()
                        const {Team: {id}} = await request(endpoint, getTeam, {abbreviation: playerTeam})
                        const keyPlayers = team.leaders
                        keyPlayers.map(position => {
                            position.leaders.map(async (leader) => {
                                const { displayValue, athlete } = leader
                                if (!athlete.fullName) return
                                const player = {
                                    name: athlete.fullName,
                                    position: athlete.position && athlete.position.abbreviation || '',
                                    image: athlete.headshot,
                                    stats: displayValue,
                                    teamId: id
                                }
                                const found = await request(endpoint, getPlayer, {name: player.name})
                                let mutation;
                                if (found && found.allPlayers && found.allPlayers.length > 0) {
                                    mutation = playerUpdate
                                    player.playerId = found.allPlayers[0].id
                                } else mutation = playerMutation
                                await request(endpoint, mutation, player)
                            })
                        })
                    })
                }))
                await Promise.all(gameIds.map(async ({gameId, game}) => {
                    // Grab each game's preview
                    const options = {
                        uri: `http://www.espn.com/nfl/preview?${gameId}`,
                        transform: function (body) {
                            return cheerio.load(body);
                        }
                    };
                    
                    const $ = await rp(options)
                    const title = $('#article-feed .article .article-header h1').text()
                    const body = $(".article-body").children('p').text()
                    const foundTeam = await request(endpoint, getTeamForGame, {teamAbbreviation: game.competitions[0].competitors[0].team.abbreviation})
                    const team = foundTeam.Team
                    let currentWeekGame = team.homeGames.filter(game => game.week === currentWeek)[0]
                    if (!currentWeekGame) currentWeekGame = team.awayGames.filter(game => game.week === currentWeek)[0]
                    const gameStory = {
                        gameId: currentWeekGame.id,
                        storyHeader: title,
                        storyBody: body
                    }
                    await request(endpoint, gameUpdate, gameStory)
                }))
            }
        })
    })
    .catch((err) => {
        console.log(err);
    });
}


const scoreScraper = async () => {
    console.log("ScrapingScores")
    // Go to the NFL scoreboard
    const {CurrentWeek: {currentWeek}} = await request(endpoint, getCurrentWeek)
    const options = {
        uri: `http://www.espn.com/nfl/scoreboard`,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    rp(options)
    .then(($) => {
        const gameIds = []
        $('script').each(async (i, elem) => {
            if (elem.children && elem.children[0] && elem.children[0].data && elem.children[0].data.includes('window.espn.scoreboardData \t=')) {
                const scoreboardData = elem.children[0].data
                const scoreboardObj = scoreboardData.split('= ')[1].split(';window')[0]
                const scoreboardJSON = JSON.parse(scoreboardObj)
                const games = scoreboardJSON.events
                try {
                    await Promise.all(games.map(async (game) => {
                        let homeScore, awayScore;
                        game.competitions[0].competitors.map(competitor => {
                            if (competitor.homeAway === 'home') homeScore = competitor.score
                            else awayScore = competitor.score
                        })
                        const score = `${awayScore}-${homeScore}`
                        const foundTeam = await request(endpoint, getTeamForGame, {teamAbbreviation: game.competitions[0].competitors[0].team.abbreviation})
                        const team = foundTeam.Team
                        let currentWeekGame = team.homeGames.filter(game => game.week === currentWeek)[0]
                        if (!currentWeekGame) currentWeekGame = team.awayGames.filter(game => game.week === currentWeek)[0]
                        const gameStory = {
                            gameId: currentWeekGame.id,
                            score
                        }
                        await request(endpoint, updateGameScore, gameStory)
                    }))
                } catch (error) {
                    console.error(error)
                }
            }
        })
    })
}

scoreScraper() 