import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Dimensions, ScrollView, TextInput, StyleSheet,Image} from 'react-native';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

export class CorrectPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen,
            correctAnswer: ''
        }
    }

    dismissModal() {
        this.refs.modal.close();
    }

    componentWillReceiveProps(nextProps){
        this.setState({isOpen:nextProps.isOpen,correctAnswer:nextProps.correctAnswer});
    }

    render() {
        let width = Dimensions.get('window').width * 100 / 100;
        let height = Dimensions.get('window').height * 40 / 100;
        return (
            <Modal animationDuration={300} style={{width: width, height: height, justifyContent: 'center',backgroundColor:'#62BA63'}}
                   position="bottom" ref={"modal"} isOpen={this.state.isOpen} swipeToClose={false} backdropPressToClose={false}>
                <ScrollView style={{marginTop:10}}>
                    <View style={styles.innerContainer}>
                        <Text style={{color: 'white', fontSize: 16,textAlign:'center'}}>Yey Its Correct</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <Text style={{color: 'white', fontSize: 18, textAlign: 'center', marginTop: 20}}>{this.state.correctAnswer ? this.state.correctAnswer : ""}</Text>
                        <Text style={{color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 10}}>is the correct answer</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <TouchableOpacity onPress={this.props.next}>
                            <Text style={{marginTop:30,fontSize:14,borderColor:'white',borderWidth:0.75,textAlign:'center',paddingHorizontal:30,paddingVertical:10,color:'white',borderRadius:20}}>NEXT QUIZ</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </Modal>
        )
    }
}

export class WrongPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen,
            correctAnswer: ""
        }
    }

    dismissModal() {
        this.refs.modal.close();
    }

    componentWillReceiveProps(nextProps){
        this.setState({isOpen:nextProps.isOpen,correctAnswer:nextProps.correctAnswer});
    }

    render() {
        let width = Dimensions.get('window').width * 100 / 100;
        let height = Dimensions.get('window').height * 40 / 100;
        return (
            <Modal animationDuration={300} style={{width: width, height: height, justifyContent: 'center',backgroundColor:'#F0776F'}}
                   position="bottom" ref={"modal"} isOpen={this.state.isOpen} swipeToClose={false} backdropPressToClose={false}>
                <ScrollView style={{marginTop:10}}>
                    <View style={styles.innerContainer}>
                        <Text style={{color: 'white', fontSize: 16,textAlign:'center'}}>Oops Its Wrong</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <Text style={{color: 'white', fontSize: 18, textAlign: 'center', marginTop: 20}}>{this.state.correctAnswer ? this.state.correctAnswer : ""}</Text>
                        <Text style={{color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 10}}>is the correct answer</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <TouchableOpacity onPress={this.props.next}>
                            <Text style={{marginTop:30,fontSize:14,borderColor:'white',borderWidth:0.75,textAlign:'center',paddingHorizontal:30,paddingVertical:10,color:'white',borderRadius:20}}>NEXT QUIZ</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </Modal>
        )
    }
}

export class TimeupPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen
        }
    }

    dismissModal() {
        this.refs.modal.close();
    }

    componentWillReceiveProps(nextProps){
        this.setState({isOpen:nextProps.isOpen});
    }

    render() {
        let width = Dimensions.get('window').width * 100 / 100;
        let height = Dimensions.get('window').height * 40 / 100;
        return (
            <Modal animationDuration={300} style={{width: width, height: height, justifyContent: 'center',backgroundColor:'#F0776F'}}
                   position="bottom" ref={"modal"} isOpen={this.state.isOpen} swipeToClose={false} backdropPressToClose={false}>
                <ScrollView style={{marginTop:10}}>
                    <View style={styles.innerContainer}>
                        <Text style={{color: 'white', fontSize: 16,textAlign:'center'}}>Sorry Time up</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <Text style={{color: 'white', fontSize: 18, textAlign: 'center', marginTop: 20}}>Option 2</Text>
                        <Text style={{color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 10}}>is the correct answer</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <TouchableOpacity >
                            <Text style={{marginTop:30,fontSize:14,borderColor:'white',borderWidth:0.75,textAlign:'center',paddingHorizontal:30,paddingVertical:10,color:'white',borderRadius:20}}>NEXT QUIZ</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </Modal>
        )
    }
}

export class QuizCompletePopup extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: this.props.isOpen,
            score: 0
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({isOpen: nextProps.isOpen,score:nextProps.score});
    }

    render() {
        let width = Dimensions.get('window').width * 90/100;
        let height = Dimensions.get('window').height * 50/100;
        return (
            <Modal style={{width:width,height:height,justifyContent:'center',borderRadius:8}}
                   position="center" ref={"modal"} isOpen={this.state.isOpen} swipeToClose={false} backdropPressToClose={false}>
                <View style={{backgroundColor:'#9050FE',flex:0.8,alignItems:'center',borderTopLeftRadius:8,borderTopRightRadius:8,justifyContent:'center'}}>
                    <Image source={require('../images/score.png')} style={{width:35,height:50,marginBottom:10}}/>
                    <Text style={{padding:10,fontSize:15,color:'white',textAlign:'center'}}>{'Quiz complete! You got ' + this.state.score + ' correct answers'}</Text>
                </View>
                <View style={{flex:0.2,alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity onPress={()=>{Actions.home({type:'reset'})}}><Text style={{fontSize:16,color:'#9050FE'}}>Awesome!</Text></TouchableOpacity>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    innerContainer: {
        justifyContent: 'center',
        alignItems:'center',
        marginHorizontal: 20,
        paddingHorizontal: 20
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

{/*
<TouchableOpacity onPress={() => {
    this.dismissModal()
}}
                  style={{position: 'absolute', top: 5, right: 5, paddingRight: 10}}><Icon
    name="ios-arrow-down-outline" style={{fontSize: 20, color: 'white'}}/></TouchableOpacity>*/}
