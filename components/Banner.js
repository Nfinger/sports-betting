import * as React from "react";
import { Svg } from "expo";
import { Image, View, Text } from "react-native";
import styled from 'styled-components';

const TeamBannerContainer = styled.View`
    height: 90%;
    box-shadow: 0 10px 20px rgba(0,0,0, 0.25);
    display: flex;
    align-items: center;
`

export class TeamBanner extends React.Component {

    // Set default properties
    static defaultProps = {
        primaryColor: "white",
        secondaryColor: "black",
        logo: "",
        teamCity: "",
        teamName: ""
    }

    render() {
        const {
            primaryColor,
            secondaryColor,
        } = this.props
        return <TeamBannerContainer>
                <Svg width="165" height="590">
                    <Svg.Path d="M 165 590 L 82.5 544.34 L 0 590 L 0 39.908 C 0 17.867 9.234 0 20.625 0 L 144.375 0 C 155.766 0 165 17.867 165 39.908 Z" fill={secondaryColor}></Svg.Path>
                    <Svg.Path x={31} d="M 0 0 L 104 0 L 104 590 L 52 566.772 L 0 590 Z" fill={primaryColor}></Svg.Path>
                </Svg>
            </TeamBannerContainer>;
    }
}
