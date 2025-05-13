import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../constants/Colors';
import { getMovimentacoes } from '@/services/database';
import { Movimentacao } from '@/types';

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);

  useEffect(() => {
    const fetchMovimentacoes = async () => {
      const data = await getMovimentacoes();
      setMovimentacoes(data);
    };
    fetchMovimentacoes();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Movimentações</ThemedText>
        {movimentacoes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>Sem Movimentações</ThemedText>
          </View>
        ) : (
          <FlatList
            data={movimentacoes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <ThemedText>
                  {item.descricao} - R${item.valor} - {item.data}
                </ThemedText>
              </View>
            )}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.dark.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.dark.text,
    fontSize: 18,
  },
  item: {
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
});