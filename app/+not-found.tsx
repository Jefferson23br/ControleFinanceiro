import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import ThemedText from '@/components/ThemedText';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Página Não Encontrada</ThemedText>
      <ThemedText type="subtitle">Desculpe, a página que você está procurando não existe.</ThemedText>
      <Link href="/" style={styles.link}>
        <ThemedText style={styles.linkText}>Voltar para Home</ThemedText>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  link: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  linkText: {
    color: '#FFF',
    fontSize: 16,
  },
});