import React from "react"
import { View, Text } from "react-native";
import { styles } from "./Tile.style";

export const MatchupTile = props => (
    <View style={styles.gameTile}>
        <Text style={styles.tileTitleText}>{props.name}</Text>
        <View style={styles.tileBody}>
            <Text style={styles.tileText}>{props.myTeam && props.myTeam.name} vs. {props.myOpponent && props.myOpponent.name}</Text>
        </View>
    </View>
)