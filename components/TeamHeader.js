import * as React from "react";
import styled from 'styled-components'

const TeamHeaderContainer = styled.View `
    height: 185px;
    width: 188px;
    background: rgba(136, 85, 255, 0.1);
    padding: 5%;
    padding-top: 20%;
`

const FlexCol = styled.View `
    display: flex;
    align-content: center;
    justify-content: flex-start;
    flex-direction: column;
`

const TeamCity = styled.Text `
    color: rgb(174, 174, 174);
    font-size: 24px;
    font-weight: bold;
`

const TeamName = styled.Text `
    color: rgb(174, 174, 174);
    font-size: 16px;
    font-weight: bold;
`

const TeamRecord = styled.Text `
    color: rgb(91, 175, 237);
    font-size: 16px;
    font-weight: bold;
`

const TeamLogoRight = styled.Image `
    height: 75px;
    width: 75px;
    position: absolute;
    top: 10%;
    right: 20%;
`

const TeamLogoLeft = styled.Image `
    height: 75px;
    width: 75px;
    position: absolute;
    top: 10%;
    left: 20%;
`

export class TeamHeader extends React.Component {

    // Set default properties
    static defaultProps = {
    logo: "",
    city: "",
    name: "",
    wins: "",
    right: false
    }

    render() {
        const {
            logo,
            city,
            name,
            wins,
            ties,
            loses,
            right
        } = this.props

        return <TeamHeaderContainer>
            {right ? <TeamLogoRight source={{uri: logo}} alt="" /> : <TeamLogoLeft source={{uri: logo}} alt=""/>}
            <FlexCol style={right ? {alignContent: "flex-end"} : {}}>
                <TeamCity style={right ? {textAlign: "right"} : {}}>{city}</TeamCity>
                <TeamName style={right ? {textAlign: "right"} : {}}>{name}</TeamName>
                <TeamRecord style={right ? {textAlign: "right"} : {}}>{wins}-{loses}{ties ? `-${ties}`: ""}</TeamRecord>
            </FlexCol>
        </TeamHeaderContainer>
    }
}
