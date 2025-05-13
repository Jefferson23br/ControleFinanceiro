import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../constants/Colors';
import { getMetas, saveMeta, updateMeta, deleteMeta } from '@/services/database';
import { Meta } from '@/types';

export default function Metas() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [novaMeta, setNovaMeta] = useState({ nome: '', valor: 0 });
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);

  useEffect(() => {
    const fetchMetas = async () => {
      const data = await getMetas();
      setMetas(data);
    };
    fetchMetas();
  }, []);

  const handleSave = async () => {
    if (editingMeta) {
      await updateMeta(editingMeta.id, novaMeta.nome, novaMeta.valor);
      setEditingMeta(null);
    } else {
      await saveMeta(novaMeta.nome, novaMeta.valor);
    }
    setNovaMeta({ nome: '', valor: 0 });
    const updatedMetas = await getMetas();
    setMetas(updatedMetas);
  };

  const handleEdit = (meta: Meta) => {
    setEditingMeta(meta);
    setNovaMeta({ nome: meta.nome, valor: meta.valor });
  };

  const handleDelete = async (id: number) => {
    await deleteMeta(id);
    const updatedMetas = await getMetas();
    setMetas(updatedMetas);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Metas</ThemedText>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={novaMeta.nome}
            onChangeText={(text) => setNovaMeta({ ...novaMeta, nome: text })}
            placeholder="Nome da Meta"
            placeholderTextColor={Colors.dark.text}
          />
          <TextInput
            style={styles.input}
            value={novaMeta.valor.toString()}
            onChangeText={(text) => setNovaMeta({ ...novaMeta, valor: parseFloat(text) || 0 })}
            placeholder="Valor"
            keyboardType="numeric"
            placeholderTextColor={Colors.dark.text}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
            <ThemedText style={styles.submitText}>{editingMeta ? 'Atualizar' : 'Adicionar'}</ThemedText>
          </TouchableOpacity>
        </View>
        {metas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>Sem Metas</ThemedText>
          </View>
        ) : (
          <FlatList
            data={metas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <ThemedText>
                  {item.nome} - R${item.valor}
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
        )}
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
    marginBottom: 16,
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
  },
  submitText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.dark.text,
    fontSize: 18,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
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