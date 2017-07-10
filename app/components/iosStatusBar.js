import React from 'react';
import {StyleSheet, View,Platform,StatusBar} from 'react-native';

const MyStatusBar = ({backgroundColor, ...props}) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <StatusBar backgroundColor={backgroundColor} {...props} />
    </View>
);

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const styles = StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT,
    }
});

export default MyStatusBar;
