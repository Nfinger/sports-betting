import React from "react"
import moment from "moment"
import { FlexCol } from "./styled";
import { isPast } from 'date-fns'
import { View, Text, Image } from "react-native";
import { styles } from "./Tile.style";

export const GameTile = props => (
    <View style={props.featured ? styles.gameTile : styles.smallGameTile}>
        <View style={styles.tileBody}>
            <Image style={props.featured ? {height: 75, width: 75} : {height: 35, width: 35}} source={{uri: `https://s3.us-east-2.amazonaws.com/sports-betting-mfs/teamLogos/${props.awayTeam.abbreviation.toLowerCase()}.png`}}></Image>
            <View style={styles.columns}>
                <Text style={styles.tileText}>{props.awayTeam.abbreviation} @ {props.homeTeam.abbreviation}</Text>
                {moment(props.time) > moment() && <Text style={styles.tileText}>{moment(props.time).format("ddd h:mm A")}</Text>}
                {moment(props.time) < moment() && 
                <FlexCol>
                    <Text style={styles.tileText}>{props.gameClock}</Text>
                    <Text style={styles.tileText}>{props.score}</Text>
                </FlexCol>
                }
            </View>
            <Image style={props.featured ? {height: 75, width: 75} : {height: 35, width: 35}} source={{uri: `https://s3.us-east-2.amazonaws.com/sports-betting-mfs/teamLogos/${props.homeTeam.abbreviation.toLowerCase()}.png`}}></Image>
        </View>
    </View>
)