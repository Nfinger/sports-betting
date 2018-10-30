import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import styled from 'styled-components';

const StoryBoxContainer = styled.View`
    height: 138px;
    width: 120px;
    padding-top: 1px;
    padding-left: 10px;
    /* font-size: 18px; */
    /* font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */
    /* font-weight: bold; */
    background: rgba(255,255,255, 0.95);
    box-shadow: 0 10px 20px rgba(0,0,0, 0.25);
    border-radius: 15px;
`

const TitleText = styled.Text`
    font-size: 14px;
    font-weight: bold;
    text-decoration: underline;
    padding-left: 5%;
`

const LinkText = styled.Text`
    color: #474747;
    font-size: 10px;
    padding-left: 15%;
`

export class StoryBox extends React.Component {

    render() {
        return <StoryBoxContainer>
            <TitleText>{this.props.header}</TitleText>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArticlePage", {storyBody: this.props.body, storyHeader: this.props.header})}><LinkText>Read More</LinkText></TouchableOpacity>
            </StoryBoxContainer>;
    }
}