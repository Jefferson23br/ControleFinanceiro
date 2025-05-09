import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';

export default function Movimentacoes() {
  const colorScheme = useColorScheme();
  const [filtro, setFiltro] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'dark'].background }]}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'dark'].text }]}>
        Movimentações
      </Text>
      <TextInput
        style={[styles.input, {
          backgroundColor: '#2A3435', // Contraste com o fundo
          color: Colors[colorScheme ?? 'dark'].text,
        }]}
        placeholder="Filtrar movimentações..."
        placeholderTextColor="#A0A0A0"
        value={filtro}
        onChangeText={setFiltro}
      />
      {/* Adicione aqui a lista de movimentações quando getLancamentos for implementado */}
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
    marginBottom: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
});