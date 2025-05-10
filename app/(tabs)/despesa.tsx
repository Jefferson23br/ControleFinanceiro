import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LancamentoForm from '@/components/LancamentoForm';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';

export default function DespesaScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Nova Despesa</ThemedText>
        <LancamentoForm tipo="despesa" />
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