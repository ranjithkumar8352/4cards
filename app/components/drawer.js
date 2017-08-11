import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

export default class NavigationView extends Component {

    render() {
        return (
            <ScrollView style={{flex:1,backgroundColor:'#9050FE'}}>
                <View style={{justifyContent:'center',alignItems:'center',borderBottomWidth: 0.5,marginHorizontal:15,borderColor:'white'}}>
                    <Image source={require('../images/minion.png')}
                           style={{height: 175, width: 150}}/>
                </View>
                <View style={{flexDirection: 'column',margin:10}}>
                    <TouchableOpacity style={styles.itemContainer} onPress={Actions.previousCards}>
                        <Icon name="ios-browsers-outline" style={styles.iconStyle}/>
                        <Text style={styles.textStyle}>View All Cards</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemContainer} onPress={Actions.quiz}>
                        <Icon name="ios-chatboxes-outline" style={styles.iconStyle}/>
                        <Text style={styles.textStyle}>Take Quiz</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemContainer} onPress={()=>alert("Please rate us when we are on play store!")}>
                        <Icon name="ios-star-outline" style={styles.iconStyle}/>
                        <Text style={styles.textStyle}>Show some love</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    iconStyle: {
        padding: 10,
        fontSize: 23,
        color: 'white'
    },
    textStyle: {
        paddingHorizontal: 5,
        fontSize: 13,
        color:'white'
    },
    itemContainer: {
        flexDirection: 'row',alignItems:'center',marginVertical:2
    }
});