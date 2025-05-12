import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
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
  const [saldosContas, setSaldosContas] = useState<{ [key: number]: number }>({});
  const [selectedMonth, setSelectedMonth] = useState<string>('2025-04');
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);

  const getNextMonth = (current: string) => {
    const [year, month] = current.split('-').map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    return `${nextYear}-${nextMonth.toString().padStart(2, '0')}`;
  };

  const getPrevMonth = (current: string) => {
    const [year, month] = current.split('-').map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    return `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lancamentosData = await getLancamentos();
        const contasData = await getContas();
        const filteredLancamentos = lancamentosData.filter((l: Lancamento) => l.data.startsWith(selectedMonth));

        const receitas = filteredLancamentos
          .filter((l: Lancamento) => l.tipo === 'receita')
          .reduce((sum: number, l: Lancamento) => sum + l.valor, 0);
        const despesas = filteredLancamentos
          .filter((l: Lancamento) => l.tipo === 'despesa')
          .reduce((sum: number, l: Lancamento) => sum + l.valor, 0);

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
        setSaldosContas(saldos);
        setLancamentos(lancamentosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, [selectedMonth]);

  const receitaCategories = Array.from(
    new Set(lancamentos.filter((l: Lancamento) => l.tipo === 'receita').map((l: Lancamento) => l.categoria_id))
  ).map((catId) => ({
    name: `Cat ${catId}`, // Substitua por nome real da categoria
    population: lancamentos.filter((l: Lancamento) => l.tipo === 'receita' && l.categoria_id === catId).reduce((sum: number, l: Lancamento) => sum + l.valor, 0),
    color: Colors.dark.chartGreen,
    legendFontColor: Colors.dark.text,
    legendFontSize: 12,
  }));

  const despesaCategories = Array.from(
    new Set(lancamentos.filter((l: Lancamento) => l.tipo === 'despesa').map((l: Lancamento) => l.categoria_id))
  ).map((catId) => ({
    name: `Cat ${catId}`, // Substitua por nome real da categoria
    population: lancamentos.filter((l: Lancamento) => l.tipo === 'despesa' && l.categoria_id === catId).reduce((sum: number, l: Lancamento) => sum + l.valor, 0),
    color: Colors.dark.chartRed,
    legendFontColor: Colors.dark.text,
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundColor: Colors.dark.cardBackground,
    backgroundGradientFrom: Colors.dark.cardBackground,
    backgroundGradientTo: Colors.dark.cardBackground,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  const [year, month] = selectedMonth.split('-');
  const monthName = new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long' });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.balanceCard}>
          <ThemedText type="title">Saldo Total</ThemedText>
          <ThemedText style={styles.balanceText}>R${saldoTotal.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => setSelectedMonth(getPrevMonth(selectedMonth))}>
            <ThemedText style={styles.arrow}>&lt;</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.monthText}>{` ${monthName} / ${year} `}</ThemedText>
          <TouchableOpacity onPress={() => setSelectedMonth(getNextMonth(selectedMonth))}>
            <ThemedText style={styles.arrow}>&gt;</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Receitas por Categoria</ThemedText>
          <PieChart
            data={receitaCategories}
            width={screenWidth - 64}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Despesas por Categoria</ThemedText>
          <PieChart
            data={despesaCategories}
            width={screenWidth - 64}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
        <View style={styles.card}>
          <ThemedText type="subtitle">Saldos por Conta</ThemedText>
          {contas.map((conta) => (
            <View key={conta.id} style={styles.subCard}>
              <ThemedText>{conta.nome}</ThemedText>
              <ThemedText style={styles.number}>R${(saldosContas[conta.id] || 0).toFixed(2)}</ThemedText>
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
  balanceCard: {
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  balanceText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.dark.text,
    textAlign: 'center',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginHorizontal: 10,
  },
  arrow: {
    fontSize: 18,
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
});