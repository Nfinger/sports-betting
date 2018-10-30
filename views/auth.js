import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TextInput,
  AsyncStorage
} from "react-native";
import { Button } from "react-native-elements";
import { graphql, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import { Loader } from '../components/Loading'
import { Font } from "expo";
import Icon from "react-native-vector-icons/FontAwesome";
import styled from 'styled-components';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const BG_IMAGE = require("../assets/images/bg_screen1.jpg");

const LOGIN_USER_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      id
      token
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    signupUser(email: $email, password: $password) {
      id
      token
    }
  }
`;

const CreateAccountButton = styled.Button `
  background: rgba(255, 255, 255, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: white;
`

const ActionButtonView = styled.View `
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Input = styled.TextInput `
  color: white;
  width: 100%;
  height: 50px;
  border-bottom-width: 1px;
  border-color: white;
  border-style: solid;
  padding-left: 20%;
`
const InputContainer = styled.View `
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`

class AuthScreen extends Component {
  state = {
    email: "",
    email_valid: true,
    password: "",
    login_failed: false,
    showLoading: false,
    signup: false
  };

  async componentDidMount() {
    const token = await AsyncStorage.getItem('token')
    if (token) this.props.navigation.navigate("Home")
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  submitLoginCredentials = async (client) => {
    const { email, password, showLoading, signup } = this.state;
    const mutation = signup ? CREATE_USER_MUTATION : LOGIN_USER_MUTATION
    const key = signup ? 'signupUser' : 'authenticateUser'
    this.setState({ showLoading: true });
    // Simulate an API call
    const {data} = await client.mutate({
      mutation,
      variables: { email, password },
    })
    console.log(data)
    if (data.authenticateUser.token) {
      this.setState({
        showLoading: false
      });
      await AsyncStorage.setItem("token", data.authenticateUser.token);
      this.props.navigation.navigate("Home")
    }
  };

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  submitLoginCredentials() {
    const { showLoading } = this.state;

    this.setState({
      showLoading: !showLoading
    });
  }

  handleText = (value) => console.log(value)

  render() {
    const { email, password, email_valid, showLoading, signup } = this.state;

    return (
      <View style={styles.container}>
        <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
          <View style={styles.loginView}>
            <View style={styles.loginTitle}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.travelText}>Bet</Text>
                <Text style={styles.plusText}>The</Text>
              </View>
              <View style={{ marginTop: -10 }}>
                <Text style={styles.travelText}>HOUSE</Text>
              </View>
            </View>
            <View style={styles.loginInput}>
              <InputContainer>
                  <Icon
                      name="user-o"
                      color="rgba(255, 255, 255, 1)"
                      size={25}
                      style={{position: "absolute", left: 10}}
                  />
                  <Input
                      placeholder="Email"
                      placeholderTextColor="white"
                      keyboardType="email-address"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                          this.setState({ email_valid: this.validateEmail(email) });
                          this.passwordInput.focus();
                      }}
                      errorStyle={{ textAlign: "center", fontSize: 12 }}
                      errorMessage={
                          email_valid ? null : "Please enter a valid email address"
                      }
                      autoFocus={false}
                      autoCapitalize="none"
                      autoCorrect={false}
                      name='email'
                      onChangeText={email => this.setState({ email })}
                  />
              </InputContainer>
              <InputContainer>
                      {email}
                  <Icon
                      name="lock"
                      color="rgba(255, 255, 255, 1)"
                      size={25}
                      style={{position: "absolute", left: 10}}
                  />
                  <Input
                      placeholder="Password"
                      placeholderTextColor="white"
                      secureTextEntry={true}
                      name='password'
                      onChangeText={password => this.setState({ password })}
                  />
              </InputContainer>
            </View>
            <ActionButtonView>
              <ApolloConsumer>
                {(client) => (
                  <Button
                      title={signup ? "SIGN UP" : "LOG IN"}
                      activeOpacity={1}
                      underlayColor="transparent"
                      onPress={() => this.submitLoginCredentials(client)}
                      loading={showLoading}
                      loadingProps={{ size: "small", color: "white" }}
                      disabled={!email_valid && password.length < 8}
                      buttonStyle={{
                      height: 50,
                      width: 250,
                      backgroundColor: "transparent",
                      borderWidth: 2,
                      borderColor: "white",
                      borderRadius: 30
                      }}
                      containerStyle={{ marginVertical: 10 }}
                      titleStyle={{ fontWeight: "bold", color: "white" }}
                  />
                )}
              </ApolloConsumer>
            </ActionButtonView>
            <View style={styles.footerView}>
              <Text style={{ color: "grey" }}>New here?</Text>
                  <CreateAccountButton
                      title={signup ? "Log In" : "Create An Account"}
                      color="white"
                      onPress={() => this.setState({signup: !signup})}
                  />
                )}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center"
  },
  loginView: {
    marginTop: 150,
    backgroundColor: "transparent",
    width: 250,
    height: 400
  },
  loginTitle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  travelText: {
    color: "white",
    fontSize: 30,
    fontFamily: "bold"
  },
  plusText: {
    color: "white",
    fontSize: 30,
    fontFamily: "regular"
  },
  loginInput: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  footerView: {
    marginTop: 20,
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  }
});
export default AuthScreen;
