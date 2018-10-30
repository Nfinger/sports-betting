import React, { Component } from 'react'
import { Dimensions } from "react-native";
import styled from 'styled-components';
import { FlexRow, FlexCol } from "../components/styled";
import * as Animatable from 'react-native-animatable';

const width = Dimensions.get('window').width

const TabbedContainer = styled.View `
    height: 45px;
    /* margin-bottom: 10%; */
    width: 100%;
`

const Tab = styled.TouchableOpacity `
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    width: 50%;
    height: 100%;
`

const HeaderText = styled.Text`
    font-size: 18px;
    text-align: center;
    font-weight: bold;
    color: rgb(41, 139, 255);
`

export class TabbedHeader extends Component {

    static defaultProps = {
        Tabs: Array
    }

    select = selected => {
        this.props.handleSelectTab(selected)
        if (selected === 0) {
            this.view.transition({left: width / 2}, {left: 0})
        } else {
            this.view.transition({left: 0}, {left: width / 2})
        }
    }

    handleViewRef = ref => this.view = ref;

    render() {
        const {
            tabs
        } = this.props

        return <TabbedContainer>
            <FlexRow style={{width: "100%"}}>
                {tabs.map((tab, idx) => (
                    <Tab key={idx} onPress={() => this.select(idx)}>
                        <HeaderText>{tab.title}</HeaderText>
                    </Tab>
                ))}
                <Animatable.View style={{width: "50%", height: 3, backgroundColor: "rgb(41, 139, 255)", position: "absolute", bottom: 0}} ref={this.handleViewRef}></Animatable.View>
            </FlexRow>
        </TabbedContainer>

    }
}