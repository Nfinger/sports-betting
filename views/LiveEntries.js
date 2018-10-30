import React, { Component } from "react";
import { AsyncStorage, View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from "react-native";
import { ApolloConsumer, Query } from "react-apollo";
import { Loader } from "../components/Loading";
import { LiveGameSummary } from "../components/LiveGameSummary"
import { HamburgerButton } from "../components/HamburgerButton";
import { Header, Button } from "react-native-elements";
import styled from "styled-components";
import gql from "graphql-tag";
import * as Animatable from 'react-native-animatable';
import { FlexRow, FlexCol, BetDrawerBody, BetDrawerHeader, BetDrawerHeaderText, BetTile, AmountText, HeaderTextView } from "../components/styled";
import { styles } from "../constants/styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { TabbedHeader } from "../components/TabbedHeader";

const HEIGHT = Dimensions.get('window').height

const GAME_LIST_QUERY = gql`query($week: Int) {
    allGames(filter: {week:$week}, orderBy: time_DESC) {
        id
        time
        score
        gameClock
        quarter
        homeTeam {
            id
            abbreviation
            name
            logo
        }
        awayTeam {
            id
            abbreviation
            name
            logo
        }
        odds {
            id
            moneyLineHome
            moneyLineAway
            over
            under
            spreadAway
            spreadHome
        }
    }
}`

const entriesByUser = gql`
  query($ownerId: ID!, $currentWeek: Int, $now: DateTime) {
    allEntries(
      filter: { owner: { id: $ownerId }, dailyContest: { week: $currentWeek, startTime_lt: $now} }
    ) {
      id
      dailyContest {
        id
        name
        fee
        entries {
          id
          owner {
              id
              email
          }
          payout
          winnings
        }
      }
      payout
      winnings
      bets {
        id
        game {
          id
          homeTeam {
            id
            abbreviation
          }
          awayTeam {
            id
            abbreviation
          }
        }
        betType
        amount
      }
    }
  }
`;

const LiveGameScrollView = styled.ScrollView `
    display: flex;
    align-content: center;
    width: 100%;
    margin: 5%;
`


const TypeToReadable = {
    "money_line": "Money Line",
    "over_under": "Over/Under",
    "spread": "Spread"
}

const EntryContainer = styled.ScrollView`
  height: 100%;
  width: 100%;
  margin: 5%;
`;

const Entry = styled.TouchableOpacity`
  height: 75px;
  width: 90%;
  background-color: ${styles.secondaryColor};
  border-radius: 15px;
  padding: 2%;
`;

const TileText = styled.Text `
  font-size: 18px;
`

const TileInfo = styled.Text `
  font-size: 10px;
  color: gray;
`

const CreateLeagueContainer = styled.TouchableOpacity `
    height: 90%;
    width: 90%;
    background: rgba(64,64,64,0.25);
    box-shadow: 15px 15px 15px rgba(0,0,0, 0.25);
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 3%;
`
const AlertText = styled.Text `
  font-size: 20px;
`

export class LiveEntries extends Component {
    state = {
        drawerTabs: [{title: "Bets", selected: true}, {title: "Standings"}],
        tabs: [{title: "My Entries", selected: true}, {title: "Scores"}],
        ownerId: null,
        currentWeek: null,
        drawerOpen: false,
        bets: [],
        dailyContest: null,
        payout: 0,
        totalPayout: 0,
        winnings: 0,
        entryId: null,
        contests: null,
    }

    async componentWillMount() {
        const ownerId = await AsyncStorage.getItem("userId");
        const currentWeek = parseInt(await AsyncStorage.getItem('currentWeek'))
        this.setState({ currentWeek, ownerId })
    }

    handleSelectTab = (tab) => {
        const { tabs } = this.state
        tabs.map(tab => tab.selected = false)
        tabs[tab].selected = true
        this.setState({ tabs })
    }

    handleSelectDrawerTab = (tab) => {
        const { drawerTabs } = this.state
        drawerTabs.map(tab => tab.selected = false)
        drawerTabs[tab].selected = true
        this.setState({ drawerTabs })
    }

    handleViewRef = ref => this.view = ref;

    closeDrawer = () => {
        const {
            drawerOpen
        } = this.state
        this.view.transition({bottom: -100}, {bottom: -HEIGHT})
        this.setState({drawerOpen: !drawerOpen})
    }

    showEntry = ({winnings, bets, payout, dailyContest, id}) => {
        this.view.transition({bottom: -HEIGHT}, {bottom: -100})

        this.setState({bets, dailyContest, payout, winnings, entryId: id, drawerOpen: true})
    }

    onContestsFetched = contests => {
        let totalPayout = 0
        contests.map(contest => totalPayout += contest.payout)
        this.setState({ contests, totalPayout })
    }

    fetchContests = async (client) => {
        const {ownerId, currentWeek} = this.state
        const {data} = await client.query({
            query: entriesByUser,
            variables: { ownerId, currentWeek, now: new Date() },
            fetchPolicy: "network-only"
        })
        this.onContestsFetched(data.allEntries)
        return true
    }

    render() {
        const {
            tabs,
            drawerTabs,
            winnings,
            totalPayout,
            payout,
            contests,
            bets,
        } = this.state
        const selected = tabs.find(tab => tab.selected)
        const selectedDrawer = drawerTabs.find(tab => tab.selected)
        return (
            <View style={{ height: "100%" }}>
                <Header
                    outerContainerStyles={{ height: "11%" }}
                    backgroundColor={styles.primaryColor}
                    leftComponent={<HamburgerButton {...this.props} />}
                    centerComponent={{
                    text: "Live Entries",
                    style: { color: "#fff", fontSize: 24 }
                    }}
                />
                <TabbedHeader
                    handleSelectTab={this.handleSelectTab}
                    tabs={tabs} 
                />
                {selected.title === "My Entries" &&
                    <ApolloConsumer>
                    {client => (
                    <View style={{ height: "100%" }}>
                      <EntryContainer>
                        {!contests && this.fetchContests(client) && <Loader />}
                        {contests && contests.length === 0 && <View>
                            <Text>Total Payout: <AmountText>{totalPayout}</AmountText></Text>
                          <AlertText>You have no Live Contests</AlertText>
                          <CreateLeagueContainer onPress={() => this.props.navigation.navigate('DailyHome')}>
                            <Text>Join a New Contest!</Text>
                          </CreateLeagueContainer>
                        </View>}
                        {contests && contests.map((entry, idx) => (
                          <Entry key={idx} onPress={() => this.showEntry(entry)}>
                            <TileText >{entry.dailyContest.name}</TileText>
                            <FlexRow>
                              <FlexCol style={{width: "90%"}}>
                                <FlexRow style={{justifyContent: 'space-around', width: "30%"}}>
                                  <TileInfo>Entry</TileInfo>  <TileInfo>Entries</TileInfo>
                                </FlexRow>
                                <FlexRow style={{justifyContent: 'space-around', width: "30%"}}>
                                  <TileInfo>${entry.dailyContest.fee}</TileInfo>
                                  <TileInfo>{entry.dailyContest.entries.length}/5000</TileInfo>
                                </FlexRow>
                              </FlexCol>
                              <FlexCol>
                                <TileText>></TileText>
                              </FlexCol>
                            </FlexRow>
                          </Entry>
                        ))}
                      </EntryContainer>
                      <Animatable.View style={gameStyles.drawerContainer} ref={this.handleViewRef}>
                          <BetDrawerHeader>
                            <HeaderTextView>
                              <FlexRow style={{justifyContent: 'space-around'}}>
                                <TouchableOpacity style={{width: "25%"}} onPress={this.closeDrawer}><BetDrawerHeaderText style={{width: "100%"}}>Close</BetDrawerHeaderText></TouchableOpacity>
                                <BetDrawerHeaderText style={{width: "55%"}}>Currently Winning: <AmountText>${payout}</AmountText></BetDrawerHeaderText>
                              </FlexRow>
                            </HeaderTextView>
                            </BetDrawerHeader>
                            <TabbedHeader
                                handleSelectTab={this.handleSelectTab}
                                tabs={drawerTabs} 
                            />
                            <ScrollView>
                              {bets && <BetDrawerBody>
                                  {selectedDrawer === "Bets" && bets.map((bet, idx) => {
                                    return <BetTile key={idx}>
                                          <Text>{bet.game.awayTeam.abbreviation}@{bet.game.homeTeam.abbreviation}</Text>
                                          <Text>{TypeToReadable[bet.betType]}</Text>
                                          <AmountText>${bet.amount}</AmountText>
                                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Game', {game: bet.game, bets, edit: true, contest: dailyContest})}>
                                            <Icon
                                            name="edit"
                                            color="rgba(41,139,255, 1)"
                                            size={25}
                                            />
                                          </TouchableOpacity>
                                          <TouchableOpacity onPress={() => Alert.alert(
                                          'Are you sure you want to delete this bet?',
                                          'This action cannot be undone',
                                          [
                                              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                              {text: 'Yes', onPress: () => {
                                                  bets.splice(idx, 1)
                                                  this.setState({bets})
                                              }},
                                          ],
                                          { cancelable: true }
                                          )}>
                                              <Icon
                                              name="trash"
                                              color={styles.primaryColor}
                                              size={25}
                                              />
                                          </TouchableOpacity>
                                      </BetTile>
                                  })}
                                  {selectedDrawer === "Standings" && bets.map((bet, idx) => {
                                    return <BetTile key={idx}>
                                          <Text>{bet.game.awayTeam.abbreviation}@{bet.game.homeTeam.abbreviation}</Text>
                                          <Text>{TypeToReadable[bet.betType]}</Text>
                                          <AmountText>${bet.amount}</AmountText>
                                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Game', {game: bet.game, bets, edit: true, contest: dailyContest})}>
                                            <Icon
                                            name="edit"
                                            color="rgba(41,139,255, 1)"
                                            size={25}
                                            />
                                          </TouchableOpacity>
                                          <TouchableOpacity onPress={() => Alert.alert(
                                          'Are you sure you want to delete this bet?',
                                          'This action cannot be undone',
                                          [
                                              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                              {text: 'Yes', onPress: () => {
                                                  bets.splice(idx, 1)
                                                  this.setState({bets})
                                              }},
                                          ],
                                          { cancelable: true }
                                          )}>
                                              <Icon
                                              name="trash"
                                              color={styles.primaryColor}
                                              size={25}
                                              />
                                          </TouchableOpacity>
                                      </BetTile>
                                  })}
                              </BetDrawerBody>}
                          </ScrollView>
                      </Animatable.View>
                    </View>)}
                  </ApolloConsumer>
                }
                {selected.title === "Scores" &&
                    <Query
                        query={GAME_LIST_QUERY}
                        variables={{
                            week: 5
                        }}>
                        {({loading, error, data}) => {
                            if (loading) return <Loader />
                            if (error) return <Text>Error</Text>
                            return (
                                <LiveGameScrollView>
                                    {data.allGames.map(game => {
                                        return (<LiveGameSummary key={game.id} {...game} />)
                                    })}
                                </LiveGameScrollView>
                            )
                        }}
                    </Query>
                }
            </View>
        )
    }
}


const gameStyles = StyleSheet.create({
    container: {
        margin: "2%",
        backgroundColor: '#fff',
        height: "100%",
    },
    gamesContainer: {
        display: "flex",
        justifyContent: 'space-around',
        flexWrap: "wrap",
        flexDirection: "row"
    },
    topbarText: {
        color: 'white',
        fontSize: 14
    },
    drawerContainer: {
        width: "100%",
        position: 'absolute',
        bottom: -HEIGHT,
        height: "100%",
        backgroundColor: "rgba(200,200,200, 0.85)",
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 20
    }
  })