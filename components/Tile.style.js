import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get('window');
export const styles = StyleSheet.create({
    gameTile: {
        backgroundColor: "rgba(247, 235, 200, 1.00)",
        width: width - 80,
        margin: 5,
        height: 130,
        borderRadius: 10,
        display: "flex",
    },
    smallGameTile: {
        backgroundColor: "rgba(247, 235, 200, 1.00)",
        width: "100%",
        margin: 5,
        height: 80,
        borderRadius: 10,
        display: "flex",
    },
    tileBody: {
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-around"
    },
    columns: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    tileText: {
        color: "black",
        fontFamily: "regular",
        fontSize: 14,
    },
    tileTitleText: {
        color: "black",
        fontFamily: "regular",
        alignSelf: "flex-start"
    },
    articleTileTitle: {
        color: "black",
        fontFamily: "regular",
        flex:1,
        flexWrap: 'wrap'
    },
    articleTileText: {
        color: "black",
        fontFamily: "regular",
        alignSelf: "flex-start",
        flex:1,
        fontSize: 10,
        flexWrap: 'wrap'
    },
    articleTileBody: {
        paddingTop: "10%",
        height: "160%",
        display: "flex",
        alignItems: 'center',
        justifyContent: "center"
    },
})