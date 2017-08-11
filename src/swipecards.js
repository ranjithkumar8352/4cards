'use strict';

import React, {Component} from 'react';
import {Dimensions, StyleSheet, Text, View, Animated, PanResponder, Image, TouchableOpacity} from 'react-native';
import clamp from 'clamp';
import {Actions} from 'react-native-router-flux';
import tts from "react-native-android-speech";
import {localData} from '../app/utils/localData';
import moment from 'moment';
import {getSingleCard} from "../app/utils/utils";
import store from 'react-native-simple-store';


// How far the swipe need to go for a yes/ no to fire
var SWIPE_THRESHOLD = 120;
// To get the stack effect the lower card must pick out at the bottom and appear smaller
var NEXT_CARD_POSITION_OFFSET = 8;
var NEXT_CARD_SIZE_OFFSET = 16;


class Card extends Component {

    constructor(props) {
        super(props);
        this.state = {
            speaking: false,
            index: props.index,
            unlocked: props.unlocked ? true : false,
        };
    }

    componentDidMount() {
        if (this.props.unlockTime != "") {
            localData.timers['countdown' + this.props.index] = setInterval(function () {
                if (moment().isSameOrAfter(moment(this.props.unlockTime, 'hh:mm:ss'))) {
                    /*store.get('allWords').then((allWords)=>{
                        localData.todayCards[this.props.index - 1] = getSingleCard(allWords,1);
                    });*/
                    clearInterval(this.countdown);
                    for (var key in localData.timers) {
                        if (localData.timers.hasOwnProperty(key)) {
                            clearInterval(localData.timers[key]);
                        }
                    }

                    Actions.splash({type: 'reset'});
                }
                else {
                    let timeLeft = moment(this.props.unlockTime, 'hh:mm:ss').diff(moment(), 'seconds');
                    if (timeLeft) {
                        this.setState({timeLeft: this.fancyTimeFormat(timeLeft)});
                    }
                }
            }.bind(this), 1000);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.unlocked) {
            this.setState({unlocked: true});
        }
        else {
            this.setState({unlocked: false});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    pronounce(word) {
        if (word) {
            tts.speak({
                text: word, // Mandatory
                pitch: 1.5, // Optional Parameter to set the pitch of Speech,
                forceStop: false, //  Optional Parameter if true , it will stop TTS if it is already in process
                language: 'en', // Optional Paramenter Default is en you can provide any supported lang by TTS
                country: 'IN' // Optional Paramenter Default is null, it provoques that system selects its default
            }).then(isSpeaking => {
                //Success Callback
                this.animTimer = setInterval(function () {
                    this.setState({speaking: !this.state.speaking})
                }.bind(this), 200);
                setTimeout(function () {
                    clearInterval(this.animTimer);
                }.bind(this), 1000);
            }).catch(error => {
                //Errror Callback
                console.log(error)
            });
        }
    }

    renderBody() {
        if (this.state.unlocked) {
            return (
                <View style={{flex: 1, padding: 20, alignItems: 'center'}}>
                    <View style={{flex: 0.7, alignItems: 'center'}}>
                        <View style={{
                            borderWidth: 0.5,
                            borderColor: 'white',
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{color: 'white', fontSize: 12}}>{this.props.index}</Text>
                        </View>
                        <Text style={{
                            color: 'white',
                            paddingVertical: 10,
                            fontSize: 22,
                            textAlign: 'center'
                        }}>{this.props.name ? this.props.name.toUpperCase() : ""}</Text>
                        <Text style={{
                            color: 'white',
                            paddingVertical: 10,
                            fontSize: 14,
                            textAlign: 'center'
                        }}>{this.props.description}</Text>
                        <Text style={{
                            color: 'white',
                            paddingVertical: 10,
                            fontSize: 12,
                            textAlign: 'center',
                            fontStyle: 'italic'
                        }}>{'Synonyms : ' + (this.props.synonyms ? this.props.synonyms.join(", ") : "")}</Text>
                        <Text style={{
                            color: 'white',
                            marginTop: 20,
                            paddingVertical: 10,
                            fontSize: 20,
                            textAlign: 'center'
                        }}>{this.props.translation ? this.props.translation : ""}</Text>
                    </View>
                    <TouchableOpacity style={{flex: 0.3, alignItems: 'center'}} onPress={() => {
                        Actions.sentencePopup({word: this.props.name})
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 10,
                            textAlign: 'center',
                            borderWidth: 0.5,
                            borderColor: 'white',
                            paddingVertical: 5,
                            paddingHorizontal: 20,
                            borderRadius: 15
                        }}>Make sentence</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pronounce(this.props.name)}
                                      style={{position: 'absolute', bottom: 0}}>
                        {this.renderAvatar()}
                    </TouchableOpacity>
                </View>
            )
        }
        else {
            return (
                <View style={{flex: 1, padding: 20, alignItems: 'center'}}>
                    <View style={{
                        borderWidth: 0.5,
                        borderColor: 'white',
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{color: 'white', fontSize: 12}}>{this.props.index}</Text>
                    </View>
                    <View style={{flex: 0.8, justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 10}}>Unlocks
                            at {moment(this.props.unlockTime, 'HH:mm:ss').format('hh:mm A')}</Text>
                        <Text style={{color: 'white', fontSize: 22, textAlign: 'center'}}>{this.state.timeLeft}</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.pronounce(this.props.name)}
                                      style={{position: 'absolute', bottom: 0}}>
                        {this.renderAvatar()}
                    </TouchableOpacity>
                </View>
            )
        }
    }

    fancyTimeFormat(time) {
        // Hours, minutes and seconds
        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    renderAvatar() {
        if (this.state.speaking) {
            return (<Image source={require('../app/images/minion-open-mouth.png')}
                           style={{height: 70, width: 70}}/>)
        } else {
            return (
                <Image source={require('../app/images/minion-close-mouth.png')}
                       style={{height: 70, width: 70}}/>
            )
        }
    }

    render() {
        return (
            <View style={styles.cardResizeContainer}>
                <Animated.View style={[styles.cardContainer, this.props.animatedCardContainerStyles]}>
                    <Animated.View style={[styles.card, this.props.animatedCardStyles, {
                        backgroundColor: this.props.color,
                        alignItems: 'center'
                    }]} {...this.props.panResponder}>
                        {this.renderBody()}
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }
}

export default class SwipeCards extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pan: new Animated.ValueXY(),
            cards: localData.todayCards,
            currentPosition: 0,
        };
        this.resetCards = this.resetCards.bind(this);
    }

    componentWillMount() {

    }

    resetCards(cards) {
        this.setState({cards: cards});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    // we use a circular queue
    _goToNextPerson() {
        let nextPosition = (this.state.currentPosition + 1) % this.state.cards.length;
        this.setState({currentPosition: nextPosition});
    }

    componentDidMount() {
        //this._animateEntrance();
        for (let i = 0; i < this.state.cards.length; i++) {
            if (this.state.cards[i].name) {
                let formdata = {q: this.state.cards[i].name, target: "hi"};
                fetch('https://translation.googleapis.com/language/translate/v2?key=AIzaSyC7BWlMsBOAv4I2BB5KqDZrSz-GM0ZFiik', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formdata)
                }).then((response) => response.json())
                    .then((responseJson) => {
                        let tempCards = this.state.cards;
                        tempCards[i].translation = responseJson.data.translations[0].translatedText;
                        this.setState({cards: tempCards});
                    })
            }
        }
    }

    _animateEntrance() {
        // Animated.timing(this.state.nextCardOpacity, {
        //          toValue: 1,
        //    }).start()
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: (e, gestureState) => {
                this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
                this.state.pan.setValue({x: 0, y: 0});
            },

            onPanResponderMove: Animated.event([
                null, {dx: this.state.pan.x, dy: this.state.pan.y},
            ]),

            onPanResponderRelease: (e, {vx, vy}) => {
                this.state.pan.flattenOffset();
                var velocity;

                if (vx >= 0) {
                    velocity = clamp(vx, 3, 5);
                } else if (vx < 0) {
                    velocity = clamp(vx * -1, 3, 5) * -1;
                }

                if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
                    Animated.decay(this.state.pan, {
                        velocity: {x: velocity, y: vy},
                        deceleration: 0.99
                    }).start(this._resetState.bind(this))
                } else {
                    Animated.spring(this.state.pan, {
                        toValue: {x: 0, y: 0},
                        friction: 4
                    }).start()
                }
            }
        })
    }

    _resetState() {
        this.state.pan.setValue({x: 0, y: 0});
        this._goToNextPerson();
    }

    render() {
        let {pan, cards, currentPosition} = this.state;

        let [translateX, translateY] = [pan.x, pan.y];

        // card 0 animation
        let rotate = pan.x.interpolate({inputRange: [-240, 0, 240], outputRange: ["-20deg", "0deg", "20deg"]});

        let animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}]};

        let yupOpacity = pan.x.interpolate({
            inputRange: [0, SWIPE_THRESHOLD],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        });
        let animatedYupStyles = {opacity: yupOpacity}

        let nopeOpacity = pan.x.interpolate({
            inputRange: [-SWIPE_THRESHOLD, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });
        let animatedNopeStyles = {opacity: nopeOpacity}

        let card0AnimatedStyles = {
            animatedCardStyles: animatedCardStyles,
            animatedNopeStyles: animatedNopeStyles,
            animatedYupStyles: animatedYupStyles
        }

        // card 1 animation
        let card1BottomTranslation = pan.x.interpolate({
            inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
            outputRange: [0, NEXT_CARD_POSITION_OFFSET + NEXT_CARD_SIZE_OFFSET, 0],
            extrapolate: 'clamp'
        });
        let card1SideTranslation = pan.x.interpolate({
            inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
            outputRange: [0, NEXT_CARD_SIZE_OFFSET, 0],
            extrapolate: 'clamp'
        });
        let card1TopTranslation = pan.x.interpolate({
            inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
            outputRange: [0, NEXT_CARD_POSITION_OFFSET + NEXT_CARD_SIZE_OFFSET, 0],
            extrapolate: 'clamp'
        });
        let card1TranslationStyles = {
            top: card1TopTranslation,
            bottom: card1BottomTranslation,
            left: card1SideTranslation,
            right: card1SideTranslation
        }
        let card1AnimatedStyles = {
            animatedCardContainerStyles: card1TranslationStyles
        }

        // card 2 animation
        let card2BottomTranslation = pan.x.interpolate({
            inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
            outputRange: [NEXT_CARD_POSITION_OFFSET + NEXT_CARD_SIZE_OFFSET, (NEXT_CARD_POSITION_OFFSET + NEXT_CARD_SIZE_OFFSET) * 2, NEXT_CARD_POSITION_OFFSET + NEXT_CARD_SIZE_OFFSET],
            extrapolate: 'clamp'
        });
        let card2SideTranslation = pan.x.interpolate({
            inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
            outputRange: [NEXT_CARD_SIZE_OFFSET, NEXT_CARD_SIZE_OFFSET * 2, NEXT_CARD_SIZE_OFFSET],
            extrapolate: 'clamp'
        });
        let card2TopTranslation = pan.x.interpolate({
            inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
            outputRange: [NEXT_CARD_POSITION_OFFSET + NEXT_CARD_SIZE_OFFSET, (NEXT_CARD_POSITION_OFFSET + NEXT_CARD_SIZE_OFFSET) * 2, NEXT_CARD_POSITION_OFFSET + NEXT_CARD_SIZE_OFFSET],
            extrapolate: 'clamp'
        });
        let card2TranslationStyles = {
            top: card2TopTranslation,
            bottom: card2BottomTranslation,
            right: card2SideTranslation,
            left: card2SideTranslation
        }
        let card2AnimatedStyles = {
            animatedCardContainerStyles: card2TranslationStyles
        }

        let card3AnimatedStyles = {
            animatedCardContainerStyles: {
                top: (NEXT_CARD_POSITION_OFFSET + NEXT_CARD_SIZE_OFFSET) * 2,
                bottom: (NEXT_CARD_POSITION_OFFSET + NEXT_CARD_SIZE_OFFSET) * 2,
                right: NEXT_CARD_SIZE_OFFSET * 2,
                left: NEXT_CARD_SIZE_OFFSET * 2
            }
        }


        let person0 = cards[currentPosition];
        let person1 = cards[(currentPosition + 1) % cards.length];
        let person2 = cards[(currentPosition + 2) % cards.length];
        let person3 = cards[(currentPosition + 3) % cards.length];


        // if the layout appears a little strange. it was born out of the trickiness in doing the following
        // at the same time ...

        // 1. the card should always appear on top when being dragged so needs to be rendered near the end
        // (at least after the buttons)
        // 2. the layout should be responsive
        // 3. the buttons need to work ofc - we have to be careful about rendering a view on top of them

        // also note that we render 4 cards for the 'stack' effect. while dragging 3 cards appear under
        // (but only 2 cards at pan=0)

        return (
            <View style={styles.bodyContainer}>
                <View style={styles.responsiveContainer}>

                    <View style={styles.cardsContainer}>
                        <Card key={4} {...person3} {...card3AnimatedStyles} resetCards={this.resetCards}/>
                        <Card key={3} {...person2} {...card2AnimatedStyles} resetCards={this.resetCards}/>
                        <Card key={2} {...person1} {...card1AnimatedStyles} resetCards={this.resetCards}/>
                        <Card key={1} {...person0} {...card0AnimatedStyles}
                              panResponder={this._panResponder.panHandlers} resetCards={this.resetCards}/>
                    </View>

                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    // main container
    bodyContainer: {
        flex: 1,
        //margin: 10,
        /*backgroundColor: '#806DFB',*/
    },

    // we keep the bottom button sections at height 100
    // the card expands to take up all the rest of the space
    responsiveContainer: {
        flex: 1,
        paddingBottom: 10,
    },

    // cards
    cardsContainer: {
        flex: 1,
    },

    cardResizeContainer: {
        width: Dimensions.get('window').width * 75 / 100,
        position: 'absolute',
        top: 0,
        left: Dimensions.get('window').width * 8 / 100,
        bottom: 10,
        right: Dimensions.get('window').width * 10 / 100,
    },

    cardContainer: {
        width: Dimensions.get('window').width * 75 / 100,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'flex-end',
    },

    card: {
        position: 'relative',
        borderColor: 'transparent',
        borderWidth: 1,
        borderRadius: 8,
        flex: 1,
        //overflow: 'hidden',
        shadowRadius: 2,
        shadowColor: '#BBB',
        shadowOpacity: 0.8,
        shadowOffset: {
            height: 1,
            width: 0,
        }
    }

});


module.exports = SwipeCards