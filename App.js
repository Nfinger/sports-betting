import React from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from 'react-apollo';
import { GraphQLClient } from 'graphql-request'
import gql from 'graphql-tag';
import { StyleSheet, View, AsyncStorage, Text } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import Router from './routes';
import AuthScreen from './views/auth';
import { Loader } from "./components/Loading";

const client = new ApolloClient({
  uri: "https://api.graph.cool/simple/v1/cjmbxbmx136tq0126bdfvc6a3"
});

const gqlClient = new GraphQLClient("https://api.graph.cool/simple/v1/cjmbxbmx136tq0126bdfvc6a3")

const VALIDATE_TOKEN = gql`
  query ($token: String!){
    validatedToken(
      token: $token
    ){
      id
    }
  }
`

export default class App extends React.Component {
  state = {
    token: null,
    userId: null,
    isLoadingComplete: false,
    currentWeek: null
  };

  setUser = async (userId) => {
    await AsyncStorage.setItem('userId', userId)
    this.setState({userId});
  }

  getCurrentWeek() {
    return gqlClient.request(`
      {
        CurrentWeek(id: "cjmt4lkpx4j3j0183ajk6juiv") {
          currentWeek
        }
      }
    `)
  }

  render() {
    const {
      token,
      userId,
      currentWeek
    } = this.state
    
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else if (!currentWeek) {
      return <Loader />
    } else {
      return (
        <ApolloProvider client={client}>
          <View
            style={styles.container}
          >
            {token && <Query
              query={VALIDATE_TOKEN}
              variables={{token}}
              stlye={styles.container}
            >
              {({loading, error, data}) => {
                if (loading) return <Loader />
                if (error) return <Text>Error :(</Text>
                if (data.validatedToken && data.validatedToken.id) {
                  if (!userId) this.setUser(data.validatedToken.id)
                  return <Router />
                }
                return <AuthScreen />
              }}
            </Query>}
          </View>
        </ApolloProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    const {CurrentWeek: {currentWeek}} = await this.getCurrentWeek()
    this.setState({currentWeek})
    return Promise.all([
      await AsyncStorage.setItem('currentWeek', currentWeek.toString()),
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'georgia': require('./assets/fonts/Georgia.ttf'),
        'bold': require("./assets/fonts/Montserrat-Bold.ttf"),
        'regular': require('./assets/fonts/Montserrat-Regular.ttf'),
        'light': require('./assets/fonts/Montserrat-Light.ttf'),
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = async () => {
    const token = await AsyncStorage.getItem("token")
    this.setState({token, isLoadingComplete: true})
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

