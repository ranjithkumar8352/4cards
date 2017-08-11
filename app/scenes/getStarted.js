import React, {Component} from 'react';
import {View,Text,Image,TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import store from 'react-native-simple-store';

export default class GetStarted extends Component{
  render(){
      return (
          <View style={{flex:1,backgroundColor:'#9050FE',justifyContent:'space-around',alignItems:'center',paddingVertical:10}}>
              <Text style={{paddingHorizontal:20,color:'white',textAlign:'center'}}>Most simple & fun way to improve english vocabulary</Text>
              <Image source={require('../images/intro-minion.png')} style={{width:200,height:200}} />
              <Text style={{paddingHorizontal:20,color:'white',textAlign:'center'}}>Most simple & fun way to improve english vocabulary</Text>
              <TouchableOpacity onPress={()=>{store.save('introShown',true).then(()=>Actions.splash({type:'reset'}))}}>
                  <Text style={{
                      fontSize: 14,
                      borderColor: 'white',
                      backgroundColor: '#9050FE',
                      borderWidth: 0.75,
                      textAlign: 'center',
                      paddingHorizontal: 30,
                      paddingVertical: 10,
                      color: 'white',
                      borderRadius: 20
                  }}>Get started</Text>
              </TouchableOpacity>

          </View>
      )
  }
};