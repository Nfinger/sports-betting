import * as React from "react";
import { Query } from "react-apollo"
import {Text} from 'react-native'
import { Loader } from "./Loading";
import Panel from './Panel';
import gql from 'graphql-tag'
import styled from 'styled-components'

const RankRecordContainer = styled.View `
    width: 50%;
    background: rgba(136, 85, 255, 0.1);
    padding: 5%;
`

const FlexCol = styled.View `
    display: flex;
    align-content: center;
    justify-content: flex-start;
    flex-direction: column;
`

const FlexRow = styled.View `
    display: flex;
    align-content: center;
    justify-content: space-between;
    flex-direction: row;
`

const FlexRowIndented = styled.View `
    display: flex;
    align-content: center;
    justify-content: space-between;
    flex-direction: row;
    padding-left: 10%;
`

const StatText = styled.Text `
    color: rgb(174, 174, 174);
    font-size: 14px;
    font-weight: bold;
`

const getTeamStats = gql `
    query($teamId: ID!){
        allStatses(filter: {team: {id: $teamId}}) {
            id
            touchdowns {
                id
                pass
                rush
                totalReturn
                total
                fumbleReturn
                intReturn
                kickReturn
                puntReturn
                other
            }
            # rushing {
            #     id
            #     avgYards
            #     attempts
            #     touchdowns
            #     tlost
            #     tlostYards
            #     yards
            #     longest
            #     longestTouchdown
            #     redzoneAttempts
            #     brokenTackles
            #     kneelDowns
            #     scrambles
            #     yardsAfterContact
            # }
            # receiving {
            #     id
            #     targets
            #     receptions
            #     avgYards
            #     yards
            #     touchdowns
            #     yardsAfterCatch
            #     longest
            #     longestTouchdown
            #     redzoneTargets
            #     airYards
            #     brokenTackles
            #     droppedPasses
            #     catchablePasses
            #     yardsAfterContact
            # }
            # penalties {
            #     id
            #     penalties
            #     yards
            # }
            # passing {
            #     id
            #     attempts
            #     completions
            #     cmpPct
            #     interceptions
            #     sackYards
            #     rating
            #     touchdowns
            #     avgYards
            #     sacks
            #     longest
            #     longestTouchdown
            #     airYards
            #     redzoneAttempts
            #     netYards
            #     yards
            #     grossYards
            #     throwAways
            #     poorThrows
            #     defendedPasses
            #     droppedPasses
            #     spikes
            #     blitzes
            #     hurries
            #     knockdowns
            #     pocketTime
            # }
            # efficiency {
            #     id
            #     goaltogo
            #     redzone
            #     thirddown
            #     fourthdown
            # }
            # defense {
            #     id
            #     tackles
            #     assists
            #     combined
            #     sacks
            #     sackYards
            #     interceptions
            #     passesDefended
            #     forcedFumbles
            #     fumbleRecoveries
            #     qbHits
            #     tloss
            #     tlossYards
            #     safeties
            #     spTackles
            #     spAssists
            #     spForcedFumbles
            #     spFumbleRecoveries
            #     spBlocks
            #     miscTackles
            #     miscAssists
            #     miscForcedFumbles
            #     miscFumbleRecoveries
            #     defTargets
            #     defComps
            #     blitzes
            #     hurries
            #     knockdowns
            #     missedTackles
            # }
        }
    }
`

export class RankAndRecord extends React.Component{

    // Set default properties
    static defaultProps = {
        logo: "",
        teamCity: "",
        teamName: "",
        teamRecord: "",
        right: false
    }

    buildRows = (stats) => {
        const { right } = this.props
        const rows = []
        return stats.id
        // for (const category in stats) {
        //     if (category === "id" || category === "__typename") continue
        //     const interior = []
        //     for (let stat in stats[category]) {
        //         if (stat === "id" || stat === "__typename" || stats[category][stat] === 0) continue
        //         interior.push(<FlexRowIndented key={stat}><StatText style={right ? {textAlign: "right"} : {}}>{stat}</StatText><StatText style={right ? {textAlign: "right"} : {}}>{stats[category][stat]}</StatText></FlexRowIndented>)
        //     }
        //     rows.push(<Panel key={category} title={<StatText >{category}</StatText>}>
        //         {interior.map(stat => stat)}
        //     </Panel>)
        // }
        // return rows
    }

    render() {
        const { id } = this.props
        console.log("BOUTTA QUERY", id)
        return <RankRecordContainer>
            <FlexCol>
                <Query
                    query={getTeamStats}
                    variables={{teamId: id}}
                    >
                    {({loading, error, data}) => {
                        console.log(loading, error)
                        if (loading) return <Loader />
                        if (error) return <Text>Error</Text>
                        const statRows = this.buildRows(data.allStatses[0])
                        console.log(statRows)
                        return statRows
                        // return statRows.map(row => row)
                    }}
                </Query>
            </FlexCol>
        </RankRecordContainer>
    }
}
