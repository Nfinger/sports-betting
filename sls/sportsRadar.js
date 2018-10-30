const axios = require("axios")
const { lastDayOfWeek, format } = require("date-fns")
const SPORTS_RADAR_KEY_NFL = "sprb5gwxt7chvxn9h7jpp9e4"
const SPORTS_RADAR_BASE = 'https://api.sportradar.us/nfl/official/trial/v5/en/'

const sendRequest = async (url, sport) => {
    try {
        let apiKey;
        switch (sport) {
            case "NFL":
                apiKey = SPORTS_RADAR_KEY_NFL     
                break;
            default:
                break;
        }
        const requestUrl = `${SPORTS_RADAR_BASE}${url}?api_key=${apiKey}`
        const { data } = await axios.get(requestUrl)
        return data
    } catch (error) {
        // console.log("ERROR: ", error.response.data)
    }
}

const getCurrentWeekGames = async (currentWeek) => {
    const scheduleEndpoint = `games/2018/reg/schedule.json`
    const { weeks } = await sendRequest(scheduleEndpoint, "NFL")
    const thisWeek = weeks.filter(week => week.title === currentWeek)[0]
    return thisWeek.games
}

const getNFLTeamStats = async (teamId) => {
    const statsEndpoint = `seasons/2018/REG/teams/${teamId}/statistics.json`
    const data = await sendRequest(statsEndpoint, "NFL")
    if (data) {
        return data.record
    }
    // let {
    //     games_played,
    //     touchdowns,
    //     rushing,
    //     receiving,
    //     punts,
    //     punt_returns,
    //     penalties,
    //     passing,
    //     kickoffs,
    //     kick_returns,
    //     interceptions,
    //     int_returns,
    //     fumbles,
    //     first_downs,
    //     field_goals,
    //     extra_points,
    //     efficiency,
    //     defense
    // } = opponents
}

module.exports = {
    getCurrentWeekGames,
    getNFLTeamStats
}
