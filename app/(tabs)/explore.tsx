import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Collapsible from '@/components/Collapsible';

export default function Explore() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explorar</Text>
      <Collapsible title="Seção 1">
        <Text>Conteúdo da seção 1</Text>
      </Collapsible>
      <Collapsible title="Seção 2">
        <Text>Conteúdo da seção 2</Text>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});