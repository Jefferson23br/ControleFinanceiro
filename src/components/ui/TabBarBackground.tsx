import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import TabBarBackgroundIOS from './TabBarBackground.ios';

export default function TabBarBackground() {
  return Platform.OS === 'ios' ? <TabBarBackgroundIOS /> : <View style={styles.background} />;
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFF',
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});