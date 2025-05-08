import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import ThemedText from '@/components/ThemedText';
import { insertConta } from '@/services/database';
import { Conta } from '@/types';

export default function Configuracoes() {
  const [nome, setNome] = useState('');
  const [saldoInicial, setSaldoInicial] = useState('');
  const [tipo, setTipo] = useState('Corrente');

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
    <View style={styles.container}>
      <ThemedText type="title">Configurações</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Nome da Conta"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Saldo Inicial"
        value={saldoInicial}
        onChangeText={setSaldoInicial}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo (Corrente/Poupança)"
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
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});