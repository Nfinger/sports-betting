import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './SideMenu.style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components'

const IndentedItem = styled.TouchableOpacity `
  background-color: hsla(210, 100%, 50%, 0);
  border-bottom-width: 1;
  border-color: #222;
  border-left-width: 0;
  border-right-width: 0;
  border-style: solid;
  border-top-width: 1;
  overflow: visible;
  height: 7%;
  display: flex;
  padding-left: 7%;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
`

class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render () {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen('Home')}>
          <Icon name="home" style={styles.navItemText}></Icon><Text style={styles.navItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen('DailyHome')}>
          <Icon name="shield" style={styles.navItemText}></Icon><Text style={styles.navItemText}>Daily Fantasy</Text>
        </TouchableOpacity>
        <IndentedItem onPress={this.navigateToScreen('UpcomingEntries')}>
          <Icon name="shield" style={styles.navItemText}></Icon><Text style={styles.navItemText}>Upcoming Entries</Text>
        </IndentedItem>
        <IndentedItem onPress={this.navigateToScreen('LiveEntries')}>
          <Icon name="shield" style={styles.navItemText}></Icon><Text style={styles.navItemText}>Live Entries</Text>
        </IndentedItem>
        <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen('Research')}>
          <Icon name="book" style={styles.navItemText}></Icon><Text style={styles.navItemText}>Research</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;