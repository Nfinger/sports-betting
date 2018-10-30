const { request } = require("graphql-request");
const endpoint = "https://api.graph.cool/simple/v1/cjmbxbmx136tq0126bdfvc6a3";
// AKIAJVW5TWTUHLKXFUBA
// HauQIuGXrq+8+IVZ0y9rMzKzlEt5BPBoZPYTPGHQ
const getCurrentWeek = `
{
    CurrentWeek(id: "cjmt4lkpx4j3j0183ajk6juiv") {
        currentWeek
    }
}`;

const getWeeklyGames = `
    query($currentWeek: Int) {
        allGames(filter: {week: $currentWeek}) {
            id
            score
            odds {
                moneyLineHome
                moneyLineAway
                spreadHome
                spreadAway
                over
                under
            }
        }
    }
`;

const getWeeklyContest = `
    query($currentWeek: Int) {
        allDailyContests(filter: {week: $currentWeek}) {
            id
            entries {
                id
                bets {
                    amount
                    value
                    betType
                    id
                    game {
                        id
                        odds {
                            moneyLineHome
                            moneyLineAway
                            overPayout
                            underPayout
                            homePointSpreadPayout
                            awayPointSpreadPayout
                        }
                    }
                }
                owner {
                    id
                }
            }
        }
    }
`;

const handleOverUnder = (home, away, { over, under }) => {
  const pointTotal = home + away;
  return pointTotal > under;
};

const handleSpread = (home, away, { spreadHome }) => {
  const homePlusSpread = home + spreadHome;
  return homePlusSpread > away;
};

const handleMoneyLine = (home, away, { moneyLineAway, moneyLineHome }) => {
  return home > away;
};

const comuputeCurrentOdds = async games => {
  const retObj = {};
  await Promise.all(
    games.map(async ({ id, score, odds }) => {
      const splitScore = score.split("-");
      const awayScore = parseInt(splitScore[0]);
      const homeScore = parseInt(splitScore[1]);
      const isOver = handleOverUnder(homeScore, awayScore, odds);
      const homeBeatSpread = handleSpread(homeScore, awayScore, odds);
      const moneyLineHome = handleMoneyLine(homeScore, awayScore, odds);
      retObj[id] = {
        over: isOver,
        under: !isOver,
        spreadHome: homeBeatSpread,
        spreadAway: !homeBeatSpread,
        moneyLineHome,
        moneyLineAway: !moneyLineHome
      };
    })
  );
  return retObj;
};

const summation = (accumulator, currentValue) => accumulator + currentValue;

exports.default.calculate = async () => {
    console.log("Calculating")
  const {
    CurrentWeek: { currentWeek }
  } = await request(endpoint, getCurrentWeek);
  const { allDailyContests } = await request(endpoint, getWeeklyContest, {
    currentWeek
  });
  let { allGames } = await request(endpoint, getWeeklyGames, { currentWeek });
  allGames = allGames.map(game => {
    game.score = "20-27";
    return game;
  });
  const computedGames = await comuputeCurrentOdds(allGames);
  allDailyContests.map(contest => {
    const contestStandings = contest.entries
      .map(entry => {
        const winnings = entry.bets
          .map(
            ({
              value,
              amount,
              game: {
                id,
                odds
              }
            }) => {
              if (computedGames[id][value]) {
                let betOdds = value;
                switch (value) {
                  case "over":
                    betOdds = "overPayout";
                    break;
                  case "under":
                    betOdds = "underPayout"
                    break;
                  case "spreadHome":
                    betOdds = "homePointSpreadPayout"
                    break;
                  case "spreadAway":
                    betOdds = "awayPointSpreadPayout"
                    break;
                  default:
                    break;
                }
                return amount + amount / (Math.abs(odds[betOdds]) * 0.01);
              }
              return 0;
            }
          )
          .filter(val => val)
          .reduce(summation);
        entry.winnings = winnings;
        return entry;
      })
      .sort((a, b) => b.winnings - a.winnings);
    console.log(contestStandings);
  });
};

calculate();
