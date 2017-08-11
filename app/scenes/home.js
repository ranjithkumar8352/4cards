import React, {Component} from 'react';
import {
    View,
    Dimensions,
    TouchableOpacity,
    Text,
    DrawerLayoutAndroid
} from 'react-native';

import SwipeCards from '../../src/swipecards';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationView from '../components/drawer';
import moment from 'moment';
import {localData} from "../utils/localData";

export default class Home extends Component {

    componentDidMount(){
        //console.log(localData.allWords);
    }

    openDrawer() {
        this.refs.drawer.openDrawer();
    }

    render() {
        var formattedDate = moment().format('ddd, DD MMM');
        return (
            <DrawerLayoutAndroid
                drawerWidth={250}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref="drawer"
                renderNavigationView={() => <NavigationView />}
            >
                <View style={{flex: 1, backgroundColor: '#9050FE'}}>
                    <View style={{
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 50
                    }}>
                        <TouchableOpacity onPress={()=>this.openDrawer()} style={{flex:0.3,paddingLeft: 15}} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                            <Icon name="ios-menu" style={{color: '#F4F4F4', paddingLeft: 5, fontSize: 24}}/>
                        </TouchableOpacity>
                        <Text style={{color: '#F4F4F4', fontSize: 12, textAlign: 'center',flex:0.3}}>{formattedDate}</Text>
                        <View style={{flex:0.2}}/>
                    </View>
                    <View>

                    </View>
                    <SwipeCards/>
                </View>
            </DrawerLayoutAndroid>
        );
    }
}

let width = Dimensions.get('window').width * 75 / 100;
let height = Dimensions.get('window').height * 80 / 100;

{/*
<View style={{backgroundColor:'transparent',flexDirection:'row',alignItems:'center',shadowColor:'#000',height:50}}>
    <View style={{flex:0.5,paddingLeft:10}}>
        <TouchableOpacity>
            <Icon name="ios-menu" style={{color: '#f4f4f4', fontSize: 24}}/>
        </TouchableOpacity>
    </View>
    <View>
        <Text style={{
            color: '#f4f4f4',
            fontSize: 12,
            textAlign: 'center',
            right: 15
        }}>Tue, 8 August</Text>
    </View>
</View>*/
}
