import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../constants/Colors';
import { router } from 'expo-router';
import { getLancamentos, getSaldoConta, getContas, getCategorias } from '@/services/database';
import { Conta, Lancamento, Categoria } from '@/types';

export default function Home() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const lancamentoData = await getLancamentos();
      setLancamentos(lancamentoData);

      const contaData = await getContas();
      setContas(contaData);

      const categoriaData = await getCategorias();
      setCategorias(categoriaData);

      if (contaData.length > 0) {
        const saldoConta = await getSaldoConta(contaData[0].id);
        setSaldo(saldoConta);
      }
    };
    fetchData();
  }, []);

  const totalReceitas = lancamentos
    .filter((l: Lancamento) => l.tipo === 'receita')
    .reduce((sum: number, l: Lancamento) => sum + l.valor, 0);

  const totalDespesas = lancamentos
    .filter((l: Lancamento) => l.tipo === 'despesa')
    .reduce((sum: number, l: Lancamento) => sum + l.valor, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Controle Financeiro</ThemedText>
        <View style={styles.card}>
          <ThemedText>Saldo: R${saldo.toFixed(2)}</ThemedText>
          <ThemedText>Receitas: R${totalReceitas.toFixed(2)}</ThemedText>
          <ThemedText>Despesas: R${totalDespesas.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Últimos Lançamentos</ThemedText>
          <FlatList
            data={lancamentos.slice(0, 5)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }: { item: Lancamento }) => (
              <View style={styles.item}>
                <ThemedText>
                  {item.descricao} - R${item.valor} - {item.data}
                </ThemedText>
              </View>
            )}
          />
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Navegação</ThemedText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/movimentacoes')}
            >
              <ThemedText>Movimentações</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/despesa')}
            >
              <ThemedText>Despesa</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/receita')}
            >
              <ThemedText>Receita</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/metas')}
            >
              <ThemedText>Metas</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/configuracoes')}
            >
              <ThemedText>Configurações</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
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
  card: {
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  item: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: Colors.dark.buttonBackground,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    width: '48%',
  },
});