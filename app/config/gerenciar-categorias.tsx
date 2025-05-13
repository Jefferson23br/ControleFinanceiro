import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../../constants/Colors';
import { getCategorias, saveCategoria, updateCategoria, deleteCategoria } from '@/services/database';
import { Categoria } from '@/types';

export default function GerenciarCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategorias();
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

  const handleSave = async () => {
    if (editingCategoria) {
      await updateCategoria(editingCategoria.id, novaCategoria);
      setEditingCategoria(null);
    } else {
      await saveCategoria(novaCategoria);
    }
    setNovaCategoria('');
    const updatedCategorias = await getCategorias();
    setCategorias(updatedCategorias);
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setNovaCategoria(categoria.nome);
  };

  const handleDelete = async (id: number) => {
    await deleteCategoria(id);
    const updatedCategorias = await getCategorias();
    setCategorias(updatedCategorias);
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
        <ThemedText type="title">Gerenciar Categorias</ThemedText>
        <View style={styles.card}>
          <ThemedText>Nova Categoria</ThemedText>
          <TextInput
            style={styles.textInput}
            value={novaCategoria}
            onChangeText={setNovaCategoria}
            placeholder="Nome da categoria"
            placeholderTextColor={Colors.dark.text}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
            <ThemedText style={styles.submitText}>{editingCategoria ? 'Atualizar' : 'Adicionar'}</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Categorias Existentes</ThemedText>
          <FlatList
            data={categorias}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <ThemedText>{item.nome}</ThemedText>
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