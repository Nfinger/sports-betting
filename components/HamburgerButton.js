import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const HamburgerButton = (props) => (
    <Icon
        name='menu'
        size={28}
        style={{ color: '#fff' }}
        onPress={() => props.navigation.toggleDrawer()}
    ></Icon>
)