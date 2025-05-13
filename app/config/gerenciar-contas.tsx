import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../../constants/Colors';
import { getContas, saveConta, updateConta, deleteConta } from '@/services/database';
import { Conta } from '@/types';

export default function GerenciarContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [novaConta, setNovaConta] = useState({ nome: '', saldoInicial: 0, tipo: 'corrente' });
  const [editingConta, setEditingConta] = useState<Conta | null>(null);

  useEffect(() => {
    const fetchContas = async () => {
      const data = await getContas();
      setContas(data);
    };
    fetchContas();
  }, []);

  const handleSave = async () => {
    if (editingConta) {
      await updateConta(editingConta.id, novaConta.nome, novaConta.saldoInicial, novaConta.tipo);
      setEditingConta(null);
    } else {
      await saveConta(novaConta.nome, novaConta.saldoInicial, novaConta.tipo);
    }
    setNovaConta({ nome: '', saldoInicial: 0, tipo: 'corrente' });
    const updatedContas = await getContas();
    setContas(updatedContas);
  };

  const handleEdit = (conta: Conta) => {
    setEditingConta(conta);
    setNovaConta({ nome: conta.nome, saldoInicial: conta.saldo_inicial, tipo: conta.tipo });
  };

  const handleDelete = async (id: number) => {
    await deleteConta(id);
    const updatedContas = await getContas();
    setContas(updatedContas);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.headerButton}>Voltar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/' as any)}>
            <ThemedText style={styles.headerButton}>Home</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText type="title">Gerenciar Contas</ThemedText>
        <View style={styles.card}>
          <ThemedText>Nova Conta</ThemedText>
          <TextInput
            style={styles.textInput}
            value={novaConta.nome}
            onChangeText={(text) => setNovaConta({ ...novaConta, nome: text })}
            placeholder="Nome da conta"
          />
          <TextInput
            style={styles.textInput}
            value={novaConta.saldoInicial.toString()}
            onChangeText={(text) => setNovaConta({ ...novaConta, saldoInicial: parseFloat(text) || 0 })}
            placeholder="Saldo inicial"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.textInput}
            value={novaConta.tipo}
            onChangeText={(text) => setNovaConta({ ...novaConta, tipo: text })}
            placeholder="Tipo (ex.: corrente)"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
            <ThemedText style={styles.submitText}>{editingConta ? 'Atualizar' : 'Adicionar'}</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Contas Existentes</ThemedText>
          <FlatList
            data={contas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <ThemedText>
                  {item.nome} - Saldo: R${item.saldo_inicial} - Tipo: {item.tipo}
                </ThemedText>
                <View style={styles.buttons}>
                  <TouchableOpacity onPress={() => handleEdit(item)} style={styles.button}>
                    <ThemedText>Editar</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.button}>
                    <ThemedText>Excluir</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerButton: {
    fontSize: 16,
    color: Colors.dark.tint,
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
  textInput: {
    backgroundColor: Colors.dark.cardBackground,
    color: Colors.dark.text,
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    marginBottom: 8,
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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: Colors.dark.buttonBackground,
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});