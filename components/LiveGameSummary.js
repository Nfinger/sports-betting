import React from "react"
import { Scoreboard } from "./Scoreboard";
import { FlexCol, FlexRow } from "./styled";
import { View, Text, Image } from "react-native";
import { styles } from "./Tile.style";
import { BetBox } from "./BetBox";
import styled from 'styled-components';

const TeamHeaderContainer = styled.View `
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    width: 100%;
`

const TeamName = styled.Text `
    font-size: 18px;
    color: white;
    font-weight: bold;
`

const TeamLogo = styled.Image `
    height: 75px;
    width: 75px;
`

const GameContainer = styled.View `
    height: 320px;
    width: 90%;
    border-radius: 20px;
    background: rgb(75, 75, 75);
    padding: 2%;
    margin-bottom: 2%;
`

export const LiveGameSummary = game => (
    <GameContainer>
        <TeamHeaderContainer>
            <FlexCol style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <TeamLogo source={{uri: game.awayTeam.logo}}></TeamLogo>
                <TeamName>{game.awayTeam.abbreviation}</TeamName>
            </FlexCol>
            <FlexCol style={{flex: 1, justifyContent: 'flex-start'}}></FlexCol>
            <FlexCol style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <TeamLogo source={{uri: game.homeTeam.logo}}></TeamLogo>
                <TeamName>{game.homeTeam.abbreviation}</TeamName>
            </FlexCol>
        </TeamHeaderContainer>
        <FlexRow>
            <Scoreboard score={game.score} />
        </FlexRow>
        <FlexRow>
            <BetBox width={"100%"} height={110} homeTeam={game.homeTeam.name} awayTeam={game.awayTeam.name} odds={game.odds} />
        </FlexRow>
    </GameContainer>
)