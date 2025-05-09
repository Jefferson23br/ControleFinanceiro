import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Collapsible from '@/components/Collapsible';
import { useColorScheme } from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';

export default function Explore() {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'dark'].background }]}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'dark'].text }]}>
        Explorar
      </Text>
      <Collapsible title="Seção 1">
        <Text style={{ color: Colors[colorScheme ?? 'dark'].text }}>
          Conteúdo da seção 1
        </Text>
      </Collapsible>
      <Collapsible title="Seção 2">
        <Text style={{ color: Colors[colorScheme ?? 'dark'].text }}>
          Conteúdo da seção 2
        </Text>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});