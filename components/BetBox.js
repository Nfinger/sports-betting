import * as React from "react";
import { Text, View } from "react-native"
import styled from 'styled-components';

const BetBoxContainer = styled.View`
    height: 155px;
    width: 265px;
    padding-top: 10px;
    padding-right: 10px;
    background: rgba(255,255,255, 0.95);
    box-shadow: 0 10px 20px rgba(0,0,0, 0.25);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
`

const BetBody = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 50%;
`

const BetHeader = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    border-bottom-width: 1px;
    border-style: solid;
    width: 100%;
    padding-left: 27%;
`

const BetRows = styled.View`
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 5%;
    bottom: 20%;
    height: 40%;
`

const TeamHeader = styled.Text`
    font-size: 18px;
`

const AwayBetBody = styled.View`
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 40%;
    bottom: 16%;
    height: 40%;
`

const HomeBetBody = styled.View`
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 12%;
    bottom: 16%;
    height: 40%;
`

const BetType = styled.Text`
    text-align: center;
`

export class BetBox extends React.Component {


    render() {
        const { width, height } = this.props
        return <BetBoxContainer style={width ? {width, height} : {}}>
            <BetHeader>
                <TeamHeader>{this.props.awayTeam}</TeamHeader>
                <TeamHeader>{this.props.homeTeam}</TeamHeader>
            </BetHeader>
            <BetBody>
                <BetRows>
                    <BetType>Spread</BetType>
                    <BetType>Over/Under</BetType>
                    <BetType>Money Line</BetType>
                </BetRows>
                <AwayBetBody>
                    <BetType>{`${this.props.odds.spreadAway > 0 ? '+' : ''}${this.props.odds.spreadAway}`}</BetType>
                    <BetType>{this.props.odds.over}</BetType>
                    <BetType>{`${this.props.odds.moneyLineAway > 0 ? '+' : ''}${this.props.odds.moneyLineAway}`}</BetType>
                </AwayBetBody>
                <HomeBetBody>
                    <BetType>{`${this.props.odds.spreadHome > 0 ? '+' : ''}${this.props.odds.spreadHome}`}</BetType>
                    <BetType>{this.props.odds.under}</BetType>
                    <BetType>{`${this.props.odds.moneyLineHome > 0 ? '+' : ''}${this.props.odds.moneyLineHome}`}</BetType>
                </HomeBetBody>
            </BetBody>
            </BetBoxContainer>;
    }
}
