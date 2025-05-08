import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function TabBarBackgroundIOS() {
  return <View style={styles.background} />;
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFF',
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});