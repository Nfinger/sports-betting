import * as React from "react";
import styled from 'styled-components'
import { Svg } from "expo";
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WeatherRowContainer = styled.View `
    height: 30px;
    width: 100%;
    background: rgba(136, 85, 255, 0.1);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row;
`

export class WeatherRow extends React.Component {
    conditionToIcon = condition => {
        switch (condition) {
            case "Partly Cloudy":
                return "partlycloudy"
            case "Thunderstorms":
                return "lightning-rainy"
            case "Sunny":
                return "sunny"
            case "Scattered Thunderstorms":
                return "lightning"
            case "Scattered Showers": 
            case "Showers":
                return "rainy"
            case "Mostly Cloudy":
                return "windy-variant"
            case "Cloudy": 
                return "cloudy"
            case "Rain And Snow":
                return "snowy-rainy"
            case "Rain":
                return "pouring"
            case "Snow":
                return "snowy"
            default:
                break;
        }
    }

    render() {
        const {
            condition
        } = this.props

        return <WeatherRowContainer>
            <Svg xmlns="http://www.w3.org/2000/svg" width="100" height="1"><Svg.Path d="M 0 0 L 100 0" fill="transparent" stroke="#AAA"></Svg.Path></Svg>
            <Icon name={`weather-${this.conditionToIcon(condition)}`}
                size={28}
                style={{ color: 'grey' }}
            ></Icon>
            <Svg xmlns="http://www.w3.org/2000/svg" width="100" height="1"><Svg.Path d="M 0 0 L 100 0" fill="transparent" stroke="#AAA"></Svg.Path></Svg>
        </WeatherRowContainer>
    }
}
