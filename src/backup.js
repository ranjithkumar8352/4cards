'use strict';

import React, {Component} from 'react';
import { Dimensions, StyleSheet, Text, View, Animated, PanResponder, Image, TouchableHighlight} from 'react-native';
import clamp from 'clamp';

const Persons = [
    {name: 'Albert Einstein', image: 'http://www.deism.com/images/Einstein_laughing.jpeg'},
    {name: 'The Beast', image: 'http://vignette2.wikia.nocookie.net/marveldatabase/images/4/43/Henry_McCoy_(Earth-10005)_0002.jpg/revision/latest?cb=20091116202257'},
    {name: 'Me', image: 'https://avatars0.githubusercontent.com/u/1843898?v=3&s=460'},
    {name: 'HellBoy', image: 'http://www.flickeringmyth.com/wp-content/uploads/2014/06/Ron-Perlman-as-Hellboy.jpg'}
]

// How far the swipe need to go for a yes/ no to fire
var SWIPE_THRESHOLD = 120;
// To get the stack effect the lower card must pick out at the bottom and appear smaller
var NEXT_CARD_POSITION_OFFSET = 4;
var NEXT_CARD_SIZE_OFFSET = 8;

class Card extends Component {
    render() {
        return (
            <View style={styles.cardResizeContainer}>
                <Animated.View style={[styles.cardContainer, this.props.animatedCardContainerStyles]}>
                    <Animated.View style={[styles.card, this.props.animatedCardStyles]} {...this.props.panResponder}>
                        <Image source={{uri: this.props.image}} style={styles.cardImage}>
                            <Animated.View style={[styles.cardImageTextContainer, styles.cardImageYupContainer, this.props.animatedYupStyles]}>
                                <Text style={[styles.cardImageText, styles.cardImageYupText]}>LOVE</Text>
                            </Animated.View>
                            <Animated.View style={[styles.cardImageTextContainer, styles.cardImageNopeContainer, this.props.animatedNopeStyles]}>
                                <Text style={[styles.cardImageText, styles.cardImageNopeText]}>NEIN</Text>
                            </Animated.View>
                        </Image>
                        <View style={styles.cardLabelContainer}>
                            <Text style={styles.name}>{this.props.name}</Text>
                            <Text style={styles.value}>100$</Text>
                        </View>
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }
}

class SwipeCards extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pan: new Animated.ValueXY(),
            cards: Persons,
            currentPosition: 0,
        }
    }

    // we use a circular queue
    _goToNextPerson() {
        let nextPosition = (this.state.currentPosition + 1) % this.state.cards.length
        this.setState({currentPosition: nextPosition});
    }

    componentDidMount() {
        this._animateEntrance();
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

    handleNopePress() {
        let screenwidth = Dimensions.get('window').width;
        let panlength = screenwidth + 100

        Animated.timing(this.state.pan, {
            toValue: {x: -panlength, y: 0}
        }).start(this._resetState.bind(this))
    }

    handleYupPress() {
        let screenwidth = Dimensions.get('window').width;
        let panlength = screenwidth + 100

        Animated.timing(this.state.pan, {
            toValue: {x: panlength, y: 0}
        }).start(this._resetState.bind(this))
    }

    render() {
        let { pan, cards, currentPosition} = this.state;

        let [translateX, translateY] = [pan.x, pan.y];

        // card 0 animation
        let rotate = pan.x.interpolate({inputRange: [-240, 0, 240], outputRange: ["-30deg", "0deg", "30deg"]});

        let animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}]};

        let yupOpacity = pan.x.interpolate({inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp'});
        let animatedYupStyles = {opacity: yupOpacity}

        let nopeOpacity = pan.x.interpolate({inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp'});
        let animatedNopeStyles = {opacity: nopeOpacity}

        let card0AnimatedStyles = {
            animatedCardStyles: animatedCardStyles,
            animatedNopeStyles: animatedNopeStyles,
            animatedYupStyles: animatedYupStyles
        }

        // card 1 animation
        let card1BottomTranslation = pan.x.interpolate({inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD], outputRange: [0, -NEXT_CARD_POSITION_OFFSET, 0], extrapolate: 'clamp'});
        let card1SideTranslation = pan.x.interpolate({inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD], outputRange: [0, NEXT_CARD_SIZE_OFFSET, 0], extrapolate: 'clamp'});
        let card1TopTranslation = pan.x.interpolate({inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD], outputRange: [0, NEXT_CARD_POSITION_OFFSET+NEXT_CARD_SIZE_OFFSET, 0], extrapolate: 'clamp'});
        let card1TranslationStyles = {top: card1TopTranslation, bottom: card1BottomTranslation, right: card1SideTranslation, left: card1SideTranslation}
        let card1AnimatedStyles = {
            animatedCardContainerStyles: card1TranslationStyles
        }

        // card 2 animation
        let card2BottomTranslation = pan.x.interpolate({inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD], outputRange: [-NEXT_CARD_POSITION_OFFSET, -NEXT_CARD_POSITION_OFFSET*2, -NEXT_CARD_POSITION_OFFSET], extrapolate: 'clamp'});
        let card2SideTranslation = pan.x.interpolate({inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD], outputRange: [NEXT_CARD_SIZE_OFFSET, NEXT_CARD_SIZE_OFFSET*2, NEXT_CARD_SIZE_OFFSET], extrapolate: 'clamp'});
        let card2TopTranslation = pan.x.interpolate({inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD], outputRange: [NEXT_CARD_POSITION_OFFSET+NEXT_CARD_SIZE_OFFSET, (NEXT_CARD_POSITION_OFFSET+NEXT_CARD_SIZE_OFFSET)*2, NEXT_CARD_POSITION_OFFSET+NEXT_CARD_SIZE_OFFSET], extrapolate: 'clamp'});
        let card2TranslationStyles = {top: card2TopTranslation, bottom: card2BottomTranslation, right: card2SideTranslation, left: card2SideTranslation}
        let card2AnimatedStyles = {
            animatedCardContainerStyles: card2TranslationStyles
        }

        let card3AnimatedStyles = {
            animatedCardContainerStyles: {top: (NEXT_CARD_POSITION_OFFSET+NEXT_CARD_SIZE_OFFSET)*2, bottom: -NEXT_CARD_POSITION_OFFSET*2, right: NEXT_CARD_SIZE_OFFSET*2, left: NEXT_CARD_SIZE_OFFSET*2}
        }


        let person0 = cards[currentPosition]
        let person1 = cards[(currentPosition+1) % cards.length]
        let person2 = cards[(currentPosition+2) % cards.length]
        let person3 = cards[(currentPosition+3) % cards.length]

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

                    <View style={styles.buttonsContainer}>
                        <View style={styles.buttonContainer}>
                            <TouchableHighlight style={[styles.button, styles.buttonNope]} underlayColor='#EEE' onPress={() => {this.handleNopePress()}}>
                                <Text style={styles.nopeText}>Nein!</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableHighlight style={[styles.button, styles.buttonYup]} underlayColor='#EEE' onPress={() => {this.handleYupPress()}}>
                                <Text style={styles.yupText}>Love!</Text>
                            </TouchableHighlight>
                        </View>
                    </View>

                    <View style={styles.cardsContainer}>
                        <Card key={person3.name} {...person2} {...card3AnimatedStyles}/>
                        <Card key={person2.name} {...person2} {...card2AnimatedStyles}/>
                        <Card key={person1.name} {...person1} {...card1AnimatedStyles} />
                        <Card key={person0.name} {...person0} {...card0AnimatedStyles} panResponder={this._panResponder.panHandlers}/>
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
        backgroundColor: '#F5FCFF',
    },

    // we keep the bottom button sections at height 100
    // the card expands to take up all the rest of the space
    responsiveContainer: {
        flex: 1,
        paddingBottom: 100,
    },

    // cards
    cardsContainer: {
        flex: 1,
    },

    cardResizeContainer: {
        flex: 1,
        position: 'absolute',
        top: 40,
        left: 40,
        bottom: 40,
        right: 40,
    },

    cardContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'flex-end',
    },

    card: {
        position: 'relative',
        borderColor: '#AAA',
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
    },

    cardImage: {
        flex: 1,
        borderRadius: 8,
    },

    cardImageTextContainer: {
        position: 'absolute',
        borderWidth: 3,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 4,
        opacity: 0,
    },
    cardImageYupContainer : {
        top: 40,
        left: 40,
        transform:[{rotate: '-20deg'}],
        borderColor: 'green',

    },
    cardImageNopeContainer : {
        top: 40,
        right: 40,
        transform:[{rotate: '20deg'}],
        borderColor: 'red',
    },
    cardImageText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    cardImageNopeText: {
        color: 'red',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    cardImageYupText: {
        color: 'green',
        backgroundColor: 'rgba(0,0,0,0)',
    },

    cardLabelContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        //borderColor: "#999",
        borderRadius: 8,
        //borderBottomWidth: 2,
        padding: 8,
    },
    name: {
        fontWeight: 'bold',
        color: '#999',
    },
    value: {
        flex: 1,
        textAlign: 'right',
        fontWeight: 'bold',
        color: '#999',
    },

    // buttons

    buttonsContainer: {
        height:100,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
    },
    button: {
        borderWidth: 2,
        padding: 8,
        borderRadius: 5,
    },
    buttonNope: {
        borderColor: 'red',
    },
    buttonYup: {
        borderColor: 'green',
    },
    yupText: {
        fontSize: 20,
        color: 'green',
    },
    nopeText: {
        fontSize: 20,
        color: 'red',
    },

});


module.exports = SwipeCards