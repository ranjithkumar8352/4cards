/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';

import Header from './header';
import SwipeCards from './swipecards';

function Init() {

  // on IOS the window draws over the stats bar
  const windowMarginTop = (Platform.OS === 'ios') ? 24 : 0;

  class ReactNativeTinderSwipe extends Component {
    render() {
      return (
        <View style={styles.viewPortContainer}>
          <Header/>
          <SwipeCards/>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    viewPortContainer: {
      marginTop: windowMarginTop,
      flex: 1,
    },
  });

  AppRegistry.registerComponent('ReactNativeTinderSwipe', () => ReactNativeTinderSwipe);
}

module.exports = Init
