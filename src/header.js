'use strict';
import React, {
  StyleSheet,
  Component,
  Text,
  View,
} from 'react-native';

class Header extends Component {
    constructor(props) {
      super(props); 
    }

    render() {

      return (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Swipe Me!</Text>
          </View>
      );
    }
}

const styles = StyleSheet.create({
    header: {
      backgroundColor: 'black',
      flexDirection: 'row',
      padding: 10,
    },
    headerTitle: {
      flex: 1,
      color: 'white',
      textAlign: 'center',
      fontSize: 24,
      fontWeight: '700',
    },
  });

module.exports = Header