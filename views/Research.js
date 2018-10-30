import React, { Component } from 'react';
import { graphql, Query } from "react-apollo";
import { HamburgerButton } from "../components/HamburgerButton";
import { ArticleTile } from "../components/ArticleTile";
import { Header, Button } from "react-native-elements";
import { styles } from "../constants/styles";
import { Loader } from "../components/Loading";
import {
    View,
    WebView,
    ScrollView,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import gql from 'graphql-tag';

const ARTICLE_QUERY = gql`
    query {
        allArticles(orderBy: publishedAt_DESC) {
            id
            title
            description
            author
            url
            urlToImage
        }
    }
`

const WEBVIEW_REF = "WEBVIEW_REF";

export default class Research extends Component {
    state = {
        selectedArticle: null,
        canGoBack: false
    }

    onPress = selectedArticle => this.setState({ 
        selectedArticle 
    })

    onNavigationStateChange = (navState) => {
        this.setState({
            canGoBack: navState.canGoBack
        });
    }

    onBack = () =>  {
        this.setState({selectedArticle: null})
    }

    render() {
        const {
            selectedArticle
        } = this.state
        if (selectedArticle) return (
            <View style={webViewStyles.container}>
                <Header
                    outerContainerStyles={{ height: "11%" }}
                    backgroundColor={styles.primaryColor}
                    leftComponent={<TouchableOpacity onPress={this.onBack}><Text style={webViewStyles.topbarText}>Back</Text></TouchableOpacity>}
                    centerComponent={{ text: selectedArticle.title, style: { color: '#fff', fontSize: 12 } }}
                />
                <WebView
                    ref={WEBVIEW_REF}
                    style={{ flex: 1 }}
                    onNavigationStateChange={this.onNavigationStateChange}
                    source={{ uri: selectedArticle.url }}
                />
            </View>
        )
        return (
            <View>
                <Header
                    outerContainerStyles={{ height: "11%" }}
                    backgroundColor={styles.primaryColor}
                    leftComponent={<HamburgerButton {...this.props} />}
                    centerComponent={{ text: 'Research', style: { color: '#fff', fontSize: 24 } }}
                />
                <ScrollView style={webViewStyles.srollViewContainer}>
                    <Query
                        query={ARTICLE_QUERY}
                    >
                        {({ loading, error, data: { allArticles } }) => {
                            if (loading) return <Loader />
                            if (error) return <Text>Error :(</Text>
                            return allArticles.map((article, idx) => (
                                <ArticleTile onPress={this.onPress} key={idx} {...article} />
                            ))
                        }}
                    </Query>
                </ScrollView>
            </View>
        )
    }
}

const webViewStyles = StyleSheet.create({
    srollViewContainer: {
        marginTop: "5%",
        marginRight: "5%",
        marginLeft: "5%",
        height: "110%"
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        display: "flex"
    },
    topbar: {
        height: "2%",
        marginTop: "14%",
        alignSelf: "center"
    },
    topbarText: {
        color: 'white',
        fontSize: 18
    }
});