import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import {SegmentedControls} from 'react-native-radio-buttons';
import {CorrectPopup, WrongPopup, TimeupPopup, QuizCompletePopup} from '../components/correctPopup';
import  {Actions} from 'react-native-router-flux';
import moment from 'moment';
import store from 'react-native-simple-store';
import _ from "lodash";

export default class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: null,
            loaded: false,
            ready: false,
            quizList: [],
            quizIndex: 0,
            correctPopup: false,
            wrongPopup: false,
            timeupPopup: false,
            score: 0,
            completePopup: false
        };
        this.gotoNextQuestion = this.gotoNextQuestion.bind(this);
    }

    componentDidMount(){
        if (moment().isSameOrAfter(moment("21:00:00", 'hh:mm:ss'))) {
            let today = moment().format('DD-MM-YYYY');
            let quizCards = [];
            store.get(today).then((todayCards)=>{
                _.each(todayCards,function (card) {
                    if(card.name){
                        let tempCard = {};
                        tempCard.question = card.name;
                        tempCard.answer = _.sample(card.synonyms);
                        tempCard.options = [];
                        tempCard.options.push(tempCard.answer);
                        let otherCards = _.filter(todayCards, function(o) { return o.name != card.name; });
                        _.each(otherCards,function(otherCard){
                            let answer = _.sample(otherCard.synonyms);
                            if(answer){
                                tempCard.options.push(answer);
                            }
                            else {
                                tempCard.options.push("I dont know");
                            }
                        });
                        tempCard.options = _.shuffle(tempCard.options);
                        quizCards.push(tempCard);
                    }
                });
                quizCards = _.shuffle(quizCards);
                console.log(quizCards);
                this.setState({quizList:quizCards,loaded:true,ready:true});
            });
        }
        else {
            this.setState({loaded: true});
        }
    }

    gotoNextQuestion(){
        let currentIndex = this.state.quizIndex;
        if(currentIndex + 1 < this.state.quizList.length) {
            this.setState({quizIndex:this.state.quizIndex+1,correctPopup:false,wrongPopup:false,timeupPopup:false,selectedOption:""});
        }
        else {
            this.setState({correctPopup:false,wrongPopup:false,timeupPopup:false,completePopup:true});
        }
    }

    setSelectedOption(selectedOption) {
        this.setState({
            selectedOption
        });
        if(selectedOption == this.state.quizList[this.state.quizIndex].answer){
            this.setState({correctPopup:true,score:this.state.score + 1});
        }
        else {
            this.setState({wrongPopup:true});
        }
    }

    render() {
        if (this.state.loaded && this.state.ready) {
            let quizCard = this.state.quizList[this.state.quizIndex];
            return (
                <View style={{flex: 1, backgroundColor: '#9050FE'}}>
                    <View style={{flex: 1, margin: 20, borderRadius: 5, backgroundColor: '#EDC236'}}>
                        <View style={{
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5
                        }}>
                            <Text style={{color: 'white', textAlign: 'center', padding: 15}}>Quiz - {this.state.quizIndex + 1}</Text>
                        </View>
                        <View style={styles.question}>
                            <Text style={{color: 'white', fontSize: 22}}>{quizCard.question}</Text>
                            <Text style={{color: 'white', fontSize: 11, padding: 5}}>Find the closest meaning of
                                this</Text>
                        </View>
                        <ProgressBar width={null} borderRadius={0} color="#68B832" unfilledColor="white"
                                     borderColor="#EDC236" height={5} progress={1}/>
                        <View style={{flex: 1}}>
                            <SegmentedControls
                                options={quizCard.options}
                                direction={'column'}
                                onSelection={this.setSelectedOption.bind(this)}
                                selectedOption={this.state.selectedOption}
                                containerStyle={{flex: 1, borderRadius: 0}}
                                optionContainerStyle={{flex: 0.25, justifyContent: 'center'}}
                                optionStyle={{fontSize: 16}}
                                containerBorderWidth={0}
                                containerBorderRadius={0}
                                separatorTint={'white'}
                                separatorWidth={0.75}
                                tint={'white'}
                                backTint={'#EDC236'}
                                selectedBackgroundColor={'rgba(0,0,0,0.3)'}
                                selectedTint={'white'}
                            />
                        </View>
                    </View>
                    <CorrectPopup isOpen={this.state.correctPopup} next={this.gotoNextQuestion} correctAnswer={this.state.quizList[this.state.quizIndex].answer}/>
                    <WrongPopup isOpen={this.state.wrongPopup} next={this.gotoNextQuestion} correctAnswer={this.state.quizList[this.state.quizIndex].answer}/>
                    <TimeupPopup isOpen={this.state.timeupPopup} next={this.gotoNextQuestion} correctAnswer={this.state.quizList[this.state.quizIndex].answer}/>
                    <QuizCompletePopup isOpen={this.state.completePopup} next={this.gotoNextQuestion} score={this.state.score}/>
                </View>
            )
        }
        else if(this.state.loaded){
            return (
                <View style={{flex:1,backgroundColor: '#EDC236',justifyContent:'center',alignItems:'center',paddingHorizontal:30}}>
                    <Text style={{color:'white',textAlign:'center'}}>Quiz will be ready at 09:00 PM!</Text>
                    <Text style={{color:'white',textAlign:'center'}}>Check back later.</Text>
                    </View>
            )
        }
        else {
            return (
                <View style={{flex:1,backgroundColor: '#EDC236'}}>
                    <View style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        marginBottom: 10
                    }}>
                        <Text style={{color: 'white', textAlign: 'center', padding: 15}}>Quiz</Text>
                    </View>
                    <ActivityIndicator/>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    question: {
        flex: 0.25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    answer: {
        flex: 0.25,
        borderTopWidth: 0.5,
        borderColor: '#f4f4f4',
        justifyContent: 'center',
        alignItems: 'center'
    },
    answerFirst: {
        flex: 0.1875,
        justifyContent: 'center',
        alignItems: 'center'
    }

});