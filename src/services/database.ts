import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('controlefinanceiro.db');

export interface Lancamento {
  id: number;
  conta_id: number;
  categoria_id: number;
  valor: number;
  data: string;
  descricao: string;
  tipo: string;
}

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

export const initDatabase = async () => {
  try {
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
        tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa'))
      );
      CREATE TABLE IF NOT EXISTS lancamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conta_id INTEGER,
        categoria_id INTEGER,
        valor REAL NOT NULL,
        data TEXT NOT NULL,
        descricao TEXT,
        tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
        FOREIGN KEY (conta_id) REFERENCES contas(id),
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
      );
    `);

    const contasResult = await db.getAllAsync('SELECT * FROM contas LIMIT 1');
    if (contasResult.length === 0) {
      await db.runAsync('INSERT INTO contas (nome, saldo_inicial, tipo) VALUES (?, ?, ?)', ['Conta Padrão', 0, 'corrente']);
    }

    const categoriasResult = await db.getAllAsync('SELECT * FROM categorias LIMIT 1');
    if (categoriasResult.length === 0) {
      await db.runAsync('INSERT INTO categorias (nome, tipo) VALUES (?, ?)', ['Salário', 'receita']);
      await db.runAsync('INSERT INTO categorias (nome, tipo) VALUES (?, ?)', ['Alimentação', 'despesa']);
    }
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  }
};

export const getContas = async (): Promise<Conta[]> => {
  try {
    const result = await db.getAllAsync('SELECT * FROM contas');
    return result as Conta[];
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    return [];
  }
};

export const getCategorias = async (tipo?: string): Promise<Categoria[]> => {
  try {
    const query = tipo ? 'SELECT * FROM categorias WHERE tipo = ?' : 'SELECT * FROM categorias';
    const params = tipo ? [tipo] : [];
    const result = await db.getAllAsync(query, params);
    return result as Categoria[];
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
};

export const getLancamentos = async (): Promise<Lancamento[]> => {
  try {
    const result = await db.getAllAsync('SELECT * FROM lancamentos');
    return result as Lancamento[];
  } catch (error) {
    console.error('Erro ao buscar lançamentos:', error);
    return [];
  }
};

export const getSaldoConta = async (contaId: number): Promise<number> => {
  try {
    const result = await db.getFirstAsync('SELECT saldo_inicial FROM contas WHERE id = ?', [contaId]);
    return (result as Conta)?.saldo_inicial || 0;
  } catch (error) {
    console.error('Erro ao buscar saldo da conta:', error);
    return 0;
  }
};

export const saveLancamento = async (
  contaId: number,
  categoriaId: number,
  valor: number,
  data: string,
  descricao: string,
  tipo: string
): Promise<void> => {
  try {
    await db.runAsync(
      'INSERT INTO lancamentos (conta_id, categoria_id, valor, data, descricao, tipo) VALUES (?, ?, ?, ?, ?, ?)',
      [contaId, categoriaId, valor, data, descricao, tipo]
    );
    await updateContaSaldo(contaId, valor, tipo);
  } catch (error) {
    console.error('Erro ao salvar lançamento:', error);
  }
};

export const updateLancamento = async (
  id: number,
  contaId: number,
  categoriaId: number,
  valor: number,
  data: string,
  descricao: string,
  tipo: string
): Promise<void> => {
  try {
    await db.runAsync(
      'UPDATE lancamentos SET conta_id = ?, categoria_id = ?, valor = ?, data = ?, descricao = ?, tipo = ? WHERE id = ?',
      [contaId, categoriaId, valor, data, descricao, tipo, id]
    );
  } catch (error) {
    console.error('Erro ao atualizar lançamento:', error);
  }
};

export const deleteLancamento = async (id: number): Promise<void> => {
  try {
    const lancamento = await db.getFirstAsync('SELECT conta_id, valor, tipo FROM lancamentos WHERE id = ?', [id]) as Lancamento;
    if (lancamento) {
      await db.runAsync('DELETE FROM lancamentos WHERE id = ?', [id]);
      await updateContaSaldo(lancamento.conta_id, lancamento.valor, lancamento.tipo === 'receita' ? '-' : '+');
    }
  } catch (error) {
    console.error('Erro ao deletar lançamento:', error);
  }
};

export const updateContaSaldo = async (contaId: number, valor: number, tipo: string): Promise<void> => {
  try {
    const operacao = tipo === 'receita' ? '+' : '-';
    await db.runAsync(
      `UPDATE contas SET saldo_inicial = saldo_inicial ${operacao} ? WHERE id = ?`,
      [valor, contaId]
    );
  } catch (error) {
    console.error('Erro ao atualizar saldo da conta:', error);
  }
};