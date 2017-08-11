import React, {Component} from 'react';
import {View,Text,TouchableOpacity,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

export default class CustomHeader extends Component {
    render(){
        return (
            <View style={{backgroundColor:'transparent',flexDirection:'row',alignItems:'center',paddingRight:0,height:50}}>
                <TouchableOpacity style={{flex:0.3,paddingLeft:15}} onPress={Actions.pop} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                    <Icon name="ios-arrow-round-back-outline" style={{color:'#B5B5B5',fontSize:30,color:'white'}}/>
                </TouchableOpacity>
                <View style={{flex:0.3}}>
                    <Text style={{color:'white',fontSize:14,marginLeft:-12,paddingBottom:5,top:2,textAlign:'center'}}>{this.props.title}</Text>
                </View>
            </View>

        )
    }
}