import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../../constants/Colors';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Lancamento, Conta, Categoria } from '../../src/types';
import { getContas, getCategorias, saveLancamento, updateContaSaldo } from '@/services/database';

export default function Despesa() {
  const [lancamento, setLancamento] = useState<Lancamento>({
    id: 0,
    conta_id: 0,
    categoria_id: 0,
    valor: 0,
    data: new Date().toISOString(),
    descricao: '',
    tipo: 'despesa',
  });
  const [contas, setContas] = useState<Conta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    lancamento.id = Date.now();
    const contaId = lancamento.conta_id || contas[0]?.id || 0;
    await saveLancamento(contaId, lancamento.categoria_id || categorias[0]?.id || 0, lancamento.valor, lancamento.data, lancamento.descricao, lancamento.tipo);
    await updateContaSaldo(contaId, lancamento.valor, lancamento.tipo);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Nova Despesa</ThemedText>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <ThemedText>Data: {new Date(lancamento.data).toLocaleDateString()}</ThemedText>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(lancamento.data)}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setLancamento({ ...lancamento, data: date.toISOString() });
              }}
            />
          )}
          <View style={styles.pickerContainer}>
            <ThemedText>Conta</ThemedText>
            <Picker
              selectedValue={lancamento.conta_id}
              onValueChange={(itemValue) => setLancamento({ ...lancamento, conta_id: itemValue })}
              style={styles.picker}>
              <Picker.Item label="Selecione uma conta" value={0} />
              {contas.map((conta) => (
                <Picker.Item key={conta.id} label={conta.nome} value={conta.id} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <ThemedText>Categoria</ThemedText>
            <Picker
              selectedValue={lancamento.categoria_id}
              onValueChange={(itemValue) => setLancamento({ ...lancamento, categoria_id: itemValue })}
              style={styles.picker}>
              <Picker.Item label="Selecione uma categoria" value={0} />
              {categorias.map((categoria) => (
                <Picker.Item key={categoria.id} label={categoria.nome} value={categoria.id} />
              ))}
            </Picker>
          </View>
          <View style={styles.inputContainer}>
            <ThemedText>Descrição</ThemedText>
            <ThemedText>{lancamento.descricao}</ThemedText> {/* Substitua por TextInput */}
          </View>
          <View style={styles.inputContainer}>
            <ThemedText>Valor</ThemedText>
            <ThemedText>{lancamento.valor}</ThemedText> {/* Substitua por TextInput */}
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <ThemedText style={styles.submitText}>Salvar</ThemedText>
          </TouchableOpacity>
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
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    backgroundColor: Colors.dark.cardBackground,
    color: Colors.dark.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: Colors.dark.buttonBackground,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
});