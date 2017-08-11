import React, {Component} from 'react';
import {View, Text,FlatList,ActivityIndicator} from 'react-native';
import FlipCard from 'react-native-flip-card';
import _ from "lodash";
import words from '../data.json';
import CustomHeader from '../components/customHeader';
import store from 'react-native-simple-store';

export default class PreviousCards extends Component {

    constructor(props){
        super(props);
        this.state = {
            list : [],
            loaded: false
        };
        this.colorList = ["#F9CA32","#F0776F","#82E6F3","#ffcc66","#95dbdb","#ff9494","#94db95","#ffa87d","#72c8a9","#f1a3d7","#a4adb6","#f0dfb4","#6c7cb0"];
    }

    getColor(index){
        if(index < 10){
            return this.colorList[index];
        }
        else {
            return this.colorList[index.toString()[index.toString().length - 1]];
        }
    };

    componentDidMount(){
        store.get('allWords').then((allWords)=>{
            if(allWords){
                let filteredData = _.filter(allWords, function(o) { return o.completed; });
                this.setState({list:filteredData,loaded:true});
            }
        });
    }

    render() {
        if(this.state.loaded) {
            return (
                <View style={{flex:1, backgroundColor: '#9050FE'}}>
                    <CustomHeader title={this.state.list.length +  ' Cards'}/>
                    <View style={{flex: 1}}>
                        <FlatList
                            data={this.state.list}
                            keyExtractor={(item,index)=>{return index}}
                            renderItem={(word) => {
                                let color = this.getColor(word.index);
                                return (
                                    <FlipCard flipHorizontal={true} flipVertical={false} style={{marginBottom:10,borderWidth:0,borderRadius:8,height:200,backgroundColor:color,marginHorizontal:15}}>
                                        <View style={{alignItems:'center',justifyContent:'center',flex:1,padding:10}}>
                                            <Text style={{color:'white',fontSize:24}}>{word.item.name.toUpperCase()}</Text>
                                        </View>
                                        <View style={{alignItems:'center',justifyContent:'center',flex:1,padding:10}}>
                                            <Text style={{color: 'white', paddingVertical: 10, fontSize: 14, textAlign: 'center'}}>{word.item.description}</Text>
                                            <Text style={{
                                                color: 'white',
                                                paddingVertical: 10,
                                                fontSize: 12,
                                                textAlign: 'center',
                                                fontStyle: 'italic'
                                            }}>{'Synonyms : ' + word.item.synonyms.join(", ")}</Text>
                                        </View>
                                    </FlipCard>
                                )
                            }
                            }
                        />
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={{flex:1, backgroundColor: '#806DFB'}}>
                    <CustomHeader title="Previous cards"/>
                    <ActivityIndicator color="white"/>
                </View>
            )
        }
    }

}