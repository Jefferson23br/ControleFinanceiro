import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../../constants/Colors';
import { getLancamentos, updateLancamento, deleteLancamento, updateContaSaldo } from '@/services/database';
import { Lancamento } from '../../src/types';

export default function Movimentacoes() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLancamentos();
      setLancamentos(data);
    };
    fetchData();
  }, []);

  const handleEdit = (item: Lancamento) => {
    console.log('Editar:', item);
  };

  const handleDelete = async (item: Lancamento) => {
    await deleteLancamento(item.id);
    await updateContaSaldo(item.conta_id, item.valor, item.tipo === 'receita' ? '-' : '+');
    const updatedLancamentos = lancamentos.filter((l) => l.id !== item.id);
    setLancamentos(updatedLancamentos);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title">Movimentações</ThemedText>
          <View style={styles.card}>
            <FlatList
              data={lancamentos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <ThemedText>{item.descricao} - R${item.valor} ({item.tipo}) - {new Date(item.data).toLocaleDateString()}</ThemedText>
                  <View style={styles.buttons}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.button}>
                      <ThemedText>Editar</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)} style={styles.button}>
                      <ThemedText>Excluir</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </ScrollView>
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
    padding: 5, // 5mm
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    paddingBottom: 5, // 5mm de margem inferior
  },
  card: {
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: 8,
    padding: 5, // 5mm
    marginHorizontal: 5, // 5mm nas laterais
    marginVertical: 5, // 5mm em cima e embaixo
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
    marginHorizontal: -5, // Compensar o padding do card para ocupar toda a largura
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: Colors.dark.buttonBackground,
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});