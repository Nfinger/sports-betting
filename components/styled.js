import styled from 'styled-components'

export const FlexRow = styled.View `
    display: flex;
    flex-direction: row;
    align-items: center;
`

export const FlexRowCentered = styled.View `
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

export const FlexCol = styled.View `
    display: flex;
    flex-direction: column;
`

export const BetDrawerHeader = styled.TouchableWithoutFeedback `
    padding-top: 5%;
    height: 40%;
    display:flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(225, 225, 225, 1);
    border-radius: 15px;
`

export const BetDrawerBody = styled.View `
    height: 100%;
    background-color: rgba(240, 240, 240, 0.75);
    display: flex;
    align-items: center;
`

export const HeaderTextView = styled.View `
    width: 100%;
    height: 80px;
    padding-top: 5%;
    padding-right: 2%
    background-color: rgba(225, 225, 225, 1);
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
`

export const BetDrawerHeaderText = styled.Text `
    color: black;
    font-size: 16px;
    text-align: center;
`

export const BetTile = styled.View `
    margin: 2%;
    width: 95%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(255, 255, 255, 1);
`

export const AmountText = styled.Text `
    color: green;
    font-size: 18px;   
`