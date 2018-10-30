import React, { Component } from "react";
import { AsyncStorage, View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from "react-native";
import { ApolloConsumer } from "react-apollo";
import { Loader } from "../components/Loading";
import { HamburgerButton } from "../components/HamburgerButton";
import { Header, Button } from "react-native-elements";
import styled from "styled-components";
import gql from "graphql-tag";
import * as Animatable from 'react-native-animatable';
import { FlexRow, FlexCol, BetDrawerBody, BetDrawerHeader, BetDrawerHeaderText, BetTile, AmountText, HeaderTextView } from "../components/styled";
import { styles } from "../constants/styles";
import Icon from "react-native-vector-icons/FontAwesome";

const HEIGHT = Dimensions.get('window').height

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

const entriesByUser = gql`
  query($ownerId: ID!, $currentWeek: Int, $now: DateTime) {
    allEntries(
      filter: { owner: { id: $ownerId }, dailyContest: { week: $currentWeek, startTime_gt: $now} }
    ) {
      id
      dailyContest {
        id
        name
        fee
        entries {
          id
        }
      }
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

const deleteEntryMutation = gql `
  mutation($id: ID!) {
    deleteEntry(id: $id) {
      id
    }
  }
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

class UpcomingBets extends Component {
  state = {
    ownerId: null,
    currentWeek: null,
    drawerOpen: false,
    bets: [],
    dailyContest: null,
    balance: 0,
    entryId: null,
    contests: null,
    deleting: false
  }

  async componentWillMount () {
    console.log(new Date())
    const ownerId = await AsyncStorage.getItem("userId");
    const currentWeek = await AsyncStorage.getItem("currentWeek");
    this.setState({ ownerId, currentWeek: parseInt(currentWeek) })
  }

  handleViewRef = ref => this.view = ref;

  closeDrawer = () => {
      const {
        drawerOpen
      } = this.state
      this.view.transition({bottom: -100}, {bottom: -HEIGHT})
      this.setState({drawerOpen: !drawerOpen})
  }

  showEntry = ({bets, dailyContest, id}) => {
    let balance = 2500
    this.view.transition({bottom: -HEIGHT}, {bottom: -100})
    bets.map(bet => {
      balance -= parseFloat(bet.amount)
    })
    this.setState({bets, dailyContest, balance, entryId: id, drawerOpen: true})
  }

  onContestsFetched = contests => this.setState({contests})

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

  deleteEntry = async (client, id) => {
    this.setState({deleting: true})
    await client.mutate({
      mutation: deleteEntryMutation,
      variables: {id}
    })
    const {ownerId, currentWeek} = this.state
    const {data} = await client.query({
      query: entriesByUser,
      variables: { ownerId, currentWeek },
      fetchPolicy: "network-only"
    })
    this.onContestsFetched(data.allEntries)
    this.setState({deleting: false})
  }

  render() {
    const { ownerId, currentWeek, balance, dailyContest, contests, bets, entryId, deleteing } = this.state
    if (!ownerId || deleteing || !currentWeek) return <Loader />
    return (
      <ApolloConsumer>
        {client => (
        <View style={{ height: "100%" }}>
          <Header
            outerContainerStyles={{ height: "11%" }}
            backgroundColor={styles.primaryColor}
            leftComponent={<HamburgerButton {...this.props} />}
            centerComponent={{
              text: "Upcoming Entries",
              style: { color: "#fff", fontSize: 24 }
            }}
          />
          <EntryContainer>
            {!contests && this.fetchContests(client) && <Loader />}
            {contests && contests.length === 0 && <View>
              <AlertText>You have no Upcoming Contests</AlertText>
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
                    <BetDrawerHeaderText style={{width: "55%"}}>Remaining Balance: <AmountText>${balance}</AmountText></BetDrawerHeaderText>
                    <FlexRow style={{width: "20%", display: 'flex', justifyContent: 'space-around'}}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate("GameList", {contest: dailyContest, bets, entryId})}>
                        <Icon
                          name="plus"
                          color={"rgb(48, 173, 99)"}
                          size={25}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => Alert.alert(
                      'Are you sure you want to delete this Entry?',
                      'This action cannot be undone',
                      [
                          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                          {text: 'Yes', onPress: () => {
                            this.closeDrawer()
                            this.deleteEntry(client, entryId)
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
                    </FlexRow>
                  </FlexRow>
                </HeaderTextView>
              </BetDrawerHeader>
              <ScrollView>
                  {bets && <BetDrawerBody>
                      {bets.map((bet, idx) => {
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
    );
  }
}

export default UpcomingBets;

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