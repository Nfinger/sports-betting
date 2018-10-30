import * as React from "react";
import styled from 'styled-components'
import moment from 'moment'

const TimeAndLocationContainer = styled.View `
    height: 30px;
    width: 100%;
    background: rgba(136, 85, 255, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TimeText = styled.Text `
    color: rgb(0,0,0);
    font-size: 12px;
    font-weight: bold;
`

const LocationText = styled.Text `
    color: rgba(174, 174, 174, 1.00);
    font-size: 12px;
    font-weight: 500;
    padding-top: 1%;
`

export class TimeAndLocation extends React.Component {
    render() {
        const {
            time,
            broadcast,
            venue
        } = this.props

        return <TimeAndLocationContainer>
            <TimeText>{moment(time).format("dddd M/D - H:mm A")} - {broadcast}</TimeText>
            <LocationText>{venue.city}, {venue.state}</LocationText>
        </TimeAndLocationContainer>
    }
}
