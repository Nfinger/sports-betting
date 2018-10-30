import React, { Component } from 'react';
import { Svg } from "expo";
import { FlexRow, FlexCol } from "./styled";
import { mapNumberToLghts } from "../constants/scoreboardMapping";
import styled from "styled-components";

const ScoreboardContainer = styled.View`
    height: 100px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-content: center;
    align-items: center;
    background: #535050;
    border-radius: 10px;
`

const TimeColon = styled.Text `
    font-size: 24px;
    color: white;
`

const QuarterText = styled.Text `
    font-size: 16px;
    color: white;
`

export class Scoreboard extends Component {

    buildEight = (number, small) => (
        <FlexCol style={{padding: "2%"}}>
            {[1,2,3,4,5,6,7].map((row, idx) => {
                const fullRow = row === 1 || row === 4 || row === 7
                return <FlexRow key={idx}>
                    {[1,2,3,4].map((col, idx) => {
                        if (!fullRow && (col === 2 || col === 3)) return <Svg key={idx} xmlns="http://www.w3.org/2000/svg" width={small ? "7" : "10"} height={small ? "7" : "10"}>
                                {!small && <Svg.Path d="M 5 0 C 7.761 0 10 2.239 10 5 C 10 7.761 7.761 10 5 10 C 2.239 10 0 7.761 0 5 C 0 2.239 2.239 0 5 0 Z" fill="#535050"></Svg.Path>}
                                {small && <Svg.Path d="M 3.5 0 C 5.433 0 7 1.567 7 3.5 C 7 5.433 5.433 7 3.5 7 C 1.567 7 0 5.433 0 3.5 C 0 1.567 1.567 0 3.5 0 Z" fill="#535050"></Svg.Path>}
                            </Svg>;
                            
                        return <Svg key={idx} xmlns="http://www.w3.org/2000/svg" width={small ? "7" : "10"} height={small ? "7" : "10"}>
                            {!small && <Svg.Path d="M 5 0 C 7.761 0 10 2.239 10 5 C 10 7.761 7.761 10 5 10 C 2.239 10 0 7.761 0 5 C 0 2.239 2.239 0 5 0 Z" style={{borderWidth: 2, borderColor: "hsla(0, 0%, 17%, 0.3)" }} fill={number && mapNumberToLghts[number][row][col] ? "orange" : "hsla(0, 0%, 17%, 0.3)"}></Svg.Path>}
                            {small && <Svg.Path d="M 3.5 0 C 5.433 0 7 1.567 7 3.5 C 7 5.433 5.433 7 3.5 7 C 1.567 7 0 5.433 0 3.5 C 0 1.567 1.567 0 3.5 0 Z" style={{borderWidth: 2, borderColor: "hsla(0, 0%, 17%, 0.3)" }} fill={number && mapNumberToLghts[number][row][col] ? "orange" : "hsla(0, 0%, 17%, 0.3)"}></Svg.Path>}
                        </Svg>}
                    )}}
                </FlexRow>
            }
            )}}
        </FlexCol>
    )

    handleScore = () => {
        const {
            score
        } = this.props
        const splitScore = score.split("-")
        const away = splitScore[0].split("")
        const home = splitScore[1].split("")
        return {
            firstDigit: away[0] && parseInt(away[0]),
            secondDigit: away[1] && parseInt(away[1]),
            thirdDigit: home[0] && parseInt(home[0]),
            fourthDigit: home[1] && parseInt(home[1])
        }
    }

    render() {
        const {
            firstDigit,
            secondDigit,
            thirdDigit,
            fourthDigit
        } = this.handleScore()
        const {
            quarter
        } = this.props

        return <ScoreboardContainer>
            <FlexCol>
                <FlexRow style={{justifyContent: "center", alignItems: "center"}}>
                    {this.buildEight(secondDigit && firstDigit)}
                    {this.buildEight(secondDigit || firstDigit)}
                </FlexRow>
            </FlexCol>
            <FlexCol style={{alignContent: "center"}}>
                <FlexRow style={{justifyContent: "center", alignItems: "center"}}>
                {this.buildEight(1, true)}{this.buildEight(2, true)}<TimeColon>:</TimeColon>{this.buildEight(4, true)}{this.buildEight(6, true)}
                </FlexRow>
                <FlexRow style={{justifyContent: "space-between", margin: "7%"}}>
                    {[1,2,3,4].map(quarterLight => (
                        <FlexCol key={quarterLight} style={{justifyContent: "center", alignItems: "center"}}>
                            <Svg xmlns="http://www.w3.org/2000/svg" width="7" height="7">
                                <Svg.Path d="M 3.5 0 C 5.433 0 7 1.567 7 3.5 C 7 5.433 5.433 7 3.5 7 C 1.567 7 0 5.433 0 3.5 C 0 1.567 1.567 0 3.5 0 Z" fill={quarter === quarterLight ? "orange" : "hsla(0, 0%, 17%, 0.4)"}></Svg.Path>
                            </Svg>
                            <QuarterText>Q{quarterLight}</QuarterText>
                        </FlexCol>

                    ))}
                </FlexRow>
            </FlexCol>
            <FlexCol>
                <FlexRow style={{justifyContent: "center", alignItems: "center"}}>
                    {this.buildEight(fourthDigit && thirdDigit)}
                    {this.buildEight(fourthDigit || thirdDigit)}
                </FlexRow>
            </FlexCol>
        </ScoreboardContainer>
    }

}