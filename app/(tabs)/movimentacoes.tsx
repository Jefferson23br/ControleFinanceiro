import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { getLancamentos, getContas, getCategorias, getSaldoConta } from '@/services/database';
import { Lancamento, Conta, Categoria } from '../../src/types';

export default function Movimentacoes() {
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroContaId, setFiltroContaId] = useState<number | null>(null);
  const [filtroCategoriaId, setFiltroCategoriaId] = useState<number | null>(null);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [saldoConta, setSaldoConta] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lancamentosData, contasData, categoriasData] = await Promise.all([
          getLancamentos(),
          getContas(),
          getCategorias(),
        ]);
        setLancamentos(lancamentosData);
        setContas(contasData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSaldo = async () => {
      if (filtroContaId) {
        try {
          const saldo = await getSaldoConta(filtroContaId);
          setSaldoConta(saldo);
        } catch (error) {
          console.error('Erro ao carregar saldo:', error);
          setSaldoConta(null);
        }
      } else {
        setSaldoConta(null);
      }
    };
    fetchSaldo();
  }, [filtroContaId]);

  const filteredLancamentos = lancamentos.filter((lancamento) => {
    const matchesTexto = filtroTexto
      ? lancamento.descricao?.toLowerCase().includes(filtroTexto.toLowerCase())
      : true;
    const matchesConta = filtroContaId ? lancamento.conta_id === filtroContaId : true;
    const matchesCategoria = filtroCategoriaId
      ? lancamento.categoria_id === filtroCategoriaId
      : true;
    return matchesTexto && matchesConta && matchesCategoria;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Movimentações</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Filtrar por descrição..."
          placeholderTextColor="#A0A0A0"
          value={filtroTexto}
          onChangeText={setFiltroTexto}
        />
        <Picker
          selectedValue={filtroContaId}
          onValueChange={(itemValue) => setFiltroContaId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Todas as contas" value={null} />
          {contas.map((conta) => (
            <Picker.Item key={conta.id} label={conta.nome} value={conta.id} />
          ))}
        </Picker>
        {filtroContaId && saldoConta !== null && (
          <ThemedText style={styles.saldo}>
            Saldo da conta: R${saldoConta.toFixed(2)}
          </ThemedText>
        )}
        <Picker
          selectedValue={filtroCategoriaId}
          onValueChange={(itemValue) => setFiltroCategoriaId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Todas as categorias" value={null} />
          {categorias.map((cat) => (
            <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
          ))}
        </Picker>
        <FlatList
          data={filteredLancamentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <ThemedText>
                {item.descricao} - R${item.valor.toFixed(2)} ({item.tipo})
              </ThemedText>
              <ThemedText style={styles.itemDetails}>
                Conta: {contas.find((c) => c.id === item.conta_id)?.nome || 'Desconhecida'} | 
                Categoria: {categorias.find((c) => c.id === item.categoria_id)?.nome || 'Desconhecida'} | 
                Data: {item.data}
              </ThemedText>
            </View>
          )}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>
              Nenhuma movimentação encontrada
            </ThemedText>
          }
          contentContainerStyle={styles.listContent}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1E1E1E',
    color: '#E0E0E0',
    marginBottom: 16,
  },
  picker: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
    color: '#E0E0E0',
    borderRadius: 8,
  },
  item: {
    width: '100%',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#B0B0B0',
  },
  itemDetails: {
    fontSize: 12,
  },
  saldo: {
    fontSize: 16,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
  },
  listContent: {
    width: '100%',
    paddingBottom: 16,
  },
});