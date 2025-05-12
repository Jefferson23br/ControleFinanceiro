import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../../constants/Colors';

const screenWidth = Dimensions.get('window').width;

export default function Metas() {
  const [metas, setMetas] = useState<any[]>([]);
  const [selectedMeta, setSelectedMeta] = useState<any>(null);

  useEffect(() => {
    // Placeholder para fetch de metas (implementar em database)
    const mockMetas = [
      { id: '1', valorMeta: 2000, valorAtual: 500, contaId: '1', descricao: 'Meta para Conta 1', dataCriacao: new Date().toISOString() },
    ];
    setMetas(mockMetas);
    if (mockMetas.length > 0) setSelectedMeta(mockMetas[0]);
  }, []);

  const handleCriarMeta = () => {
    const novaMeta = {
      id: Date.now().toString(),
      valorMeta: 2000,
      valorAtual: 0,
      contaId: '1',
      descricao: 'Nova Meta',
      dataCriacao: new Date().toISOString(),
    };
    setMetas([...metas, novaMeta]);
    setSelectedMeta(novaMeta);
  };

  const handleEditarMeta = () => {
    if (selectedMeta) {
      const metaEditada = { ...selectedMeta, valorMeta: selectedMeta.valorMeta + 500 };
      setMetas(metas.map(m => m.id === metaEditada.id ? metaEditada : m));
      setSelectedMeta(metaEditada);
    }
  };

  const handleDeletarMeta = () => {
    if (selectedMeta) {
      setMetas(metas.filter(m => m.id !== selectedMeta.id));
      setSelectedMeta(metas.length > 1 ? metas[1] : null);
    }
  };

  const chartData = selectedMeta
    ? [
        {
          name: 'Alcançado',
          population: selectedMeta.valorAtual,
          color: Colors.dark.chartGreen,
          legendFontColor: Colors.dark.text,
          legendFontSize: 12,
        },
        {
          name: 'Falta',
          population: selectedMeta.valorMeta - selectedMeta.valorAtual,
          color: Colors.dark.chartRed,
          legendFontColor: Colors.dark.text,
          legendFontSize: 12,
        },
      ]
    : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Metas</ThemedText>
        <View style={styles.card}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCriarMeta}>
              <ThemedText>Criar Meta</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleEditarMeta} disabled={!selectedMeta}>
              <ThemedText>Editar Meta</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDeletarMeta} disabled={!selectedMeta}>
              <ThemedText>Deletar Meta</ThemedText>
            </TouchableOpacity>
          </View>
          {selectedMeta && (
            <>
              <ThemedText type="subtitle">Meta Selecionada: {selectedMeta.descricao}</ThemedText>
              <PieChart
                data={chartData}
                width={screenWidth - 64}
                height={200}
                chartConfig={{
                  backgroundColor: Colors.dark.cardBackground,
                  backgroundGradientFrom: Colors.dark.cardBackground,
                  backgroundGradientTo: Colors.dark.cardBackground,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
              <ThemedText>Valor Meta: R${selectedMeta.valorMeta.toFixed(2)}</ThemedText>
              <ThemedText>Valor Atual: R${selectedMeta.valorAtual.toFixed(2)}</ThemedText>
            </>
          )}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.dark.buttonBackground,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
});