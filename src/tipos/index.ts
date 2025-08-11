import { NavigatorScreenParams } from '@react-navigation/native';
import { ItemCarrinho } from '../contextos/ContextoCarrinho';

// Tipos de Dados
export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  categoria: string;
  imagemUrl: string;
}

export interface Usuario {
  nome: string;
  email: string;
  telefone: string;
}

export interface Endereco {
  id: string;
  rua: string;
  numero: string;
  cidade: string;
  cep: string;
}

export interface Cartao {
  id: string;
  nomeTitular: string;
  ultimosDigitos: string;
  validade: string;
}

export interface ConfiguracoesNotificacao {
  email: boolean;
  whatsapp: boolean;
}

export interface Pedido {
  id: string;
  data: Date;
  itens: any[];
  total: number;
  enderecoEntrega: any; 
  status: 'Aguardando Confirmação' | 'Processando' | 'Enviado' | 'Entregue';
  codigoRastreio: string;
}

 
export type PilhaClienteParamList = {
  Catalogo: undefined;
  DetalhesDoProduto: { produto: Produto };
  Carrinho: undefined;
  Checkout: undefined;
};

export type PilhaPedidosParamList = {
  ListaPedidos: undefined;
  DetalhesPedido: { pedido: Pedido };
  Rastreamento: { pedido: Pedido }; 
};

export type PilhaPerfilParamList = {
  PerfilPrincipal: undefined;
  MeusDados: undefined;
  MeusEnderecos: undefined;
  AdicionarEndereco: undefined;  
  MeusCartoes: undefined;
  "Meus Pedidos": NavigatorScreenParams<PilhaPedidosParamList>;
  ListaDesejos: undefined;
  Notificacoes: undefined;
};

export type PilhaAdminParamList = {
  PainelPrincipal: undefined;
  GerenciarProdutos: undefined;
  EditarProduto: { idProduto?: string };
  GerenciarPedidos: undefined;
  DetalhesPedidoAdmin: { idPedido: string };
};


export type NavegadorDrawerParamList = {
  Loja: NavigatorScreenParams<PilhaClienteParamList>;
  Perfil: NavigatorScreenParams<PilhaPerfilParamList>;
  PainelAdmin: NavigatorScreenParams<PilhaAdminParamList>; 
};

export type PilhaAutenticacaoParamList = {
  Login: undefined;
  Cadastro: undefined;
};
