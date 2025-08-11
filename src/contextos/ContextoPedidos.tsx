import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedido } from '../tipos';
import { ItemCarrinho } from './ContextoCarrinho';
import { enviarNotificacaoPedidoEnviado } from '../servicos/ServicoNotificacoes';

type NovoPedidoData = {
  itens: ItemCarrinho[];
  total: number;
  enderecoEntrega: any;
}

interface ContextoPedidosType {
  pedidos: Pedido[];
  adicionarPedido: (novoPedidoData: NovoPedidoData) => void;
  excluirPedido: (idPedido: string) => void;
  atualizarStatusPedido: (idPedido: string, status: Pedido['status'], codigoRastreio?: string) => void;
  estaCarregando: boolean;
}

const ContextoPedidos = createContext<ContextoPedidosType | undefined>(undefined);

export function FornecedorPedidos({ children }: PropsWithChildren<{}>) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);


  useEffect(() => {
    async function carregarPedidos() {
      try {
        const pedidosSalvos = await AsyncStorage.getItem('@WRDistribuidora:pedidos');
        if (pedidosSalvos) {
          const pedidosParse = JSON.parse(pedidosSalvos).map((p: Pedido) => ({...p, data: new Date(p.data)}));
          setPedidos(pedidosParse);
        }
      } catch (e) {
        console.error("Falha ao carregar os pedidos.", e);
      } finally {
        setEstaCarregando(false);
      }
    }
    carregarPedidos();
  }, []);

  useEffect(() => {
    if (!estaCarregando) {
      AsyncStorage.setItem('@WRDistribuidora:pedidos', JSON.stringify(pedidos));
    }
  }, [pedidos, estaCarregando]);

  const adicionarPedido = (novoPedidoData: NovoPedidoData) => {
    const pedidoCompleto: Pedido = {
      ...novoPedidoData,
      id: Date.now().toString(),
      data: new Date(),
      status: 'Aguardando Confirmação', // Status inicial
      codigoRastreio: `WR${Math.floor(Math.random() * 1000000)}BR`,
    };
    setPedidos((estadoAtual) => [pedidoCompleto, ...estadoAtual]);
  };

  const excluirPedido = (idPedido: string) => {
    setPedidos((estadoAtual) => estadoAtual.filter((p) => p.id !== idPedido));
  };

  const atualizarStatusPedido = (idPedido: string, status: Pedido['status'], codigoRastreio?: string) => {
    setPedidos(estadoAtual => {
      const pedidosAtualizados = estadoAtual.map(p => 
        p.id === idPedido 
          ? { ...p, status, codigoRastreio: codigoRastreio ?? p.codigoRastreio } 
          : p
      );

      
      const pedidoAtualizado = pedidosAtualizados.find(p => p.id === idPedido);
      if (pedidoAtualizado && status === 'Enviado') {
        enviarNotificacaoPedidoEnviado(pedidoAtualizado);
      }

      return pedidosAtualizados;
    });
  };

  const valor = { pedidos, adicionarPedido, excluirPedido, atualizarStatusPedido, estaCarregando };


  return <ContextoPedidos.Provider value={valor}>{children}</ContextoPedidos.Provider>;
}

export function usePedidos() {
  const contexto = useContext(ContextoPedidos);
  if (contexto === undefined) {
    throw new Error('usePedidos deve ser usado dentro de um FornecedorPedidos');
  }
  return contexto;
}