import React from "react"
import { View, Text, StyleSheet } from "react-native";
import { styles } from "./Tile.style";

export const ContestTile = (contest) => (
    <View style={styles.gameTile}>
        <View style={styles.tileBody}>
            <View style={tileStyle.columns}>
                <Text style={styles.tileText}>{contest.name}</Text>
                <Text style={styles.tileText}>Entries: {contest.entries.length} / 5000</Text>
            </View>
            <View style={tileStyle.columns}>
                <Text style={styles.tileText}>Contest Payout</Text>
                <Text style={styles.tileText}>${contest.payout}</Text>
            </View>
        </View>
    </View>
)

const tileStyle = StyleSheet.create({
    columns: {
        display: 'flex',
        flexDirection: 'column'
    }
})