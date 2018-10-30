import * as React from "react";
import { View } from "react-native";
import { Text } from "react-native-elements"
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WeatherContainer = styled.View`
    height: 138px;
    width: 120px;
    padding-top: 1px;
    padding-left: 10px;
    background: rgba(255,255,255, 0.95);
    box-shadow: 0 10px 20px rgba(0,0,0, 0.25);
    border-radius: 15px;

    .underline {
        text-decoration-line: underline;
        /* font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */
    }

    .temp {
        color: #474747;
        font-size: 10px;
    }
`

const TitleText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    text-decoration: underline;
    padding-left: 5%;
`


export class Weather extends React.Component {
    // Icon Names
    // weather-cloudy
    // fog
    // hail
    // lightning
    // lightning-rainy
    // partlycouldy
    // pouring
    // rainy
    // snowy
    // sunny
    // windy-variant

    // DB names
    // Thunderstorms
    // Partly Cloudy
    // Sunny
    // Scattered Thunderstorms
    // Mostly Cloudy

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
            case "Mostly Cloudy":
                return "windy-variant"
            default:
                break;
        }
    }
    

    render() {
        const {
            condition,
            temperature
        } = this.props
        return <WeatherContainer>
            <TitleText>Weather</TitleText>
            <Icon name={`weather-${this.conditionToIcon(condition)}`}
                size={28}
                style={{ color: 'grey' }}
            ></Icon>
            <Text>{condition}</Text>
            <Text className="temp">{temperature}˚F</Text>
        </WeatherContainer>;
    }
}
