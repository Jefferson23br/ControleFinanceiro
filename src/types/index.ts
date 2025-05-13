export interface Conta {
  id: number;
  nome: string;
  saldo_inicial: number;
  tipo: string;
}

export interface Movimentacao {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: string;
  categoria?: string;
  conta_id?: number;
}

export interface Meta {
  id: number;
  nome: string;
  valor: number;
}

export interface Lancamento {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: string;
  categoria: string;
  contaId?: number;
}

export interface Categoria {
  id: number;
  nome: string;
}