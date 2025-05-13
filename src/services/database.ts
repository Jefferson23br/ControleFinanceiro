import * as SQLite from 'expo-sqlite';
import { Conta, Movimentacao, Meta, Lancamento, Categoria } from '@/types';

const db = SQLite.openDatabaseSync('financeiro.db');

// Inicializar o banco de dados
export const initDatabase = () => {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS despesas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT,
      valor REAL,
      data TEXT,
      categoria TEXT,
      conta_id INTEGER
    );
    CREATE TABLE IF NOT EXISTS receitas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT,
      valor REAL,
      data TEXT,
      categoria TEXT,
      conta_id INTEGER
    );
    CREATE TABLE IF NOT EXISTS movimentacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT,
      valor REAL,
      data TEXT,
      tipo TEXT,
      conta_id INTEGER
    );
    CREATE TABLE IF NOT EXISTS metas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      valor REAL
    );
    CREATE TABLE IF NOT EXISTS contas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      saldo_inicial REAL,
      tipo TEXT
    );
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT
    );
  `);
};

// Funções para Despesa
export const saveDespesa = (descricao: string, valor: number, data: string, categoria: string, contaId?: number) => {
  db.runSync(
    'INSERT INTO despesas (descricao, valor, data, categoria, conta_id) VALUES (?, ?, ?, ?, ?)',
    [descricao, valor, data, categoria, contaId || null]
  );
};

// Funções para Receita
export const saveReceita = (descricao: string, valor: number, data: string, categoria: string, contaId?: number) => {
  db.runSync(
    'INSERT INTO receitas (descricao, valor, data, categoria, conta_id) VALUES (?, ?, ?, ?, ?)',
    [descricao, valor, data, categoria, contaId || null]
  );
};

// Funções para Movimentações
export const getMovimentacoes = (): Movimentacao[] => {
  const despesas = db.getAllSync('SELECT *, "despesa" as tipo FROM despesas') as Movimentacao[];
  const receitas = db.getAllSync('SELECT *, "receita" as tipo FROM receitas') as Movimentacao[];
  return [...despesas, ...receitas].sort((a: Movimentacao, b: Movimentacao) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );
};

// Funções para Metas
export const getMetas = (): Meta[] => {
  return db.getAllSync('SELECT * FROM metas') as Meta[];
};

export const saveMeta = (nome: string, valor: number) => {
  db.runSync('INSERT INTO metas (nome, valor) VALUES (?, ?)', [nome, valor]);
};

export const updateMeta = (id: number, nome: string, valor: number) => {
  db.runSync('UPDATE metas SET nome = ?, valor = ? WHERE id = ?', [nome, valor, id]);
};

export const deleteMeta = (id: number) => {
  db.runSync('DELETE FROM metas WHERE id = ?', [id]);
};

// Funções para Contas
export const getContas = (): Conta[] => {
  return db.getAllSync('SELECT * FROM contas') as Conta[];
};

export const saveConta = (nome: string, saldoInicial: number, tipo: string) => {
  db.runSync('INSERT INTO contas (nome, saldo_inicial, tipo) VALUES (?, ?, ?)', [nome, saldoInicial, tipo]);
};

export const updateConta = (id: number, nome: string, saldoInicial: number, tipo: string) => {
  db.runSync('UPDATE contas SET nome = ?, saldo_inicial = ?, tipo = ? WHERE id = ?', [nome, saldoInicial, tipo, id]);
};

export const deleteConta = (id: number) => {
  db.runSync('DELETE FROM contas WHERE id = ?', [id]);
};

// Funções para Categorias
export const getCategorias = (): Categoria[] => {
  return db.getAllSync('SELECT * FROM categorias') as Categoria[];
};

export const saveCategoria = (nome: string) => {
  db.runSync('INSERT INTO categorias (nome) VALUES (?)', [nome]);
};

export const updateCategoria = (id: number, nome: string) => {
  db.runSync('UPDATE categorias SET nome = ? WHERE id = ?', [nome, id]);
};

export const deleteCategoria = (id: number) => {
  db.runSync('DELETE FROM categorias WHERE id = ?', [id]);
};

// Funções para Lançamentos
export const getLancamentos = (): Lancamento[] => {
  const despesas = db.getAllSync('SELECT *, "despesa" as tipo FROM despesas') as Lancamento[];
  const receitas = db.getAllSync('SELECT *, "receita" as tipo FROM receitas') as Lancamento[];
  return [...despesas, ...receitas].sort((a: Lancamento, b: Lancamento) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );
};

export const saveLancamento = (lancamento: Lancamento) => {
  if (lancamento.tipo === 'despesa') {
    saveDespesa(
      lancamento.descricao,
      lancamento.valor,
      lancamento.data,
      lancamento.categoria,
      lancamento.contaId
    );
  } else {
    saveReceita(
      lancamento.descricao,
      lancamento.valor,
      lancamento.data,
      lancamento.categoria,
      lancamento.contaId
    );
  }
};

export const updateLancamento = (lancamento: Lancamento) => {
  if (lancamento.tipo === 'despesa') {
    db.runSync(
      'UPDATE despesas SET descricao = ?, valor = ?, data = ?, categoria = ?, conta_id = ? WHERE id = ?',
      [lancamento.descricao, lancamento.valor, lancamento.data, lancamento.categoria, lancamento.contaId || null, lancamento.id]
    );
  } else {
    db.runSync(
      'UPDATE receitas SET descricao = ?, valor = ?, data = ?, categoria = ?, conta_id = ? WHERE id = ?',
      [lancamento.descricao, lancamento.valor, lancamento.data, lancamento.categoria, lancamento.contaId || null, lancamento.id]
    );
  }
};

// Função para calcular saldo da conta
export const getSaldoConta = (contaId: number): number => {
  const receitas = db.getAllSync('SELECT valor FROM receitas WHERE conta_id = ?', [contaId]) as { valor: number }[];
  const despesas = db.getAllSync('SELECT valor FROM despesas WHERE conta_id = ?', [contaId]) as { valor: number }[];
  const conta = db.getFirstSync('SELECT saldo_inicial FROM contas WHERE id = ?', [contaId]) as { saldo_inicial: number };

  const totalReceitas = receitas.reduce((sum: number, r: { valor: number }) => sum + r.valor, 0);
  const totalDespesas = despesas.reduce((sum: number, d: { valor: number }) => sum + d.valor, 0);
  return (conta?.saldo_inicial || 0) + totalReceitas - totalDespesas;
};