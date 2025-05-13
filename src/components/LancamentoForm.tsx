import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../../constants/Colors';
import { getContas, getCategorias, saveLancamento, updateLancamento } from '@/services/database';
import { Conta, Lancamento, Categoria } from '@/types';

interface LancamentoFormProps {
  lancamento?: Lancamento;
  tipo: 'receita' | 'despesa';
  onSave: () => void;
}

export default function LancamentoForm({ lancamento, tipo, onSave }: LancamentoFormProps) {
  const [form, setForm] = useState<Lancamento>({
    id: lancamento?.id || 0,
    descricao: lancamento?.descricao || '',
    valor: lancamento?.valor || 0,
    data: lancamento?.data || new Date().toISOString().split('T')[0],
    categoria: lancamento?.categoria || '',
    tipo: tipo,
    contaId: lancamento?.contaId || undefined,
  });
  const [contas, setContas] = useState<Conta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contaData = await getContas();
        setContas(contaData);

        const categoriaData = await getCategorias();
        setCategorias(categoriaData);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar contas e categorias.');
      }
    };
    fetchData();
  }, []);

  const validateForm = (): boolean => {
    if (!form.descricao.trim()) {
      Alert.alert('Erro', 'A descrição é obrigatória.');
      return false;
    }
    if (form.valor <= 0) {
      Alert.alert('Erro', 'O valor deve ser maior que zero.');
      return false;
    }
    if (!form.categoria) {
      Alert.alert('Erro', 'Selecione uma categoria.');
      return false;
    }
    // Validação básica de formato de data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(form.data)) {
      Alert.alert('Erro', 'A data deve estar no formato YYYY-MM-DD.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (lancamento) {
        await updateLancamento(form);
      } else {
        await saveLancamento(form);
      }
      onSave();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o lançamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.input}
        value={form.descricao}
        onChangeText={(text) => setForm({ ...form, descricao: text })}
        placeholder="Descrição"
        placeholderTextColor={Colors.dark.text}
      />
      <TextInput
        style={styles.input}
        value={form.valor.toString()}
        onChangeText={(text) => setForm({ ...form, valor: parseFloat(text) || 0 })}
        placeholder="Valor"
        keyboardType="numeric"
        placeholderTextColor={Colors.dark.text}
      />
      <TextInput
        style={styles.input}
        value={form.data}
        onChangeText={(text) => setForm({ ...form, data: text })}
        placeholder="Data (YYYY-MM-DD)"
        placeholderTextColor={Colors.dark.text}
      />
      <Picker
        selectedValue={form.categoria}
        onValueChange={(value: string) => setForm({ ...form, categoria: value })}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma categoria" value="" />
        {categorias.map((cat) => (
          <Picker.Item key={cat.id} label={cat.nome} value={cat.nome} />
        ))}
      </Picker>
      <Picker
        selectedValue={form.contaId}
        onValueChange={(value: number) => setForm({ ...form, contaId: value })}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma conta" value={undefined} />
        {contas.map((conta) => (
          <Picker.Item key={conta.id} label={conta.nome} value={conta.id} />
        ))}
      </Picker>
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        <ThemedText style={styles.submitText}>
          {loading ? 'Salvando...' : 'Salvar'}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.dark.background,
  },
  input: {
    backgroundColor: Colors.dark.cardBackground,
    color: Colors.dark.text,
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    marginBottom: 8,
  },
  picker: {
    backgroundColor: Colors.dark.cardBackground,
    color: Colors.dark.text,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: Colors.dark.buttonBackground,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.dark.tint,
    opacity: 0.6,
  },
  submitText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
});