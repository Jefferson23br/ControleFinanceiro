import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  return (
    <ParallaxScrollView>
      <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'dark'].background }]}>
        <ThemedText type="title">Bem-vindo!</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});