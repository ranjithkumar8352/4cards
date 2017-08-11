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
import StackCard from 'stack-card-z';

export default class StackCards extends Component {

    constructor(props){
        super(props);
        this.colors = ["#EF766F","#F9CA32","#80E7F3"]
    }

    render() {
        return (
            <View>
                <StackCard
                    data = {[1,2,3]}
                    onPress = {item => {}}
                    contentRender = {(item,i) => {
                        return (
                            <View style={[styles.slide1,{backgroundColor:this.colors[i]}]}>
                                <Text>{item}</Text>
                            </View>
                        );
                    }}
                />
            </View>
        );
    }
}
