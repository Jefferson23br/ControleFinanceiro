import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';
import Colors from '@/constants/Colors';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native';
import { Lancamento, Conta, Categoria } from '../types';
import { getContas, getCategorias, saveLancamento, updateContaSaldo } from '../services/database';

interface LancamentoFormProps {
  tipo: 'receita' | 'despesa';
  onSave: () => void;
}

export default function LancamentoForm({ tipo, onSave }: LancamentoFormProps) {
  const [lancamento, setLancamento] = useState<Lancamento>({
    id: 0,
    tipo,
    valor: 0,
    data: new Date().toISOString().split('T')[0],
    conta_id: 0,
    categoria_id: 0,
    descricao: '',
  });
  const [contas, setContas] = useState<Conta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const contasData = await getContas();
      const categoriasData = await getCategorias(tipo);
      setContas(contasData);
      setCategorias(categoriasData);
    };
    fetchData();
  }, [tipo]);

  const handleSubmit = async () => {
    lancamento.id = Date.now();
    const contaId = lancamento.conta_id || contas[0]?.id || 0;
    await saveLancamento(contaId, lancamento.categoria_id || categorias[0]?.id || 0, lancamento.valor, lancamento.data, lancamento.descricao, lancamento.tipo);
    await updateContaSaldo(contaId, lancamento.valor, lancamento.tipo);
    onSave();
  };

  const formatDateForDisplay = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <ThemedText>Data</ThemedText>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <ThemedText>{formatDateForDisplay(lancamento.data)}</ThemedText>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(lancamento.data)}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setLancamento({ ...lancamento, data: date.toISOString().split('T')[0] });
                  }}
                />
              )}
            </View>
            <View style={styles.inputContainer}>
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
            <View style={styles.inputContainer}>
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
              <TextInput
                style={styles.textInput}
                value={lancamento.descricao}
                onChangeText={(text) => setLancamento({ ...lancamento, descricao: text })}
                placeholder="Digite a descrição"
              />
            </View>
            <View style={styles.inputContainer}>
              <ThemedText>Valor</ThemedText>
              <TextInput
                style={styles.textInput}
                value={lancamento.valor.toString()}
                onChangeText={(text) => setLancamento({ ...lancamento, valor: parseFloat(text) || 0 })}
                placeholder="Digite o valor"
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <ThemedText style={styles.submitText}>Salvar</ThemedText>
            </TouchableOpacity>
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
    padding: 5, // 5mm (aproximadamente 5px)
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
  inputContainer: {
    marginBottom: 10, // 1cm (aproximadamente 10px)
  },
  picker: {
    backgroundColor: Colors.dark.cardBackground,
    color: Colors.dark.text,
    marginHorizontal: -5, // Compensar o padding do card para ocupar toda a largura
  },
  textInput: {
    backgroundColor: Colors.dark.cardBackground,
    color: Colors.dark.text,
    borderRadius: 4,
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    marginHorizontal: -5, // Compensar o padding do card para ocupar toda a largura
  },
  submitButton: {
    backgroundColor: Colors.dark.buttonBackground,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: -5, // Compensar o padding do card para ocupar toda a largura
  },
  submitText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
});