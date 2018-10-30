import React, { Component } from 'react'
import styled from 'styled-components';
import { FlexRow, FlexCol } from "../components/styled";

const SegmentedChoiceContainer = styled.View `
    height: 100px;
    margin-bottom: 10%;
    width: 345px;
`

const ChoiceLeft = styled.TouchableOpacity `
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-width: 1px;
    border-color: rgb(41, 139, 255);
    width: 50%;
    height: 100%;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
`

const ChoiceLeftSelected = styled.TouchableOpacity `
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(41, 139, 255);
    border-width: 1px;
    border-color: rgb(41, 139, 255);
    width: 50%;
    height: 100%;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
`

const ChoiceRight = styled.TouchableOpacity `
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-width: 1px;
    border-color: rgb(41, 139, 255);
    width: 50%;
    height: 100%;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
`

const ChoiceRightSelected = styled.TouchableOpacity `
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:rgb(41, 139, 255);
    border-width: 1px;
    border-color: rgb(41, 139, 255);
    width: 50%;
    height: 100%;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
`

const HeaderText = styled.Text`
    font-size: 24px;
    color: black;
`

const SelectedText = styled.Text`
    font-size: 18px;
    text-align: center;
    color: white;
`

const UnselectedText = styled.Text`
    font-size: 18px;
    text-align: center;
    color: rgb(41, 139, 255);
`

const AmountInput = styled.TextInput `
    width: 100%;
    height: 85%;
    border-radius: 5px;
    border-width: 1px;
    background-color: white;
    border-color: rgb(41, 139, 255);
    text-align: center;
`

const AmountText = styled.Text `
    font-size: 12px;
    text-align: center;
`

const AmountContainer = styled.View `
    height: 100%;
    width: 20%;
    margin-left: 2%;
    padding-top: 2%;
    display: flex;
    justify-content: flex-end;
    align-content: center;
`

export class SegmentedChoice extends Component {
    state = {
        selected: null
    }

    static defaultProps = {
        choices: Array
    }

    componentDidMount() {
        let selected = null
        this.props.choices.map((choice, idx) => {
            if (choice.selected) selected = idx
        })
        this.setState({ selected })
    }

    select = selected => {
        this.props.choices[selected].selected = true
        this.setState({ selected })
    }

    deselect = () => {
        this.props.choices.map(choice => {
            choice.selected = false;
            choice.amount = 0;
        })
        this.setState({selected: null})
    }

    handleAmount = amount => {
        this.props.choices.map(choice => {
            if (choice.selected) choice.amount = amount;
        })
    }

    render() {
        const {
            choices
        } = this.props
        const { selected } = this.state

        return <SegmentedChoiceContainer>
            <FlexRow>
                <FlexCol style={{width: "70%"}}>
                    <HeaderText>{choices[2]}</HeaderText>
                    <FlexRow style={{width: "100%"}}>
                        {selected !== 0 && 
                            <ChoiceLeft onPress={() => this.select(0)}>
                                <UnselectedText>{choices[0].title}</UnselectedText>
                                <UnselectedText>{choices[0].value}</UnselectedText>
                            </ChoiceLeft>
                        }
                        {selected === 0 && 
                            <ChoiceLeftSelected onPress={this.deselect}>
                                <SelectedText>{choices[0].title}</SelectedText>
                                <SelectedText>{choices[0].value}</SelectedText>
                            </ChoiceLeftSelected>
                        }
                        {selected !== 1 && 
                            <ChoiceRight onPress={() => this.select(1)}>
                                <UnselectedText>{choices[1].title}</UnselectedText>
                                <UnselectedText>{choices[1].value}</UnselectedText>
                            </ChoiceRight>
                        }
                        {selected === 1 && 
                            <ChoiceRightSelected onPress={this.deselect}>
                                <SelectedText>{choices[1].title}</SelectedText>
                                <SelectedText>{choices[1].value}</SelectedText>
                            </ChoiceRightSelected>
                        }
                    </FlexRow>
                </FlexCol>
                {selected !== null && <AmountContainer>
                    <AmountText>Amount</AmountText>
                    <AmountInput
                        
                        onChangeText={this.handleAmount}
                        value={choices[selected].amount}
                        placeholder="Enter Bet"
                        keyboardType="decimal-pad"
                    ></AmountInput>
                </AmountContainer>}
            </FlexRow>
        </SegmentedChoiceContainer>

    }
}