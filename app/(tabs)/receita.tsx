import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';
import LancamentoForm from '@/components/LancamentoForm';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';

export default function ReceitaScreen() {
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'dark'].background }]}>
      <ThemedText type="title">Nova Receita</ThemedText>
      <LancamentoForm tipo="receita" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});