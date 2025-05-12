import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../../constants/Colors';
import { Picker } from '@react-native-picker/picker';

export default function Movimentacoes() {
  const [filtro, setFiltro] = useState('');
  const [contaSelecionada, setContaSelecionada] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Movimentações</ThemedText>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Filtrar por descrição..."
            placeholderTextColor={Colors.dark.text}
            value={filtro}
            onChangeText={setFiltro}
          />
          <View style={styles.pickerContainer}>
            <ThemedText>Conta</ThemedText>
            <Picker
              selectedValue={contaSelecionada}
              onValueChange={setContaSelecionada}
              style={styles.picker}>
              <Picker.Item label="Todas as contas" value="" />
              <Picker.Item label="Conta 1" value="1" />
              <Picker.Item label="Conta 2" value="2" />
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <ThemedText>Categoria</ThemedText>
            <Picker
              selectedValue={categoriaSelecionada}
              onValueChange={setCategoriaSelecionada}
              style={styles.picker}>
              <Picker.Item label="Todas as categorias" value="" />
              <Picker.Item label="Alimentação" value="alimentacao" />
              <Picker.Item label="Transporte" value="transporte" />
              <Picker.Item label="Lazer" value="lazer" />
              <Picker.Item label="Salário" value="salario" />
              <Picker.Item label="Freelance" value="freelance" />
            </Picker>
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
  input: {
    backgroundColor: Colors.dark.cardBackground,
    color: Colors.dark.text,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    backgroundColor: Colors.dark.cardBackground,
    color: Colors.dark.text,
  },
});