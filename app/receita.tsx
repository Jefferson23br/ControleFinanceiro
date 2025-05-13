import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../constants/Colors';
import { saveReceita } from '@/services/database';

export default function Receita() {
  const [novaReceita, setNovaReceita] = useState({
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    categoria: '',
  });

  const handleSave = async () => {
    await saveReceita(
      novaReceita.descricao,
      parseFloat(novaReceita.valor) || 0,
      novaReceita.data,
      novaReceita.categoria
    );
    setNovaReceita({ descricao: '', valor: '', data: new Date().toISOString().split('T')[0], categoria: '' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Adicionar Receita</ThemedText>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={novaReceita.descricao}
            onChangeText={(text) => setNovaReceita({ ...novaReceita, descricao: text })}
            placeholder="Descrição"
            placeholderTextColor={Colors.dark.text}
          />
          <TextInput
            style={styles.input}
            value={novaReceita.valor}
            onChangeText={(text) => setNovaReceita({ ...novaReceita, valor: text })}
            placeholder="Valor"
            keyboardType="numeric"
            placeholderTextColor={Colors.dark.text}
          />
          <TextInput
            style={styles.input}
            value={novaReceita.data}
            onChangeText={(text) => setNovaReceita({ ...novaReceita, data: text })}
            placeholder="Data (YYYY-MM-DD)"
            placeholderTextColor={Colors.dark.text}
          />
          <TextInput
            style={styles.input}
            value={novaReceita.categoria}
            onChangeText={(text) => setNovaReceita({ ...novaReceita, categoria: text })}
            placeholder="Categoria"
            placeholderTextColor={Colors.dark.text}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
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
  form: {
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    width: '100%',
  },
  input: {
    backgroundColor: Colors.dark.cardBackground,
    color: Colors.dark.text,
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    marginBottom: 8,
    width: '100%',
  },
  submitButton: {
    backgroundColor: Colors.dark.buttonBackground,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
});