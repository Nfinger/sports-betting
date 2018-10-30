import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { DangerZone } from 'expo';
import styled from 'styled-components'

const { Lottie } = DangerZone;
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
const LoadingContainer = styled.View `
    height: 100px;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
`

export class Loader extends React.Component {
  state = {
    animation: null,
  };

  componentWillMount() {
    this._playAnimation();
  }

  render() {
    return (
      <LoadingContainer style={styles.animationContainer}>
        {this.state.animation &&
          <Lottie
            ref={animation => {
              this.animation = animation;
            }}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: 'white',
            }}
            source={this.state.animation}
          />}
      </LoadingContainer>
    );
  }

  _playAnimation = () => {
    if (!this.state.animation) {
      this._loadAnimationAsync();
    } else {
      this.animation.reset();
      this.animation.play();
    }
  };

  _loadAnimationAsync = async () => {
    // let result = await fetch(
    //   'https://cdn.rawgit.com/airbnb/lottie-react-native/635163550b9689529bfffb77e489e4174516f1c0/example/animations/Watermelon.json'
    // )
    //   .then(data => {
    //     return data.json();
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
    const result = require("../assets/animations/animation-w200-h200.json")
    this.setState({ animation: result }, this._playAnimation);
  };
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    display: "flex",
    height: "100%",
    width: "100%"
  },
  buttonContainer: {
    paddingTop: 20,
  },
});
