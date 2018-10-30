import React, { Component } from 'react';
import { graphql, Query } from "react-apollo";
import { HamburgerButton } from "../components/HamburgerButton";
import { GameTile } from "../components/GameTile";
import { SegmentedChoice } from "../components/SegmentedChoice";
import { Weather } from "../components/Weather";
import { StoryBox } from "../components/StoryBox"
import { TeamBanner } from "../components/Banner";
import { BetBox } from "../components/BetBox";
import { KeyPlayers } from "../components/KeyPlayers";
import { Header, Button, Text } from "react-native-elements";
import { styles } from "../constants/styles";
import { Loader } from "../components/Loading";
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components'
import { BetDrawerBody, BetDrawerHeader, BetDrawerHeaderText, AmountText, HeaderTextView } from "../components/styled";

import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    AsyncStorage
} from 'react-native';
import gql from 'graphql-tag';
import moment from 'moment'
const HEIGHT = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const DAILY_CONTESTS_QUERY = gql`
    query($currentWeek: Int) {
        allDailyContests(orderBy: fee_ASC, first: 4, filter: {week: $currentWeek}) {
            id
            name
            payout
            fee
            entries {
                id
            }
        }
    }
`

const GAME_QUERY = gql`
    query($id: ID!) {
        Game(id: $id) {
            id
            homeTeam {
                id
                city
                name
                abbreviation
                logo
                wins
                loses
                ties
                primaryColor
                secondaryColor
                players {
                    id
                    name
                    position
                    stats
                    image
                }
            }
            awayTeam {
                id
                city
                name
                abbreviation
                logo
                wins
                loses
                ties
                primaryColor
                secondaryColor
                players {
                    id
                    name
                    position
                    stats
                    image
                }
            }
            weather {
                id
                condition
                temperature
            }
            time
            odds {
                id
                moneyLineHome
                moneyLineAway
                over
                under
                spreadAway
                spreadHome
            }
            storyHeader
            storyBody
        }
    }
`


export const BetTile = styled.TouchableOpacity `
    margin: 2%;
    width: 95%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(255, 255, 255, 1);
`

const BetButton = styled.TouchableOpacity`
    height: 75px;
    width: 90%;
    border-radius: 10px;
    background-color: rgb(41,139,255);
    display: flex;
    align-items: center;
    justify-content: center;
`

const ButtonText = styled.Text`
    font-size: 18px;
    text-align: center;
    color: white;
` 
const EnterContestContainer = styled.View `
    height: 50%;
    width: 100%;
`

export const ContestHeaderText = styled.Text `
    color: black;
    font-size: 18px;
    text-align: left;
    padding-left: 2%;
`

const BetChoiceContainer = styled.View `
    display: flex;
    flex-direction: column;
    height: 80%;
`

const TeamText = styled.Text   `
    width: 90%;
    display: flex;
    flex-wrap: wrap;
    font-size:16;
    font-weight: bold;
    color: white;
    text-align: center;
`

class GamePage extends Component {
    state = {
        game: null,
        currentWeek: null,
        bets: [],
        choices: [],
        drawerOpen: false,
        first: true
    }

    async componentWillReceiveProps(newProps) {
        if (newProps.loading) { return; }
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props
        const {first} = this.state
        const { odds, homeTeam, awayTeam, id } = newProps.data.Game;
        const currentWeek = await AsyncStorage.getItem('currentWeek')
        let choices = [
            [
                {
                    title: `${awayTeam.name}`,
                    value: odds['moneyLineAway'] > 0 ? `+${odds['moneyLineAway']}` : odds['moneyLineAway'],
                    betType: "money_line",
                    betValue: "moneyLineAway"
                },
                {
                    title: `${homeTeam.name}`,
                    value: odds['moneyLineHome'] > 0 ? `+${odds['moneyLineHome']}` : odds['moneyLineHome'],
                    betType: "money_line",
                    betValue: "moneyLineHome"
                },
                "Money Line"
            ],
            [
                {
                    title: `Over`,
                    value: odds['over'],
                    betType: "over_under",
                    betValue: "over"
                },
                {
                    title: `Under`,
                    value: odds['under'],
                    betType: "over_under",
                    betValue: "under"
                },
                "Over / Under"
            ],
            [
                {
                    title: `${awayTeam.name}`,
                    value: odds['spreadAway'] > 0 ? `+${odds['spreadAway']}` : odds['spreadAway'],
                    betType: "spread",
                    betValue: "spreadAway"
                },
                {
                    title: `${homeTeam.name}`,
                    value: odds['spreadHome'] > 0 ? `+${odds['spreadHome']}` : odds['spreadHome'],
                    betType: "spread",
                    betValue: "spreadHome"
                },
                "Spread"
            ]
        ]
        if (params.edit) choices = await this.markBets(choices, params.bets)
        if (params.edit && this.view && first) this.showBets()
        this.setState({ 
            bets: params.bets,
            choices,
            currentWeek: parseInt(currentWeek),
            game: newProps.data.Game
        })
    }

    markBets = async (choices, bets) => {
        await Promise.all(bets.map(async (bet) => {
            choices = await Promise.all(choices.map(async (choice) => {
                const selected = choice.filter(option => {
                    return option.betType === bet.betType && 
                        (option.title === bet.game.awayTeam.name
                        || option.title === bet.game.homeTeam.name)
                })[0]
                if (selected) {
                    selected.selected = true
                    selected.amount = bet.amount
                }
                return choice
            }))
        }))
        return choices
    }

    placeBet = () => {
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props
        const { bets=[], choices, ...restOfState } = this.state
        choices.map(choice => {
            const selected = choice.filter(option => option.selected)[0];
            if (selected) {
                const {amount, betType, betValue} = selected
                bets.push({
                    amount,
                    game: params.game,
                    betType,
                    value: betValue
                })

            }
        })
        this.props.navigation.navigate("GameList", {contest: params.contest, bets})
    }

    handleViewRef = ref => this.view = ref;

    closeDrawer = () => {
        const {
            drawerOpen
        } = this.state
        this.view.transition({bottom: -250}, {bottom: -HEIGHT})
        this.setState({drawerOpen: !drawerOpen})
    }

    showBets = () => {
        this.view.transition({bottom: -HEIGHT}, {bottom: -250})
        this.setState({drawerOpen: true, first: false})
    }

    render() {
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props
        const { game, bets, choices, drawerOpen, first, currentWeek } = this.state
        if (!game) return <Loader />
        console.log(currentWeek)
        return (
            <View style={gameStyles.container}>
                <Header
                    outerContainerStyles={{ height: 90 }}
                    backgroundColor={styles.primaryColor}
                    leftComponent={<TouchableOpacity onPress={() => this.props.navigation.goBack()}><Text style={gameStyles.topbarText}>Back</Text></TouchableOpacity>}
                    centerComponent={{
                        text: `${params.game.awayTeam.abbreviation} @ ${params.game.homeTeam.abbreviation}`,
                        style: { color: '#fff', fontSize: 22 }
                    }}
                    rightComponent={<TouchableOpacity onPress={this.showBets}><Text style={gameStyles.topbarText}>View Bets</Text></TouchableOpacity>}
                />
                <View style={gameStyles.gameContainer}>
                    <Weather {...game.weather} />
                    {game.storyHeader && <View style={gameStyles.storyBox}>
                        <StoryBox header={game.storyHeader} body={game.storyBody} {...this.props} />
                    </View>}
                    <View style={gameStyles.timeHeader}>
                        <Text style={{ fontSize:18, fontWeight: "bold", color: 'white', textAlign: 'center'}}>
                            {moment(game.time).format('ddd. MMM. Do hh:mm a')}
                        </Text>
                    </View>
                    <View style={gameStyles.awayBanner}>
                        <View style={gameStyles.awayTeamInfo}>
                            <Image source={{uri: game.awayTeam.logo}} style={{height: 75, width: 75}}></Image>
                            <TeamText>{game.awayTeam.city} {game.awayTeam.name}</TeamText>
                            <KeyPlayers players={game.awayTeam.players} />
                        </View>
                        <TeamBanner
                            primaryColor={game.awayTeam.primaryColor}
                            secondaryColor={game.awayTeam.secondaryColor} />
                    </View>
                    <View style={gameStyles.homeBanner}>
                        <View style={gameStyles.homeTeamInfo}>
                            <Image source={{uri: game.homeTeam.logo}} style={{height: 75, width: 75}}></Image>
                            <TeamText>{game.homeTeam.city} {game.homeTeam.name}</TeamText>
                            <KeyPlayers players={game.homeTeam.players} />
                        </View>
                        <TeamBanner
                            primaryColor={game.homeTeam.primaryColor}
                            secondaryColor={game.homeTeam.secondaryColor} />
                    </View>
                    <View style={gameStyles.atSymbolContainer}><Text style={gameStyles.atSymbol}>@</Text></View>
                    <View style={gameStyles.oddsContainer}>
                        <BetBox homeTeam={game.homeTeam.name} awayTeam={game.awayTeam.name} odds={game.odds} />
                    </View>
                </View>
                <Animatable.View style={gameStyles.drawerContainer} ref={this.handleViewRef}>
                    <BetDrawerHeader onPress={this.closeDrawer}>
                        <HeaderTextView>
                            <BetDrawerHeaderText>Hide Bets</BetDrawerHeaderText>
                        </HeaderTextView>
                    </BetDrawerHeader>
                    <ScrollView>
                        {params.contest && <BetDrawerBody>
                            <BetChoiceContainer>
                                {choices.map((choice, idx) => <SegmentedChoice key={idx} choices={choice}></SegmentedChoice>)}
                            </BetChoiceContainer>
                            <BetButton onPress={this.placeBet}><ButtonText>Place Your Bets</ButtonText></BetButton>
                        </BetDrawerBody>}
                        {!params.contest && <BetDrawerBody>
                            <BetDrawerHeaderText>Please Enter A Contest To Place a Bet</BetDrawerHeaderText>
                            <Query
                                query={DAILY_CONTESTS_QUERY}
                                variables={{currentWeek}}
                            >
                                {({loading, error, data}) => {
                                    if (loading) return <Loader />
                                    if (error) return <Text>Error :(</Text>
                                    return <View>
                                        <EnterContestContainer>
                                            <ContestHeaderText>Daily Contests</ContestHeaderText>
                                            {data.allDailyContests.map((contest, idx) => {
                                                return <BetTile key={idx} onPress={() => {this.props.navigation.setParams({contest});this.setState({bets: []})}}>
                                                    <Text>{contest.name}</Text>
                                                    <Text>Entry Fee: <AmountText>${contest.fee}</AmountText></Text>
                                                    <Text>Prizes <AmountText>${contest.payout}</AmountText></Text>
                                                </BetTile>
                                            })}
                                        </EnterContestContainer>
                                        <EnterContestContainer>
                                            <ContestHeaderText>My Leagues</ContestHeaderText>
                                                <BetTile>
                                                    <Text>This Feature has not yet been implemented</Text>
                                                </BetTile>
                                        </EnterContestContainer>
                                    </View>
                                }}
                            </Query>
                        </BetDrawerBody>}
                    </ScrollView>
                </Animatable.View>
            </View>
        )
    }
}

export default graphql(GAME_QUERY, {
    options: ({id, navigation}) => {
      return ({
        variables: {
          id: navigation.state.params.game.id,
        },
        fetchPolicy: "network-only"
      });
    },
})(GamePage)


const gameStyles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: "#F7EBC8"
    },
    drawerContainer: {
        width: "100%",
        position: 'absolute',
        bottom: -HEIGHT,
        height: "100%",
        backgroundColor: "rgba(200,200,200, 0.85)",
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 20
    },
    topbarText: {
        color: 'white',
        fontSize: 18
    },
    oddsContainer: {
        position: 'absolute',
        bottom: "5%",
        left: '15%'
    },
    atSymbol: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center'
    },
    atSymbolContainer: {
        position:'absolute',
        top: "73%",
        left: "46%",
        width: 50,
        height: 50,
        backgroundColor: "rgb(210, 200,175)",
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },
    awayTeamInfo: {
        position: 'absolute',
        // left: "5%",
        top: "5%",
        zIndex: 4,
        width: "100%",
        display: 'flex',
        alignItems: 'center'
    },
    homeTeamInfo: {
        position: 'absolute',
        // left: "27%",
        top: "5%",
        zIndex: 4,
        width: "100%",
        display: 'flex',
        alignItems: 'center'
    },
    gameContainer: {
        height: "80%",
        width: "100%",
        padding: "3%",
        paddingBottom: "10%"
    },
    awayBanner: {
        position: 'absolute',
        left: 10,
        top: 125
    },
    homeBanner: {
        position: 'absolute',
        right: 10,
        top: 125
    },
    storyBox: {
        position: 'absolute',
        right: 10,
        top: 10
    },
    timeHeader: {
        position: "absolute",
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0, 0.85)',
        width: 145,
        height: 85,
        position: 'absolute',
        right: "33%",
        top: "15%",
        borderRadius: 15
    }
})