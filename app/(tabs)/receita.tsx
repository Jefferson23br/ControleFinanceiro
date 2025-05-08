import React from 'react';
import { View, StyleSheet } from 'react-native';
import LancamentoForm from '@/components/LancamentoForm';
import ThemedText from '@/components/ThemedText';

export default function Receita() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Nova Receita</ThemedText>
      <LancamentoForm tipo="receita" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});