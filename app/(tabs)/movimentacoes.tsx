import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedText from '@/components/ThemedText';
import { getContas } from '@/services/database';
import { Conta } from '@/types';

export default function Movimentacoes() {
  const [contas, setContas] = useState<Conta[]>([]);

  useEffect(() => {
    const fetchContas = async () => {
      const contasData = await getContas();
      setContas(contasData);
    };
    fetchContas();
  }, []);

  return (
    <View style={styles.container}>
      <ThemedText type="title">Movimentações</ThemedText>
      {contas.map((conta) => (
        <ThemedText key={conta.id}>
          {conta.nome}: R${conta.saldo_inicial.toFixed(2)}
        </ThemedText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});