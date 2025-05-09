import React from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedText from '@/components/ThemedText';
import { useColorScheme } from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';

export default function Metas() {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'dark'].background }]}>
      <ThemedText type="title" style={{ color: Colors[colorScheme ?? 'dark'].text }}>
        Metas
      </ThemedText>
      {/* Adicione aqui o conteúdo da tela Metas */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});