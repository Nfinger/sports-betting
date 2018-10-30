import React, { Component } from 'react';
import { graphql, Query } from "react-apollo";
import { lastDayOfWeek, addDays } from "date-fns";
import { HamburgerButton } from "../components/HamburgerButton";
import { ContestTile } from "../components/ContestTile";
import { Loader } from "../components/Loading";
import { Header, Button } from "react-native-elements";
import { styles } from "../constants/styles";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import gql from 'graphql-tag';

const CREATE_ENTRY_MUTATION = gql `
    mutation($ownerId: ID!, $dailyContestId: ID!) {
    createEntry(
        dailyContestId: $dailyContestId
        ownerId: $ownerId
    ) {
        id
    }
}`


const DAILY_CONTESTS_QUERY = gql`
    query {
        allDailyContests {
            id
            name
            payout
            entries {
                id
                owner {
                    id
                    email
                }
                bets {
                    id
                    betType
                    amount
                    game {
                    id
                    awayTeam {
                        id
                        abbreviation
                    }
                    homeTeam {
                        id
                        abbreviation
                    }
                    }
                }
            }
        }
    }
`

class DailyHome extends Component {

    render() {
        return (
            <View>
                <Header
                    outerContainerStyles={{ height: "11%" }}
                    backgroundColor={styles.primaryColor}
                    leftComponent={<HamburgerButton {...this.props} />}
                    centerComponent={{ text: 'Daily Fantasy', style: { color: '#fff', fontSize: 24 } }}
                />
                <View style={homeStyles.container}>
                    <Query
                        query={DAILY_CONTESTS_QUERY}
                        // variables={{
                        //     start: new Date(),
                        //     end: addDays(lastDayOfWeek(new Date(), {weekStartsOn: 1}), 1)
                        // }}
                        >
                        {({loading, error, data}) => {
                            if (loading) return <Loader />
                            if (error) return <Text>Error</Text>
                            return data.allDailyContests.map((contest, idx) => (
                                <TouchableOpacity key={idx}ode  onPress={() => this.props.navigation.navigate("GameList", {contest})}>
                                    <ContestTile {...contest} />
                                </TouchableOpacity>
                            ))
                        }}
                    </Query>
                </View>
            </View>
        )
    }
}

export default graphql(
    CREATE_ENTRY_MUTATION,
    { name: "createEntry" }
)(DailyHome);

const homeStyles = StyleSheet.create({
    container: {
        margin: "10%",
        backgroundColor: '#fff',
        height: "100%",
    }
})