import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';

export default function ConfiguracoesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Configurações</ThemedText>
        <ThemedText>Gerencie suas configurações aqui.</ThemedText>
      </ThemedView>
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