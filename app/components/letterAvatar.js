import React, {Component} from 'react';
import {View, Text} from 'react-native';

export default class LetterAvatar extends Component {

    shouldComponentUpdate(){
        return false;
    }

    render(){
        const letter = this.props.name? this.props.name.charAt(0): 'A';
        const bgcolors = ["#ffcc66","#95dbdb","#ff9494","#94db95","#ffa87d","#b9f8f0","#f1a3d7","#a4adb6","#f0dfb4","#6c7cb0","#96887D","#72c8a9"];
        const bgcolor = this.props.color ? this.props.color : bgcolors[Math.floor(Math.random()*bgcolors.length)];
        return (
            <View style={[styles.avatar,{backgroundColor:bgcolor}]}>
                <Text style={styles.letter}>{letter}</Text>
            </View>
        )
    }

}

const styles = {
    avatar: {height:30,width:30,borderRadius:15,justifyContent:'center',alignItems:'center'},
    letter: {color:'white',fontSize:14}
};