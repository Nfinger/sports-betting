import React, { Component } from 'react';
import { graphql, Query } from "react-apollo";
import { Text, Button, View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, AsyncStorage } from "react-native";
import { HamburgerButton } from "../components/HamburgerButton";
import { Header } from "react-native-elements";
import { styles } from "../constants/styles";
import { GameTile } from '../components/GameTile';
import { MatchupTile } from '../components/MatchupTile';
import { ContestTile } from '../components/ContestTile';
import { Loader } from "../components/Loading";
import styled from 'styled-components'
import gql from 'graphql-tag';

const { width } = Dimensions.get('window');

const FEATURED_GAME_QUERY = gql`query($currentWeek: Int) {
    allGames(filter: {odds: {over_gt: 55}, week: $currentWeek}, first:3) {
        id
        time
        score
        gameClock
        quarter
        broadcast
        venue {
            id
            name
            city
            state
        }
        homeTeam {
            id
            name
            abbreviation
            logo
            city
            wins
            loses
            ties
        }
        awayTeam {
            id
            name
            abbreviation
            logo
            city
            wins
            loses
            ties
        }
    }
}`

const ENTRIES_BY_USER_QUERY = gql`
    query($userId: ID!) {
        allEntries(filter: {owner: {id: $userId}}) {
            id
            dailyContest {
                id
                name
                entries {
                    id
                }
                payout
                startTime
            }
        }
    }
`

const CreateLeagueContainer = styled.TouchableOpacity `
    height: 60%;
    width: 100%;
    background: rgba(64,64,64,0.25);
    box-shadow: 15px 15px 15px rgba(0,0,0, 0.25);
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2%;
`

const HomeSectionContainer = styled.View `
    height: 20%;
    width: 100%;
    display: flex;
`

class HomeScreen extends Component {
    state = {
        userId: null,
        currentWeek: null
    }

    async componentWillMount() {
        const userId = await AsyncStorage.getItem('userId')
        const currentWeek = await AsyncStorage.getItem('currentWeek')
        this.setState({userId, currentWeek})
    }

    render() {
        const {
            userId,
            currentWeek
        } = this.state
        if (!currentWeek) return <Loader />
        return (
            <View>
                <Header
                    outerContainerStyles={{ height: "11%" }}
                    backgroundColor={styles.primaryColor}
                    leftComponent={<HamburgerButton {...this.props} />}
                    centerComponent={{ text: 'Home', style: { color: '#fff', fontSize: 24 } }}
                />
                <View style={homeStyles.container}>
                    <HomeSectionContainer>
                        <Text style={homeStyles.headerText}>Featured Games</Text>
                        <Query
                            query={FEATURED_GAME_QUERY}
                            variable={{currentWeek}}
                            fetchPolicy="network-only"
                        >
                        {({loading, error, data}) => {
                            if (loading) return <Loader />
                            if (error) return <Text>Error</Text>
                            return (
                            <ScrollView 
                                ref={(scrollView) => { this.scrollView = scrollView; }}
                                horizontal= {true}
                                decelerationRate={0}
                                snapToInterval={width - 60}
                                snapToAlignment={"center"}
                                contentInset={{
                                top: 0,
                                left: 30,
                                bottom: 0,
                                right: 30,
                                }}>
                                    {data.allGames.map((game, idx) => {
                                        return (
                                            <TouchableOpacity  key={idx} onPress={() => this.props.navigation.navigate('LiveGame', {game})}>
                                                <GameTile featured={true} {...game} />
                                            </TouchableOpacity>
                                        )
                                    })}
                            </ScrollView>)

                        }}
                        </Query>
                    </HomeSectionContainer>
                    <HomeSectionContainer>
                        <Text style={homeStyles.headerText}>Your Leagues</Text>
                        <CreateLeagueContainer>
                            <Text>This feaure has not been implemented yet</Text>
                        </CreateLeagueContainer>
                    </HomeSectionContainer>
                    <HomeSectionContainer>
                        <Text style={homeStyles.headerText}>Your Upcoming Daily Contests</Text>
                        <CreateLeagueContainer onPress={() => this.props.navigation.navigate('DailyHome')}>
                            <Text>Enter New Contest</Text>
                        </CreateLeagueContainer>
                        <CreateLeagueContainer onPress={() => this.props.navigation.navigate('UpcomingEntries')}>
                            <Text>View My Entries</Text>
                        </CreateLeagueContainer>
                    </HomeSectionContainer>
                    {/* <Text style={homeStyles.headerText}>Leagues</Text>
                    {user.league && <MatchupTile {...user.league} />}
                    <Text style={homeStyles.headerText}>Upcoming Daily Fantasy Contests</Text>
                    {user.league && <ContestTile {...user.league} />} */}
                </View>
            </View>
        )
    }
}

export default HomeScreen


const homeStyles = StyleSheet.create({
    container: {
        height: "100%",
        margin: "5%",
        backgroundColor: '#fff',
        display: "flex",
        flexDirection: 'column'
    },
    headerText: {
        color: "black",
        fontFamily: "regular",
        fontSize: 18,
        paddingTop: "5%",
        paddingBottom: "2%",
    },
})