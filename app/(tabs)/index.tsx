import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ParallaxScrollView>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Bem-vindo!</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});