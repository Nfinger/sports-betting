import React, {Component} from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import styled from 'styled-components';
import { styles } from "../constants/styles";

const TitleText = styled.Text `
    font-size: 20px;
    text-decoration: underline;
`

const TitleContainer = styled.View `
    width: 100%;
    padding-bottom: 3%;
`

const StoryText = styled.Text `
    font-size: 14px;
`

const Container = styled.View `
    width: 100%;
`

const StoryContainer = styled.View `
    height: 100%;
    width: 100%;
    margin: 5%;
`

const TopBarText = styled.Text `
    color: white;
    font-size: 18px;
`

export class ArticlePage extends Component {
    render() {
        const {
            navigation: {
                state: {
                    params
                }
            }
        } = this.props
        return <Container>
            <Header
                outerContainerStyles={{ height: 90 }}
                backgroundColor={styles.primaryColor}
                leftComponent={<TouchableOpacity onPress={() => this.props.navigation.goBack()}><TopBarText>Back</TopBarText></TouchableOpacity>}
                // centerComponent={{
                //     text: params.storyHeader,
                //     style: { color: '#fff', fontSize: 22 }
                // }}
            />
            <StoryContainer>
                <TitleContainer>
                    <TitleText>{params.storyHeader}</TitleText>
                </TitleContainer>
                <StoryText>{params.storyBody}</StoryText>
            </StoryContainer>
        </Container>
    }
}