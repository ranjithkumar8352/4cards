import React, {Component} from 'react';
import {
    Scene,
    Router,
    ActionConst
} from 'react-native-router-flux';
import PreviousCards from './scenes/previousCards';
import Home from './scenes/home';
import SentencePopup from './components/sentencePopup';
import Quiz from './scenes/quiz';
import Splash from './scenes/splash'
import GetStarted from './scenes/getStarted';


export default class Main extends Component {

    render() {
        return (
            <Router>
                <Scene key="lightbox" lightbox>
                    <Scene key="root" hideNavBar>
                        <Scene key="splash" component={Splash} title="Splash" initial={true}/>
                        <Scene key="home" component={Home} title="Home"/>
                        <Scene key="previousCards" component={PreviousCards} title="Previous cards" type={ActionConst.PUSH}/>
                        <Scene key="quiz" component={Quiz} title="Quiz"/>
                        <Scene key="getStarted" component={GetStarted} title="Get started"/>
                    </Scene>
                    <Scene key="sentencePopup" component={SentencePopup} title="Chat popup"/>
                </Scene>
            </Router>
        )


    }
}