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