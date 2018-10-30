import * as React from "react";
import { Svg } from 'expo'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/EvilIcons';

const Bets = styled.View `
    height: 300px;
    width: 100%;
    background: rgba(136, 85, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: space-around;
`

const FlexCol = styled.View `
    display: flex;
    height: 100%;
    flex: 1;
    align-content: center;
    justify-content: center;
    flex-direction: column;
`

const FlexColSmall = styled.View `
    display: flex;
    height: 100%;
    flex: 1;
    align-content: center;
    justify-content: center;
    flex-direction: column;
`

const FlexRow = styled.View `
    display: flex;
    height: 30px;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`

const FlexRowSmall = styled.View `
    display: flex;
    height: 2px;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`

const TeamTextSmall = styled.Text `
    font-size: 18px;
    font-weight: bold;
    text-align: center;
`

const OddsTextSmall = styled.Text `
    color: rgb(91, 175, 237);
    font-size: 14px;
    font-weight: bold;
    text-align: center;
`

export class BetsContainer extends React.Component {

    // Set default properties
    static defaultProps = {
    homeTeam: {},
    awayTeam: {},
    odds: {},
    }

    calculatePayout = (wager, odds) => {
        return waget * odds
    }

    render() {
        const {
            homeTeam,
            awayTeam,
            odds,
            placeBet,
            selected
        } = this.props

        return <Bets>
            <FlexRow>
                <FlexCol><Icon name="check" size={35} color={selected['moneyLineAway'] ? 'green': 'grey'} style={{textAlign: "center"}} onPress={() => placeBet("moneyLineAway", odds.moneyLineAway, "moneyLineHome")} /></FlexCol>
                <FlexCol>
                    <TeamTextSmall>{awayTeam.abbreviation}</TeamTextSmall>
                    <OddsTextSmall>{odds.moneyLineAway > 0 ? "+" : ""}{odds.moneyLineAway}</OddsTextSmall>
                </FlexCol>
                <FlexCol></FlexCol>
                <FlexCol>
                    <TeamTextSmall>{homeTeam.abbreviation}</TeamTextSmall>
                    <OddsTextSmall>{odds.moneyLineHome > 0 ? "+" : ""}{odds.moneyLineHome}</OddsTextSmall>
                </FlexCol>
                <FlexCol><Icon name="check" size={35} color={selected['moneyLineHome'] ? 'green': 'grey'} style={{textAlign: "center"}} onPress={() => placeBet("moneyLineHome", odds.moneyLineHome, "moneyLineAway")} /></FlexCol>
            </FlexRow>
            <FlexRowSmall>
                <FlexColSmall></FlexColSmall>
                <FlexColSmall>
                    <TeamTextSmall>Amount Bet:</TeamTextSmall>
                    <Svg xmlns="http://www.w3.org/2000/svg" width="100" height="1"><Svg.Path d="M 0 0 L 100 0" fill="transparent" stroke="#AAA"></Svg.Path></Svg>
                </FlexColSmall>
                <FlexColSmall></FlexColSmall>
                <FlexColSmall>
                    <TeamTextSmall>Potential Payout: {this.calculatePayout()}</TeamTextSmall>
                    <Svg xmlns="http://www.w3.org/2000/svg" width="100" height="1"><Svg.Path d="M 0 0 L 100 0" fill="transparent" stroke="#AAA"></Svg.Path></Svg>
                </FlexColSmall>
                <FlexColSmall></FlexColSmall>
            </FlexRowSmall>
            <FlexRow>
                <FlexCol><Icon name="check" size={35} color={selected['over'] ? 'green': 'grey'} style={{textAlign: "center"}} onPress={() => placeBet("over", odds.over, "under")} /></FlexCol>
                <FlexCol>
                    <TeamTextSmall>Over</TeamTextSmall>
                    <OddsTextSmall>{odds.over}</OddsTextSmall>
                </FlexCol>
                <FlexCol></FlexCol>
                <FlexCol>
                    <TeamTextSmall>Under</TeamTextSmall>
                    <OddsTextSmall>{odds.under}</OddsTextSmall>
                </FlexCol>
                <FlexCol><Icon name="check" size={35} color={selected['under'] ? 'green': 'grey'} style={{textAlign: "center"}} onPress={() => placeBet("under", odds.under, "over")} /></FlexCol>
            </FlexRow>
            <FlexRowSmall>
                <FlexColSmall></FlexColSmall>
                <FlexColSmall>
                    <Svg xmlns="http://www.w3.org/2000/svg" width="100" height="1"><Svg.Path d="M 0 0 L 100 0" fill="transparent" stroke="#AAA"></Svg.Path></Svg>
                </FlexColSmall>
                <FlexColSmall></FlexColSmall>
                <FlexColSmall>
                    <Svg xmlns="http://www.w3.org/2000/svg" width="100" height="1"><Svg.Path d="M 0 0 L 100 0" fill="transparent" stroke="#AAA"></Svg.Path></Svg>
                </FlexColSmall>
                <FlexColSmall></FlexColSmall>
            </FlexRowSmall>
            <FlexRow>
                <FlexCol><Icon name="check" size={35} color={selected['spreadAway'] ? 'green': 'grey'} style={{textAlign: "center"}} onPress={() => placeBet("spreadAway", odds.spreadAway, "spreadHome")} /></FlexCol>
                <FlexCol>
                    <TeamTextSmall>{awayTeam.abbreviation}</TeamTextSmall>
                    <OddsTextSmall>{odds.spreadAway > 0 ? "+" : ""}{odds.spreadAway}</OddsTextSmall>
                </FlexCol>
                <FlexCol></FlexCol>
                <FlexCol>
                    <TeamTextSmall>{homeTeam.abbreviation}</TeamTextSmall>
                    <OddsTextSmall>{odds.spreadHome > 0 ? "+" : ""}{odds.spreadHome}</OddsTextSmall>
                </FlexCol>
                <FlexCol><Icon name="check" size={35} color={selected['spreadHome'] ? 'green': 'grey'} style={{textAlign: "center"}} onPress={() => placeBet("spreadHome", odds.spreadHome, "spreadAway")} /></FlexCol>
            </FlexRow>
            <FlexRowSmall>
                <FlexColSmall></FlexColSmall>
                <FlexColSmall>
                    <Svg xmlns="http://www.w3.org/2000/svg" width="100" height="1"><Svg.Path d="M 0 0 L 100 0" fill="transparent" stroke="#AAA"></Svg.Path></Svg>
                </FlexColSmall>
                <FlexColSmall></FlexColSmall>
                <FlexColSmall>
                    <Svg xmlns="http://www.w3.org/2000/svg" width="100" height="1"><Svg.Path d="M 0 0 L 100 0" fill="transparent" stroke="#AAA"></Svg.Path></Svg>
                </FlexColSmall>
                <FlexColSmall></FlexColSmall>
            </FlexRowSmall>
        </Bets>
    }
}
