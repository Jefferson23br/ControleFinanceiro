import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import ThemedText from '@/components/ThemedText';
import { insertConta } from '@/services/database';
import { Conta } from '@/types';
import { useColorScheme } from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';

export default function Configuracoes() {
  const [nome, setNome] = useState('');
  const [saldoInicial, setSaldoInicial] = useState('');
  const [tipo, setTipo] = useState('Corrente');
  const colorScheme = useColorScheme();

  const handleAddConta = async () => {
    if (!nome || !saldoInicial) {
      alert('Preencha todos os campos');
      return;
    }
    try {
      await insertConta(nome, parseFloat(saldoInicial), tipo);
      alert('Conta adicionada com sucesso!');
      setNome('');
      setSaldoInicial('');
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
      alert('Erro ao adicionar conta');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'dark'].background }]}>
      <ThemedText type="title" style={{ color: Colors[colorScheme ?? 'dark'].text }}>
        Configurações
      </ThemedText>
      <TextInput
        style={[styles.input, {
          backgroundColor: '#2A3435',
          color: Colors[colorScheme ?? 'dark'].text,
          borderColor: Colors[colorScheme ?? 'dark'].icon,
        }]}
        placeholder="Nome da Conta"
        placeholderTextColor="#A0A0A0"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={[styles.input, {
          backgroundColor: '#2A3435',
          color: Colors[colorScheme ?? 'dark'].text,
          borderColor: Colors[colorScheme ?? 'dark'].icon,
        }]}
        placeholder="Saldo Inicial"
        placeholderTextColor="#A0A0A0"
        value={saldoInicial}
        onChangeText={setSaldoInicial}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, {
          backgroundColor: '#2A3435',
          color: Colors[colorScheme ?? 'dark'].text,
          borderColor: Colors[colorScheme ?? 'dark'].icon,
        }]}
        placeholder="Tipo (Corrente/Poupança)"
        placeholderTextColor="#A0A0A0"
        value={tipo}
        onChangeText={setTipo}
      />
      <Button title="Adicionar Conta" onPress={handleAddConta} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});