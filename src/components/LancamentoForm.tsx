import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ThemedText from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '../../constants/Colors';
import { getContas, getCategorias, saveLancamento, updateContaSaldo } from '@/services/database';
import { Conta, Categoria } from '../types';

interface LancamentoFormProps {
  tipo: 'receita' | 'despesa';
}

export default function LancamentoForm({ tipo }: LancamentoFormProps) {
  const colorScheme = useColorScheme();
  const [contas, setContas] = useState<Conta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [contaId, setContaId] = useState<number | null>(null);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const contasData = await getContas();
      const categoriasData = await getCategorias();
      setContas(contasData);
      setCategorias(categoriasData);
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!contaId || !categoriaId || !valor) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const valorNum = parseFloat(valor);
    try {
      await saveLancamento(contaId, categoriaId, valorNum, data, descricao, tipo);
      await updateContaSaldo(contaId, valorNum, tipo);
      alert('Lançamento salvo com sucesso!');
      setValor('');
      setDescricao('');
    } catch (error) {
      console.error('Erro ao salvar lançamento:', error);
      alert('Erro ao salvar lançamento');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'dark'].background }]}>
      <ThemedText type="subtitle">Novo {tipo === 'receita' ? 'Receita' : 'Despesa'}</ThemedText>
      <Picker
        selectedValue={contaId}
        onValueChange={(itemValue) => setContaId(itemValue)}
        style={[styles.picker, { backgroundColor: Colors[colorScheme ?? 'dark'].cardBackground, color: Colors[colorScheme ?? 'dark'].text }]}
      >
        <Picker.Item label="Selecione uma conta" value={null} />
        {contas.map((conta) => (
          <Picker.Item key={conta.id} label={conta.nome} value={conta.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={categoriaId}
        onValueChange={(itemValue) => setCategoriaId(itemValue)}
        style={[styles.picker, { backgroundColor: Colors[colorScheme ?? 'dark'].cardBackground, color: Colors[colorScheme ?? 'dark'].text }]}
      >
        <Picker.Item label="Selecione uma categoria" value={null} />
        {categorias.map((cat: Categoria) => (
          <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
        ))}
      </Picker>
      <TextInput
        style={[styles.input, { color: Colors[colorScheme ?? 'dark'].text, backgroundColor: Colors[colorScheme ?? 'dark'].cardBackground }]}
        placeholder="Valor"
        placeholderTextColor="#A0A0A0"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, { color: Colors[colorScheme ?? 'dark'].text, backgroundColor: Colors[colorScheme ?? 'dark'].cardBackground }]}
        placeholder="Data (YYYY-MM-DD)"
        placeholderTextColor="#A0A0A0"
        value={data}
        onChangeText={setData}
      />
      <TextInput
        style={[styles.input, { color: Colors[colorScheme ?? 'dark'].text, backgroundColor: Colors[colorScheme ?? 'dark'].cardBackground }]}
        placeholder="Descrição"
        placeholderTextColor="#A0A0A0"
        value={descricao}
        onChangeText={setDescricao}
      />
      <Button title="Salvar" onPress={handleSubmit} color={Colors[colorScheme ?? 'dark'].tint} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
  },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});