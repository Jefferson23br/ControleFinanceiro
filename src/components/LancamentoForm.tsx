import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ThemedText from '@/components/ThemedText';
import { getContas, getCategorias, saveLancamento, updateContaSaldo } from '@/services/database';
import { Conta, Categoria } from '@/types';

interface LancamentoFormProps {
  tipo: 'receita' | 'despesa';
}

export default function LancamentoForm({ tipo }: LancamentoFormProps) {
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
    <View style={styles.container}>
      <ThemedText type="subtitle">Novo {tipo === 'receita' ? 'Receita' : 'Despesa'}</ThemedText>
      <Picker
        selectedValue={contaId}
        onValueChange={(itemValue) => setContaId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma conta" value={null} />
        {contas.map((conta) => (
          <Picker.Item key={conta.id} label={conta.nome} value={conta.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={categoriaId}
        onValueChange={(itemValue) => setCategoriaId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma categoria" value={null} />
        {categorias.map((cat: Categoria) => (
          <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Data (YYYY-MM-DD)"
        value={data}
        onChangeText={setData}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <Button title="Salvar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  picker: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});