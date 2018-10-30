import React from 'react'
import { Text, StyleSheet, TouchableOpacity, View, AsyncStorage } from 'react-native'
import { Header } from 'react-native-elements'
import { SegmentedChoice } from "../components/SegmentedChoice";
import { styles } from "../constants/styles";
import styled from 'styled-components'


const Container = styled.View`
    height: 100%;
`

const BetsContainer = styled.View`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const BetButton = styled.TouchableOpacity`
    position: absolute;
    bottom: 5%;
    width: 90%;
    left: 5%;
    height: 75px;
    border-radius: 10px;
    background-color: rgb(41,139,255);
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
`

const ButtonText = styled.Text`
    font-size: 18px;
    text-align: center;
    color: white;
`

const BetChoiceContainer = styled.View `
    display: flex;
    flex-direction: column;
    height: 90%;
`

export default class BetPage extends React.Component {
    state = {
        overUnder: null,
        spread: null,
        moneyLine: null,
        bets: [],
        choices: []
    }

    async componentWillMount() {
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props
        const { odds, homeTeam, awayTeam, id } = params.game;
        const currentWeek = await AsyncStorage.getItem('currentWeek')
        const choices = [
            [
                {
                    title: `${awayTeam.name}`,
                    value: odds['moneyLineAway'] > 0 ? `+${odds['moneyLineAway']}` : odds['moneyLineAway'],
                    betType: "money_line"
                },
                {
                    title: `${homeTeam.name}`,
                    value: odds['moneyLineHome'] > 0 ? `+${odds['moneyLineHome']}` : odds['moneyLineHome'],
                    betType: "money_line"
                },
                "Money Line"
            ],
            [
                {
                    title: `Over`,
                    value: odds['over'],
                    betType: "over_under"
                },
                {
                    title: `Under`,
                    value: odds['under'],
                    betType: "over_under"
                },
                "Over / Under"
            ],
            [
                {
                    title: `${awayTeam.name}`,
                    value: odds['spreadAway'] > 0 ? `+${odds['spreadAway']}` : odds['spreadAway'],
                    betType: "spread"
                },
                {
                    title: `${homeTeam.name}`,
                    value: odds['spreadHome'] > 0 ? `+${odds['spreadHome']}` : odds['spreadHome'],
                    betType: "spread"
                },
                "Spread"
            ]
        ]
        this.setState({ bets: params.bets, choices, currentWeek })
    }

    placeBet = () => {
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props
        const { bets, choices, ...restOfState } = this.state
        choices.map(choice => {
            const selected = choice.filter(option => option.selected)[0];
            if (selected) {
                const {amount, betType, value} = selected
                bets.push({
                    amount,
                    game: params.game,
                    betType,
                    value: value
                })

            }
        })
        this.props.navigation.navigate("GameList", {contest: params.contest, bets})
    }

    activateBet = (betType) => {
        this.setState({[`${betType}Active`]: true})
    }

    render() {
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props
        const { bets, choices } = this.state
        // "odds": Object {
        //     "moneyLineAway": 427,
        //     "moneyLineHome": -499,
        //     "overUnderAway": 53,
        //     "overUnderHome": 53,
        //     "spreadAway": 11.8,
        //     "spreadHome": -11.8,
        // },
        
        return <Container>
            <Header
                outerContainerStyles={{ height: 90 }}
                backgroundColor={styles.primaryColor}
                leftComponent={<TouchableOpacity onPress={() => this.props.navigation.goBack()}><Text style={gameStyles.topbarText}>Back</Text></TouchableOpacity>}
                centerComponent={{
                    text: "Bets",
                    style: { color: '#fff', fontSize: 22 }
                }}
            />
            <BetsContainer>
                <BetChoiceContainer>
                    {choices.map((choice, idx) => <SegmentedChoice key={idx} choices={choice}></SegmentedChoice>)}
                </BetChoiceContainer>
            </BetsContainer>
            <BetButton onPress={this.placeBet}><ButtonText>Place Your Bets</ButtonText></BetButton>
        </Container>
    }
}

const gameStyles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: "#F7EBC8"
    },
    topbarText: {
        color: 'white',
        fontSize: 18
    },
})