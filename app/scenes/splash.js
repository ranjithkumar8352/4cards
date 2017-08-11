import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import store from 'react-native-simple-store';
import {localData, timings} from "../utils/localData";
import {getNewCards, getSingleCard} from "../utils/utils";
import {Actions} from "react-native-router-flux";
import words from '../data.json';
import moment from 'moment';

export default class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'Setting up...'
        };
    }

    componentDidMount() {
        store.get('introShown').then((introShown) => {
            if (introShown) {
                store.get('allWords').then((allWords) => {
                    if (allWords) {
                        localData.allWords = allWords;
                        //console.log(JSON.stringify(allWords));
                        let today = moment().format('DD-MM-YYYY');
                        store.get(today).then((todayCards) => {
                            if (todayCards) {
                                localData.todayCards = todayCards;
                                for (let i = 0; i < todayCards.length; i++) {
                                    let card = todayCards[i];
                                    if (!card.unlocked && moment().isSameOrAfter(moment(card.unlockTime, 'hh:mm:ss'))) {
                                        todayCards[i] = getSingleCard(allWords, 1);
                                    }
                                }
                                localData.todayCards = this.addSalt(todayCards);
                                //console.log(localData.todayCards);
                                store.save(today, localData.todayCards).then(() => {
                                    Actions.home({type: 'reset'});
                                }).catch(() => {
                                    Actions.home({type: 'reset'});
                                });
                            }
                            else {
                                localData.todayCards = this.addSalt(this.getCards(allWords));
                                store.save(today, localData.todayCards).then(() => {
                                    Actions.home({type: 'reset'});
                                }).catch(() => {
                                    Actions.home({type: 'reset'});
                                });
                            }
                        });
                    }
                    else { //First time user
                        store.save('allWords', words).then(() => {
                            localData.allWords = words;
                            let today = moment().format('DD-MM-YYYY');
                            store.get(today).then((todayCards) => {
                                if (todayCards) {
                                    alert("found saved cards");
                                    localData.todayCards = todayCards;
                                    Actions.home({type: 'reset'})
                                }
                                else {
                                    localData.todayCards = this.addSalt(this.getCards(words));
                                    store.save(today, localData.todayCards).then(() => {
                                        Actions.home({type: 'reset'});
                                    }).catch(() => {
                                        Actions.home({type: 'reset'});
                                    });
                                }
                            });
                            //Actions.home({type:'reset'});
                        });
                    }
                });
            }
            else {
                Actions.getStarted({type:'reset'});
            }
        });
    }

    getCards(allWords) {
        let todayCards = [];
        if (moment().isAfter(moment(timings["4"], 'hh:mm:ss'))) {
            todayCards = getNewCards(allWords, 4);
        }
        else if (moment().isAfter(moment(timings["3"], 'hh:mm:ss'))) {
            todayCards = getNewCards(allWords, 3);
        }
        else if (moment().isAfter(moment(timings["2"], 'hh:mm:ss'))) {
            todayCards = getNewCards(allWords, 2);
        } else {
            todayCards = getNewCards(allWords, 1);
        }
        return todayCards;
    }

    addSalt(cards) {
        let colorList = ["#F9CA32", "#F0776F", "#82E6F3", "#e67e22"];
        for (let i = 0; i < cards.length; i++) {
            if (cards[i]) {
                cards[i].color = colorList[i];
                cards[i].index = i + 1;
                if (cards[i].name) {
                    cards[i].unlocked = true;
                }
            }
        }
        for (let j = 0; j < 4; j++) {
            if (!cards[j]) {
                let tempCard = {};
                tempCard.index = j + 1;
                tempCard.color = colorList[j];
                tempCard.unlockTime = timings[(j + 1).toString()];
                cards.push(tempCard);
            }
        }
        return cards;
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#9050FE', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('../images/minion.png')}
                       style={{height: 175, width: 150}}/>
                <Text style={{color: 'white', fontSize: 16}}>{this.state.status}</Text>
            </View>
        )
    }

}