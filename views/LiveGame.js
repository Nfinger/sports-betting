import React, { Component } from 'react';
import styled from "styled-components";
import { Scoreboard } from "../components/Scoreboard";
import { TeamHeader } from "../components/TeamHeader"
import { Header, Button, Text } from "react-native-elements";
import { TimeAndLocation } from "../components/TimeAndLocation";
import { AtDivider } from "../components/AtDivider"
import { WeatherRow } from "../components/WeatherRow"
import { RankAndRecord } from "../components/RankAndRecord"
import { OddsContainer } from "../components/OddsContainer"
import { BetsContainer } from "../components/BetsContainer";
import { styles } from "../constants/styles";
import * as Animatable from 'react-native-animatable';
import Icon from "react-native-vector-icons/FontAwesome";
import { BetDrawerBody, BetDrawerHeaderText, AmountText, BetDrawerHeader, HeaderTextView, FlexRow, FlexRowCentered, FlexCol } from "../components/styled";
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
const HEIGHT = Dimensions.get('window').height;

const ScoreboardContainer = styled.View `
    display: flex;
    width: 100%;
    height: 100%;
`

const AtContainer = styled.View `
    position: absolute;
    top: 12%;
    left: 43%;
`

const StatHeaderText = styled.Text `
    font-size: 20px;
    font-weight: bold;
`

const AmountInput = styled.TextInput `
    width: 50%;
    height: 25px;
    border-radius: 5px;
    border-width: 1px;
    background-color: white;
    border-color: rgb(41, 139, 255);
`
const ContestHeaderText = styled.Text `
    color: black;
    font-size: 18px;
    text-align: left;
    padding-left: 2%;
`

const BetButton = styled.TouchableOpacity`
    height: 50px;
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
    color: black;
` 


const Input = styled.TextInput `
  color: black;
  width: 80%;
  height: 50px;
  border-bottom-width: 1px;
  border-color: black;
  border-style: solid;
`
const InputContainer = styled.View `
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content:center;
  margin: 5%;
`

export default class LiveGame extends Component {
    state = {
        team1: null,
        team2: null,
        betType: null,
        betValue: null,
        counterPart: null,
        selected: {},
        amount: 0,
        balance: 0,
        bets: []
    }

    componentWillMount() {
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props
        const placedBets = params.bets.filter(bet => bet.game.id === params.game.id)
        const otherBets = params.bets.filter(bet => bet.game.id !== params.game.id)
        this.props.navigation.setParams({bets: otherBets})
        const selected = {}
        placedBets.map(bet => selected[bet.betType] = true)
        this.setState({bets: placedBets, selected})
        this.calculateBalance()
    }

    onLoad = (stats) => {
        const { team1 } = this.state
        if (!team1) {
            this.setState({team1: stats})
        } else {
            this.setState({team2: stats})
            this.compareStats
        }
    }
    compareStats(team1, team2) {
        for (const category in team1) {
            for (const stat in team1[category]) {
                if (team1[category][stat] > team2[category]) team1[category][stat].greater = true
                else team2[category][stat].greater = true
            }
        }
    }

    calculateBalance = () => {
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props
        const { bets } = this.state
        let balance = 2500
        params.bets.concat(...bets).map(bet => {
            balance -= parseFloat(bet.amount)
        })
        this.setState({balance})
    }

    placeBet = (betType, betValue, counterPart) => {
        this.setState({betType, betValue, counterPart})
        this.showBets()
    }

    handleAmount = (amount) => this.setState({amount})

    submitAmount = () => {
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props
        const { bets, betType, betValue, amount, selected, counterPart } = this.state
        if (amount > 0) {
            bets.push({
                amount,
                game: params.game,
                betType,
                value: betValue
            })
            selected[betType] = true
            if (selected[counterPart]) {
                selected[counterPart] = false
                const idx = bets.findIndex(bet => bet.betType === counterPart)
                bets.splice(idx, 1)
            }
            this.calculateBalance(bets)
            this.setState({bets, selected, betType: null, betValue: null, amount: 0})
            this.closeDrawer()
        }
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
        const { selected, amount, balance, bets } = this.state
        return <ScoreboardContainer>
            <Header
                outerContainerStyles={{ height: 90 }}
                backgroundColor={styles.primaryColor}
                leftComponent={<TouchableOpacity onPress={() => this.props.navigation.navigate("GameList", {contest: params.contest, bets: params.bets.concat(...bets)})}><Text style={gameStyles.topbarText}>Back</Text></TouchableOpacity>}
                centerComponent={{
                    text: `${params.game.awayTeam.abbreviation} @ ${params.game.homeTeam.abbreviation}`,
                    style: { color: '#fff', fontSize: 22 }
                }}
                rightComponent={<FlexCol>
                    <Text style={gameStyles.topbarText}>Remaining Balance</Text>
                    <AmountText>${balance}</AmountText>
                </FlexCol>}
            />
            <ScrollView>
                <FlexRow>
                    <AtContainer>
                        <AtDivider />
                    </AtContainer>
                    <TeamHeader {...params.game.awayTeam} />
                    <TeamHeader {...params.game.homeTeam} right={true} />
                </FlexRow>
                <TimeAndLocation {...params.game} />
                {params.game.weather && <WeatherRow {...params.game.weather} />}
                <FlexRowCentered><StatHeaderText>Current Odds</StatHeaderText></FlexRowCentered>
                <OddsContainer {...params.game} />
                <FlexRowCentered><StatHeaderText>Place Bets</StatHeaderText></FlexRowCentered>
                <BetsContainer placeBet={this.placeBet} selected={selected}  {...params.game} />
                <FlexRowCentered><StatHeaderText>Key Statistics</StatHeaderText></FlexRowCentered>
                <FlexRow>
                    <RankAndRecord onLoad={this.onLoad} {...params.game.awayTeam} />
                    <RankAndRecord onLoad={this.onLoad} {...params.game.homeTeam} right={true} />
                </FlexRow>
            </ScrollView>
            <Animatable.View style={gameStyles.drawerContainer} ref={this.handleViewRef}>
                <BetDrawerHeader onPress={this.closeDrawer}>
                    <HeaderTextView>
                        <BetDrawerHeaderText>Cancel</BetDrawerHeaderText>
                    </HeaderTextView>
                </BetDrawerHeader>
                {params.contest && <BetDrawerBody>
                    <ContestHeaderText>How much are you willing to wager?</ContestHeaderText>
                    <InputContainer>
                        <Icon
                            name="user-o"
                            color="rgba(0, 0, 0, 1)"
                            size={25}
                            style={{position: "absolute", left: 10}}
                        />
                        <Input
                            onChangeText={this.handleAmount}
                            value={amount}
                            placeholder="Enter Bet"
                            keyboardType="decimal-pad"
                        />
                    </InputContainer>
                    <BetButton onPress={this.submitAmount}><ButtonText>Submit Amount</ButtonText></BetButton>
                </BetDrawerBody>}
                {/* {!params.contest && <BetDrawerBody>
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
                </BetDrawerBody>} */}
            </Animatable.View>
        </ScoreboardContainer>
    }
}

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