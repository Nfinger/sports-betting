import React from "react"
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./Tile.style";

export const ArticleTile = (article) => (
    <TouchableOpacity onPress={() => article.onPress(article)} style={styles.gameTile}>
        <Text style={styles.articleTileTitle}>{article.title}</Text>
        <View style={styles.articleTileBody}>
            <Text style={styles.articleTileText}>{article.description}</Text>
        </View>
    </TouchableOpacity>
)