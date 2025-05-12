import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '../../constants/Colors';
import { getLancamentos, getSaldoConta, getContas } from '@/services/database';
import { Lancamento, Conta } from '../../src/types';

const screenWidth = Dimensions.get('window').width;

export default function Home() {
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [contas, setContas] = useState<Conta[]>([]);
  const [saldosPorConta, setSaldosPorConta] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lancamentos = await getLancamentos();
        const contasData = await getContas();

        // Calcular totais
        const receitas = lancamentos
          .filter((l: Lancamento) => l.tipo === 'receita')
          .reduce((sum: number, l: Lancamento) => sum + l.valor, 0);
        const despesas = lancamentos
          .filter((l: Lancamento) => l.tipo === 'despesa')
          .reduce((sum: number, l: Lancamento) => sum + l.valor, 0);

        // Calcular saldo total e saldos por conta
        let saldo = 0;
        const saldos: { [key: number]: number } = {};
        for (const conta of contasData) {
          const saldoConta = await getSaldoConta(conta.id);
          saldos[conta.id] = saldoConta || 0;
          saldo += saldoConta || 0;
        }

        setTotalReceitas(receitas);
        setTotalDespesas(despesas);
        setSaldoTotal(saldo);
        setContas(contasData);
        setSaldosPorConta(saldos);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        data: [totalReceitas, totalDespesas],
        colors: [
          () => Colors.dark.chartGreen,
          () => Colors.dark.chartRed,
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: Colors.dark.cardBackground,
    backgroundGradientFrom: Colors.dark.cardBackground,
    backgroundGradientTo: Colors.dark.cardBackground,
    decimalPlaces: 2,
    color: () => Colors.dark.text,
    labelColor: () => Colors.dark.text,
    style: {
      borderRadius: 16,
    },
    propsForBars: {
      width: 40,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Visão Geral</ThemedText>
        <View style={styles.card}>
          <ThemedText type="subtitle">Saldo Total</ThemedText>
          <ThemedText style={styles.number}>
            R${saldoTotal.toFixed(2)}
          </ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Receitas vs Despesas</ThemedText>
          <BarChart
            style={styles.chart}
            data={chartData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            withCustomBarColorFromData={true}
            flatColor={true}
            showValuesOnTopOfBars={true}
            yAxisLabel=""
            yAxisSuffix=""
          />
          <View style={styles.chartLabels}>
            <ThemedText style={[styles.label, { color: Colors.dark.chartGreen }]}>
              Receitas: R${totalReceitas.toFixed(2)}
            </ThemedText>
            <ThemedText style={[styles.label, { color: Colors.dark.chartRed }]}>
              Despesas: R${totalDespesas.toFixed(2)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Saldos por Conta</ThemedText>
          {contas.map((conta) => (
            <View key={conta.id} style={styles.subCard}>
              <ThemedText>{conta.nome}</ThemedText>
              <ThemedText style={styles.number}>
                R${(saldosPorConta[conta.id] || 0).toFixed(2)}
              </ThemedText>
            </View>
          ))}
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
  subCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.dark.text,
  },
});