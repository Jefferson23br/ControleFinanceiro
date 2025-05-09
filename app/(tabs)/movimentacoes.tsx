import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useColorScheme } from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';
import { getLancamentos, getContas, getCategorias, getSaldoConta } from '@/services/database';
import { Lancamento, Conta, Categoria } from '@/types';

export default function Movimentacoes() {
  const colorScheme = useColorScheme();
  console.log('ColorScheme:', colorScheme, 'Background:', Colors[colorScheme ?? 'dark'].background);

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
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'dark'].background }]}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'dark'].text }]}>
        Movimentações
      </Text>
      <TextInput
        style={[styles.input, {
          backgroundColor: '#2A3435',
          color: Colors[colorScheme ?? 'dark'].text,
        }]}
        placeholder="Filtrar por descrição..."
        placeholderTextColor="#A0A0A0"
        value={filtroTexto}
        onChangeText={setFiltroTexto}
      />
      <Picker
        selectedValue={filtroContaId}
        onValueChange={(itemValue) => setFiltroContaId(itemValue)}
        style={[styles.picker, { backgroundColor: '#2A3435', color: Colors[colorScheme ?? 'dark'].text }]}
      >
        <Picker.Item label="Todas as contas" value={null} />
        {contas.map((conta) => (
          <Picker.Item key={conta.id} label={conta.nome} value={conta.id} />
        ))}
      </Picker>
      {filtroContaId && saldoConta !== null && (
        <Text style={[styles.saldo, { color: Colors[colorScheme ?? 'dark'].text }]}>
          Saldo da conta: R${saldoConta.toFixed(2)}
        </Text>
      )}
      <Picker
        selectedValue={filtroCategoriaId}
        onValueChange={(itemValue) => setFiltroCategoriaId(itemValue)}
        style={[styles.picker, { backgroundColor: '#2A3435', color: Colors[colorScheme ?? 'dark'].text }]}
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
          <View style={[styles.item, { borderBottomColor: Colors[colorScheme ?? 'dark'].icon }]}>
            <Text style={{ color: Colors[colorScheme ?? 'dark'].text }}>
              {item.descricao} - R${item.valor.toFixed(2)} ({item.tipo})
            </Text>
            <Text style={{ color: Colors[colorScheme ?? 'dark'].text, fontSize: 12 }}>
              Conta: {contas.find((c) => c.id === item.conta_id)?.nome || 'Desconhecida'} | 
              Categoria: {categorias.find((c) => c.id === item.categoria_id)?.nome || 'Desconhecida'} | 
              Data: {item.data}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: Colors[colorScheme ?? 'dark'].text, textAlign: 'center', marginTop: 16 }}>
            Nenhuma movimentação encontrada
          </Text>
        }
      />
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
    marginBottom: 16,
  },
  picker: {
    marginBottom: 16,
    borderRadius: 8,
  },
  item: {
    padding: 8,
    borderBottomWidth: 1,
  },
  saldo: {
    fontSize: 16,
    marginBottom: 16,
  },
});