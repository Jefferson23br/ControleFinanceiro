import * as SQLite from 'expo-sqlite';

export interface Conta {
  id: number;
  nome: string;
  saldo_inicial: number;
  tipo: string;
}

export interface Categoria {
  id: number;
  nome: string;
  tipo: string;
}

export interface Lancamento {
  id: number;
  conta_id: number;
  categoria_id: number;
  valor: number;
  data: string;
  descricao: string;
  tipo: string;
}

export const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS contas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      saldo_inicial REAL NOT NULL,
      tipo TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      tipo TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS lancamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conta_id INTEGER,
      categoria_id INTEGER,
      valor REAL NOT NULL,
      data TEXT NOT NULL,
      descricao TEXT,
      tipo TEXT NOT NULL,
      FOREIGN KEY (conta_id) REFERENCES contas(id),
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    );
    CREATE TABLE IF NOT EXISTS metas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      valor_alvo REAL NOT NULL,
      valor_atual REAL NOT NULL,
      data_final TEXT NOT NULL
    );
  `);
};

export const insertConta = async (
  nome: string,
  saldo_inicial: number,
  tipo: string
): Promise<number> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  const result = await db.runAsync(
    'INSERT INTO contas (nome, saldo_inicial, tipo) VALUES (?, ?, ?);',
    [nome, saldo_inicial, tipo]
  );
  return result.lastInsertRowId;
};

export const getContas = async (): Promise<Conta[]> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  const contas = await db.getAllAsync<Conta>('SELECT * FROM contas;');
  return contas;
};

export const getCategorias = async (): Promise<Categoria[]> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  const categorias = await db.getAllAsync<Categoria>('SELECT * FROM categorias;');
  return categorias;
};

export const saveLancamento = async (
  conta_id: number,
  categoria_id: number,
  valor: number,
  data: string,
  descricao: string,
  tipo: string
): Promise<number> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  const result = await db.runAsync(
    'INSERT INTO lancamentos (conta_id, categoria_id, valor, data, descricao, tipo) VALUES (?, ?, ?, ?, ?, ?);',
    [conta_id, categoria_id, valor, data, descricao, tipo]
  );
  return result.lastInsertRowId;
};

export const updateContaSaldo = async (
  conta_id: number,
  valor: number,
  tipo: string
): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  const operador = tipo === 'receita' ? '+' : '-';
  await db.runAsync(
    `UPDATE contas SET saldo_inicial = saldo_inicial ${operador} ? WHERE id = ?;`,
    [valor, conta_id]
  );
};

export const getLancamentos = async (): Promise<Lancamento[]> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  const lancamentos = await db.getAllAsync<Lancamento>('SELECT * FROM lancamentos;');
  return lancamentos;
};

export const getSaldoConta = async (conta_id: number): Promise<number> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  const conta = await db.getFirstAsync<Conta>('SELECT saldo_inicial FROM contas WHERE id = ?;', [conta_id]);
  if (!conta) throw new Error(`Conta com id ${conta_id} não encontrada`);
  const lancamentos = await db.getAllAsync<Lancamento>('SELECT valor, tipo FROM lancamentos WHERE conta_id = ?;', [conta_id]);
  const saldo = lancamentos.reduce((acc, lanc) => {
    return lanc.tipo === 'receita' ? acc + lanc.valor : acc - lanc.valor;
  }, conta.saldo_inicial);
  return saldo;
};

export const insertCategoria = async (nome: string, tipo: string): Promise<number> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  const result = await db.runAsync(
    'INSERT INTO categorias (nome, tipo) VALUES (?, ?);',
    [nome, tipo]
  );
  return result.lastInsertRowId;
};

export const updateLancamento = async (
  id: number,
  conta_id: number,
  categoria_id: number,
  valor: number,
  data: string,
  descricao: string,
  tipo: string
): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  await db.runAsync(
    'UPDATE lancamentos SET conta_id = ?, categoria_id = ?, valor = ?, data = ?, descricao = ?, tipo = ? WHERE id = ?;',
    [conta_id, categoria_id, valor, data, descricao, tipo, id]
  );
};

export const deleteLancamento = async (id: number): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  await db.runAsync('DELETE FROM lancamentos WHERE id = ?;', [id]);
};

export const updateConta = async (
  id: number,
  nome: string,
  saldo_inicial: number,
  tipo: string
): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  await db.runAsync(
    'UPDATE contas SET nome = ?, saldo_inicial = ?, tipo = ? WHERE id = ?;',
    [nome, saldo_inicial, tipo, id]
  );
};

export const deleteConta = async (id: number): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  await db.runAsync('DELETE FROM lancamentos WHERE conta_id = ?;', [id]);
  await db.runAsync('DELETE FROM contas WHERE id = ?;', [id]);
};

export const updateCategoria = async (id: number, nome: string, tipo: string): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  await db.runAsync('UPDATE categorias SET nome = ?, tipo = ? WHERE id = ?;', [nome, tipo, id]);
};

export const deleteCategoria = async (id: number): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('controleFinanceiro.db');
  await db.runAsync('DELETE FROM lancamentos WHERE categoria_id = ?;', [id]);
  await db.runAsync('DELETE FROM categorias WHERE id = ?;', [id]);
};