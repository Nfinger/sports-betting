import * as React from "react";
import { Text } from 'react-native-elements'
import { View } from 'react-native'
import styled from 'styled-components';

const KeyPlayerContainer = styled.View`
    height: 140px;
    width: 155px;
    padding-top: 1px;
    padding-left: 10px;
    background: rgba(255,255,255, 0.95);
    box-shadow: 0 10px 20px rgba(0,0,0, 0.25);
    border-radius: 15px;
`
const StatText = styled.Text`
    color: #474747;
    font-size: 8px;
    padding-left: 5%;
`

const Header = styled.Text`
    font-size: 18px;
    font-weight: bold;
    text-decoration: underline;
`

export class KeyPlayers extends React.Component {

    // Set default properties
    static defaultProps = {
    players: []
    }

    render() {
        return <KeyPlayerContainer>
            <Header>Key Players</Header>
            {this.props.players.map((player, idx) => (
                <View key={idx}>
                    <Text>{player.name}</Text>
                    <StatText className="stats">{player.stats}</StatText>
                </View>
            ))}
            </KeyPlayerContainer>;
    }
}
