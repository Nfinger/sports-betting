import * as React from "react";
import styled from 'styled-components'

const Odds = styled.View `
    height: 100px;
    width: 100%;
    background: rgba(136, 85, 255, 0.1);
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-around;
`

const FlexCol = styled.View `
    display: flex;
    height: 100%;
    align-content: center;
    justify-content: center;
    flex-direction: column;

`

const OddsTextSmall = styled.Text `
    color: rgb(91, 175, 237);
    font-size: 14px;
    font-weight: bold;
    text-align: center;
`

const OddsTextLarge = styled.Text `
    color: rgb(91, 175, 237);
    font-size: 20px;
    font-weight: bold;
    text-align: center;
`

const TeamLogo = styled.Image `
    height: 50px;
    width: 50px;
`

export class OddsContainer extends React.Component {

    // Set default properties
    static defaultProps = {
    homeTeam: {},
    awayTeam: {},
    odds: {},
    }

    render() {
        const {
            homeTeam,
            awayTeam,
            odds,
        } = this.props

        return <Odds>
            <FlexCol>
                <TeamLogo source={{uri: awayTeam.logo}} alt="" />
                <OddsTextSmall>{odds.moneyLineAway > 0 ? "+" : ""}{odds.moneyLineAway}</OddsTextSmall>
            </FlexCol>
            <FlexCol>
                <OddsTextLarge>{homeTeam.abbreviation} {odds.spreadHome > 0 ? "+" : ""}{odds.spreadHome}</OddsTextLarge>
                <OddsTextSmall>O/U {odds.over > 0 ? "+" : ""}{odds.over}</OddsTextSmall>
            </FlexCol>
            <FlexCol>
                <TeamLogo source={{uri: homeTeam.logo}} alt="" />
                <OddsTextSmall>{odds.moneyLineHome > 0 ? "+" : ""}{odds.moneyLineHome}</OddsTextSmall>
            </FlexCol>
        </Odds>
    }
}
