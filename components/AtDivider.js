import * as React from "react";
import { Svg } from "expo";
import styled from "styled-components"

const AtDividerContainer = styled.View `
    height: 185px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const AtSymbol = styled.Text `
    color: rgb(170, 170, 170);
    font-size: 20px;
    font-weight: bold;
`

export class AtDivider extends React.Component {

    render() {
        return <AtDividerContainer>
            <Svg xmlns="http://www.w3.org/2000/svg" width="1" height="89">
                <Svg.Path d="M 0.25 0 L 0 63.678 L 0.25 89" fill="transparent" stroke="#AAA"></Svg.Path>
            </Svg>
            <AtSymbol>@</AtSymbol>
            <Svg xmlns="http://www.w3.org/2000/svg" width="1" height="49">
                <Svg.Path d="M 0 49 L 0 0" fill="transparent" stroke="#AAA"></Svg.Path>
            </Svg>
        </AtDividerContainer>
        
    }
}
