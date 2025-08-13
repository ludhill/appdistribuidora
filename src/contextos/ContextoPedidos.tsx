import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Pedido, Usuario } from '../tipos';
import { useAutenticacao } from './ContextoAutenticacao';
import { ItemCarrinho } from './ContextoCarrinho';
import { useProdutos } from './ContextoProdutos';
import { enviarNotificacaoPedidoEnviado } from '../servicos/ServicoNotificacoes';

type NovoPedidoData = {
  itens: ItemCarrinho[];
  total: number;
  enderecoEntrega: any;
  clienteId: string;
  clienteDados: Usuario;
}

interface ContextoPedidosType {
  pedidos: Pedido[];
  adicionarPedido: (novoPedidoData: NovoPedidoData) => Promise<void>;
  excluirPedido: (idPedido: string) => Promise<void>;
  atualizarStatusPedido: (idPedido: string, status: Pedido['status'], codigoRastreio?: string) => void;
  estaCarregando: boolean;
}

const ContextoPedidos = createContext<ContextoPedidosType | undefined>(undefined);

export function FornecedorPedidos({ children }: PropsWithChildren<{}>) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);
  const { estado: estadoAuth } = useAutenticacao();
  const { baixarEstoque, retornarEstoque } = useProdutos();

  useEffect(() => {
    if (!estadoAuth.usuario) {
      setPedidos([]);
      setEstaCarregando(false);
      return;
    }

    const colecaoPedidosRef = collection(db, 'pedidos');
    // Se for admin, busca todos os pedidos. Se for cliente, filtra pelo seu ID.
    const q = estadoAuth.dadosCompletos?.perfil === 'admin'
      ? colecaoPedidosRef
      : query(colecaoPedidosRef, where("clienteId", "==", estadoAuth.usuario.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pedidosCarregados: Pedido[] = [];
      querySnapshot.forEach((doc) => {
        const dados = doc.data();
        pedidosCarregados.push({ 
          id: doc.id, 
          ...dados,
          data: dados.data.toDate(),
        } as Pedido);
      });
      setPedidos(pedidosCarregados);
      setEstaCarregando(false);
    });

    return () => unsubscribe();
  }, [estadoAuth.usuario]);

  const adicionarPedido = async (novoPedidoData: NovoPedidoData) => {
    await addDoc(collection(db, 'pedidos'), {
      ...novoPedidoData,
      data: new Date(),
      status: 'Aguardando Pagamento',
      codigoRastreio: '',
    });
  };

  const excluirPedido = async (idPedido: string) => {
    await deleteDoc(doc(db, 'pedidos', idPedido));
  };

  const atualizarStatusPedido = (idPedido: string, status: Pedido['status'], codigoRastreio?: string) => {
    const pedidoOriginal = pedidos.find(p => p.id === idPedido);
    if (!pedidoOriginal) return;
    
    const docRef = doc(db, 'pedidos', idPedido);
    updateDoc(docRef, { status, codigoRastreio: codigoRastreio ?? pedidoOriginal.codigoRastreio });

    if (pedidoOriginal.status === 'Aguardando Pagamento' && status === 'Processando') {
      baixarEstoque(pedidoOriginal.itens);
    } 
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