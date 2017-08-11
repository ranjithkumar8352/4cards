import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Dimensions, ScrollView, TextInput, StyleSheet,ActivityIndicator} from 'react-native';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import store from 'react-native-simple-store'
import LetterAvatar from '../components/letterAvatar';
import _ from 'lodash';

export default class SentencePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            word: props.word,
            sentenceText: "",
            sentences: [],
            loaded: false
        }
    }

    componentDidMount() {
        if (this.state.word) {
            store.get(this.state.word).then((sentences) => {
                if (sentences) {
                    this.setState({sentences: sentences});
                }
            });
            fetch('https://wordsapiv1.p.mashape.com/words/' + this.state.word + '/examples', {
                method: 'GET',
                headers: {
                    'X-Mashape-Key': 'GGpogF7ajimshInvNkLQiZnVQhwPp1FhAwyjsn3OIFRv8Lamlf'
                }
            }).then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.examples){
                        let newSentences = _.concat(responseJson.examples,this.state.sentences);
                        this.setState({sentences:newSentences,loaded:true});
                    }
                }).catch(()=>{
                this.setState({loaded:true});
            });

        }
    }

    renderSentences() {
        const sentenceList = this.state.sentences;
        if(!this.state.loaded){
            return (
                <ActivityIndicator/>
            )
        }
        else {
            return (
                sentenceList.map((sentence, index) =>{
                        const bgcolors = ["#ffcc66","#95dbdb","#ff9494","#94db95","#b9f8f0","#f1a3d7","#a4adb6","#f0dfb4","#6c7cb0","#96887D","#72c8a9"];
                        let bgcolor = bgcolors[Math.floor(Math.random()*bgcolors.length)];
                        return (
                            <View style={{flexDirection: 'row',marginTop:10,alignItems:'center'}} key={index}>
                                <View style={{paddingHorizontal: 10, flex: 0.1}}>
                                    <LetterAvatar name={sentence} color={bgcolor}/>
                                </View>
                                <View style={{flex: 0.9}}>
                                    <Text style={{color: '#777', fontSize: 14,padding:5}}>{sentence}</Text>
                                </View>
                            </View>
                        )
                    }
                ))
        }
    }

    dismissModal() {
        this.refs.modal.close();
    }

    renderButton() {
        if (this.state.sentenceText) {
            return (
                <TouchableOpacity onPress={() => this.postSentence()}>
                    <Text style={{
                        fontSize: 14,
                        borderColor: '#9050fe',
                        backgroundColor: '#9050FE',
                        borderWidth: 0.75,
                        textAlign: 'center',
                        paddingHorizontal: 30,
                        paddingVertical: 10,
                        color: 'white',
                        borderRadius: 20
                    }}>Post Sentence</Text>
                </TouchableOpacity>
            )
        }
    }

    postSentence() {
        if (this.state.sentenceText) {
            store.push(this.state.word, this.state.sentenceText).then(()=>{
                this.setState({sentenceText: ""});
                this.getSentences();
            }).catch(()=>{
                this.setState({sentenceText: ""});
            })
        }
    }

    getSentences() {
        store.get(this.state.word).then((sentences) => {
            if (sentences) {
                this.setState({sentences: sentences});
            }
        })
    }

    render() {
        let width = Dimensions.get('window').width * 100 / 100;
        let height = Dimensions.get('window').height * 70 / 100;
        let exampleText = <Text/>;
        if(this.state.loaded && this.state.sentences.length <= 0){
            exampleText = <Text style={{color: '#777', fontSize: 16,textAlign:'center',padding:5}}>No Examples yet! Be the first to post one</Text>
        }
        else if(this.state.loaded && this.state.sentences.length > 0){
            exampleText = <Text style={{color: '#777', fontSize: 16,textAlign:'center'}}>Examples</Text>
        }
        return (
            <Modal animationDuration={300} style={{width: width, height: height, justifyContent: 'center'}}
                   position="bottom" ref={"modal"} isOpen={true} swipeToClose={false} backdropPressToClose={false}
                   onClosed={Actions.pop}>
                <TouchableOpacity onPress={() => {
                    this.dismissModal()
                }}
                                  style={{position: 'absolute', top: 0, right: 0, paddingRight: 10}}><Icon
                    name="ios-close-outline" style={{fontSize: 34, color: '#777'}}/></TouchableOpacity>
                <ScrollView style={{marginTop: 20,flex:1}}>
                    <View style={styles.innerContainer}>
                        <Text style={{color: '#777', fontSize: 16}}>Make a funny sentence from this word so that you can
                            remember it</Text>
                        <View style={styles.inputContainer}>
                            <TextInput underlineColorAndroid="transparent" multiline={true} numberOfLines={2}
                                       onChangeText={(text) => {
                                           if (text.length <= 200) {
                                               this.setState({sentenceText: text});
                                           }
                                       }} value={this.state.sentenceText}/>

                        </View>
                        <Text style={{
                            color: '#ccc',
                            fontSize: 8,
                            textAlign: 'right',
                            marginBottom: 10
                        }}>{this.state.sentenceText ? 200 - this.state.sentenceText.length : 200}
                            characters</Text>
                        {this.renderButton()}
                    </View>
                    <View style={styles.hr}/>
                    <View style={styles.innerContainer1}>
                        <ScrollView>
                            {exampleText}
                            {this.renderSentences()}
                        </ScrollView>
                    </View>

                </ScrollView>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    innerContainer: {
        justifyContent: 'center',
        marginHorizontal: 20,
        paddingHorizontal: 20
    },
    innerContainer1: {
        justifyContent: 'center',
        marginTop: 10
    },
    inputContainer: {
        borderColor: '#ccc',
        marginTop: 10,
        borderRadius: 2,
        borderWidth: 0.75,
        alignSelf: 'stretch'
    },
    hr: {
        borderColor: '#ccc',
        borderBottomWidth: 0.5
    }
});