import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../../constants/Colors';
import { getContas, insertConta, updateConta, deleteConta, getCategorias, insertCategoria, updateCategoria, deleteCategoria } from '@/services/database';
import { Conta, Categoria } from '../../src/types';

export default function Configuracoes() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [newConta, setNewConta] = useState({ nome: '', saldo_inicial: 0, tipo: '' });
  const [newCategoria, setNewCategoria] = useState({ nome: '', tipo: '' });

  useEffect(() => {
    const fetchData = async () => {
      const contasData = await getContas();
      const categoriasData = await getCategorias();
      setContas(contasData);
      setCategorias(categoriasData);
    };
    fetchData();
  }, []);

  const handleAddConta = async () => {
    if (newConta.nome && newConta.tipo) {
      await insertConta(newConta.nome, newConta.saldo_inicial, newConta.tipo);
      setNewConta({ nome: '', saldo_inicial: 0, tipo: '' });
      const updatedContas = await getContas();
      setContas(updatedContas);
    }
  };

  const handleAddCategoria = async () => {
    if (newCategoria.nome && newCategoria.tipo) {
      await insertCategoria(newCategoria.nome, newCategoria.tipo);
      setNewCategoria({ nome: '', tipo: '' });
      const updatedCategorias = await getCategorias();
      setCategorias(updatedCategorias);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Configurações</ThemedText>
        <View style={styles.card}>
          <ThemedText type="subtitle">Gerenciar Contas</ThemedText>
          {contas.map((conta) => (
            <View key={conta.id} style={styles.item}>
              <ThemedText>{conta.nome} - R${conta.saldo_inicial}</ThemedText>
              <TouchableOpacity style={styles.button}>
                <ThemedText>Editar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <ThemedText>Excluir</ThemedText>
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.inputContainer}>
            <ThemedText>Nome</ThemedText>
            <ThemedText>{newConta.nome}</ThemedText> {/* Substitua por TextInput */}
            <ThemedText>Tipo</ThemedText>
            <ThemedText>{newConta.tipo}</ThemedText> {/* Substitua por TextInput */}
            <TouchableOpacity onPress={handleAddConta} style={styles.submitButton}>
              <ThemedText>Adicionar Conta</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Gerenciar Categorias</ThemedText>
          {categorias.map((categoria) => (
            <View key={categoria.id} style={styles.item}>
              <ThemedText>{categoria.nome}</ThemedText>
              <TouchableOpacity style={styles.button}>
                <ThemedText>Editar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <ThemedText>Excluir</ThemedText>
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.inputContainer}>
            <ThemedText>Nome</ThemedText>
            <ThemedText>{newCategoria.nome}</ThemedText> {/* Substitua por TextInput */}
            <ThemedText>Tipo</ThemedText>
            <ThemedText>{newCategoria.tipo}</ThemedText> {/* Substitua por TextInput */}
            <TouchableOpacity onPress={handleAddCategoria} style={styles.submitButton}>
              <ThemedText>Adicionar Categoria</ThemedText>
            </TouchableOpacity>
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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
  },
  inputContainer: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.dark.buttonBackground,
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: Colors.dark.buttonBackground,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});