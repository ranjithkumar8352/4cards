/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ViewPagerAndroid
} from 'react-native';
import Swiper from 'react-native-swiper';
import SwipeCards from './src/swipecards';
import StackCards from './src/stackcards';
import Home from './app/scenes/home';
import Main from './app/main';

export default class cards extends Component {

    render() {
        return (
            <Main />
        );
    }
}


AppRegistry.registerComponent('cards', () => cards);
