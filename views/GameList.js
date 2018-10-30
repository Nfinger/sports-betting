import React, { Component } from 'react';
import { graphql, Query } from "react-apollo";
import { request } from 'graphql-request'
import { lastDayOfWeek, addDays } from "date-fns";
import { HamburgerButton } from "../components/HamburgerButton";
import { GameTile } from "../components/GameTile";
import { Header, Button } from "react-native-elements";
import { styles } from "../constants/styles";
import * as Animatable from 'react-native-animatable';
import { Loader } from "../components/Loading";
import { BetDrawerBody, BetDrawerHeader, BetDrawerHeaderText, BetTile, AmountText, HeaderTextView, FlexRow } from "../components/styled";
import styled from "styled-components";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    Alert
} from 'react-native';
import gql from 'graphql-tag';

const TypeToReadable = {
    "money_line": "Money Line",
    "over_under": "Over/Under",
    "spread": "Spread"
}


const GAME_LIST_QUERY = gql`query($week: Int) {
    allGames(filter: {week:$week}, orderBy: time_DESC) {
        id
        time
        score
        gameClock
        quarter
        broadcast
        venue {
            id
            name
            city
            state
        }
        homeTeam {
            id
            name
            abbreviation
            logo
            city
            wins
            loses
            ties
        }
        awayTeam {
            id
            name
            abbreviation
            logo
            city
            wins
            loses
            ties
        }
        weather {
            id
            temperature
            condition
        }
        odds {
            id
            moneyLineAway
            moneyLineHome
            spreadHome
            spreadAway
            over
            under
        }
    }
}`

const CREATE_ENTRY_MUTATION = gql `
    mutation($ownerId: ID!, $dailyContestId: ID!) {
    createEntry(
        dailyContestId: $dailyContestId
        ownerId: $ownerId
    ) {
        id
    }
}`

const CREATE_BET = `
    mutation ($amount: Float!, $gameId: ID!, $betType: String, $value: String, $entryId: ID!) {
        createBet(amount: $amount, gameId: $gameId, betType: $betType, value: $value, entryId: $entryId) {
            id
        }
    }
`

const GameTileContainer = styled.TouchableOpacity `
    width: 165px;
    height: 100px;
    margin: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
`

class GameList extends Component {
    state = {
        drawerOpen: false,
        bets: [],
        currentWeek: null,
        balance: 2500,
        submitted: false
    }

    async componentWillMount() {
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props

        let { balance } = this.state

        const currentWeek = await AsyncStorage.getItem('currentWeek')
        const bets = params.bets || []

        bets.map(bet => {
            balance -= parseFloat(bet.amount)
        })
        this.setState({bets, balance, currentWeek: parseInt(currentWeek)})
    }

    handleViewRef = ref => this.view = ref;

    handleDrawer = () => {
        const {
            drawerOpen
        } = this.state
        if (drawerOpen) {
            this.view.transition({bottom: -5}, {bottom: -420})
        } else {
            this.view.transition({bottom: -420}, {bottom: -5})
        }
        this.setState({drawerOpen: !drawerOpen})
    }

    submitEntry = async () => {
        this.setState({submitted: true})
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props
        const {
            bets
        } = this.state
        const ownerId = await AsyncStorage.getItem('userId')
        const {data: {createEntry: {id}} } = await this.props.createEntryMutation({variables: {
            dailyContestId: params.contest.id,
            ownerId
        }})
        
        await Promise.all(bets.map(async bet => {
            let betVars = {
                amount: parseFloat(bet.amount),
                gameId: bet.game.id,
                betType: bet.betType,
                value: parseFloat(bet.value),
                entryId: id
            } 
            
            await request("https://api.graph.cool/simple/v1/cjmbxbmx136tq0126bdfvc6a3", CREATE_BET, betVars)
        }))
        this.props.navigation.navigate("UpcomingEntries")
    }

    setBalance = balance => this.setState({balance})

    render() {
        const  {
            drawerOpen,
            bets,
            currentWeek,
            balance,
            submitted
        } = this.state
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props

        if (!currentWeek || submitted) return <Loader />
        return (
            <View style={{paddingBottom: "5%", height: "100%"}}>
                <Header
                    outerContainerStyles={{ height: "11%" }}
                    backgroundColor={styles.primaryColor}
                    leftComponent={<HamburgerButton {...this.props} />}
                    centerComponent={<View style={{display: 'flex', width: "100%", paddingLeft: "25%", justifyContent: "center", alignContent: "center"}}><Text style={{ textAlign: 'center', width: "100%", color: '#fff', fontSize: 24 }}>Week {currentWeek} Games</Text></View>}
                    rightComponent={<TouchableOpacity disabled={bets.length === 0} onPress={params.entryId ? this.updateEntry : this.submitEntry} style={{width: "90%", display: "flex", alignContent: "center", justifyContent: 'center'}}><Text style={gameStyles.topbarText}>{params.entryId ? 'Update' : 'Submit'} Entry</Text></TouchableOpacity>}
                />
                <ScrollView style={gameStyles.container}>
                    <Query
                        query={GAME_LIST_QUERY}
                        variables={{
                            week: currentWeek
                        }}>
                        {({loading, error, data}) => {
                            if (loading) return <Loader />
                            if (error) return <Text>Error</Text>
                            return (
                                <View style={gameStyles.gamesContainer}>
                                    {data.allGames.map((game, idx) => {
                                        return (<GameTileContainer key={idx} onPress={() => this.props.navigation.navigate('LiveGame', {game, bets, balance, contest: params.contest, setBalance: this.setBalance})}>
                                            <GameTile {...game} />
                                        </GameTileContainer>)
                                    })}
                                </View>
                            )
                        }}
                    </Query>
                </ScrollView>
                <Animatable.View style={gameStyles.drawerContainer} ref={this.handleViewRef}>
                    <BetDrawerHeader onPress={this.handleDrawer}>
                        <HeaderTextView>
                            <FlexRow style={{justifyContent: 'space-around'}}>
                                <BetDrawerHeaderText style={{width: "33%"}}>Bets: {bets.length}</BetDrawerHeaderText>
                                <BetDrawerHeaderText style={{width: "33%"}}>{drawerOpen ? 'Close' : 'View Bets'}</BetDrawerHeaderText>
                                <BetDrawerHeaderText style={{width: "33%"}}>Remaining Balance: <AmountText>${balance}</AmountText></BetDrawerHeaderText>
                            </FlexRow>
                        </HeaderTextView>
                    </BetDrawerHeader>
                    <ScrollView>
                        <BetDrawerBody>
                            {bets.map((bet, idx) => {
                                return <BetTile key={idx}>
                                    <Text>{bet.game.awayTeam.abbreviation}@{bet.game.homeTeam.abbreviation}</Text>
                                    <Text>{TypeToReadable[bet.betType]}</Text>
                                    <AmountText>${bet.amount}</AmountText>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('LiveGame', {game: bet.game, bets, contest: params.contest})}>
                                        <Icon
                                        name="edit"
                                        color="rgba(41,139,255, 1)"
                                        size={25}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => Alert.alert(
                                    'Are you sure you want to delete this bet?',
                                    'This action cannot be undone',
                                    [
                                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                        {text: 'Yes', onPress: () => {
                                            bets.splice(idx, 1)
                                            let balance = 2500
                                            bets.map(bet => {
                                                balance -= parseFloat(bet.amount)
                                            })
                                            this.setState({bets, balance})
                                        }},
                                    ],
                                    { cancelable: true }
                                    )}>
                                        <Icon
                                        name="trash"
                                        color={styles.primaryColor}
                                        size={25}
                                        />
                                    </TouchableOpacity>
                                </BetTile>
                            })}
                        </BetDrawerBody>
                    </ScrollView>
                </Animatable.View>
            </View>
        )
    }
}

export default graphql(CREATE_ENTRY_MUTATION, {name: "createEntryMutation"})(GameList)

const gameStyles = StyleSheet.create({
    container: {
        margin: "2%",
        backgroundColor: '#fff',
        height: "100%",
    },
    gamesContainer: {
        display: "flex",
        justifyContent: 'space-around',
        flexWrap: "wrap",
        flexDirection: "row"
    },
    topbarText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center'
    },
    drawerContainer: {
        width: "100%",
        position: 'absolute',
        bottom: -420,
        height: 500,
        backgroundColor: "rgba(200,200,200, 0.85)",
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 20
    }
})