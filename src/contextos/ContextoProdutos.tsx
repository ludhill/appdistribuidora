import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Produto } from '../tipos';
import { ItemCarrinho } from './ContextoCarrinho';
import { PRODUTOS_EXEMPLO } from '../constantes/dadosExemplo';

interface ContextoProdutosType {
  produtos: Produto[];
  adicionarProduto: (novoProduto: Omit<Produto, 'id'>) => Promise<void>;
  atualizarProduto: (produtoAtualizado: Produto) => Promise<void>;
  excluirProduto: (idProduto: string) => Promise<void>;
  baixarEstoque: (itens: ItemCarrinho[]) => Promise<void>;
  retornarEstoque: (itens: ItemCarrinho[]) => Promise<void>;
  estaCarregando: boolean;
}

const ContextoProdutos = createContext<ContextoProdutosType | undefined>(undefined);

export function FornecedorProdutos({ children }: PropsWithChildren<{}>) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);

  useEffect(() => {
    const colecaoProdutosRef = collection(db, 'produtos');
    const unsubscribe = onSnapshot(colecaoProdutosRef, (querySnapshot) => {
      const produtosCarregados: Produto[] = [];
      querySnapshot.forEach((doc) => {
        produtosCarregados.push({ id: doc.id, ...doc.data() } as Produto);
      });
      setProdutos(produtosCarregados);
      setEstaCarregando(false);
    });
    return () => unsubscribe();
  }, []); 

    const adicionarProduto = async (novoProduto: Omit<Produto, 'id'>) => {
    try {
      await addDoc(collection(db, 'produtos'), novoProduto);
    } catch (e) {
      console.error("Erro ao adicionar produto: ", e);
    }
  };

  const atualizarProduto = async (produtoAtualizado: Produto) => {
    try {
      const docRef = doc(db, 'produtos', produtoAtualizado.id);
      const { id, ...dadosParaAtualizar } = produtoAtualizado;
      await updateDoc(docRef, dadosParaAtualizar);
    } catch (e) {
      console.error("Erro ao atualizar produto: ", e);
    }
  };

  const excluirProduto = async (idProduto: string) => {
    try {
      await deleteDoc(doc(db, 'produtos', idProduto));
    } catch (e) {
      console.error("Erro ao excluir produto: ", e);
    }
  };

  const baixarEstoque = async (itens: ItemCarrinho[]) => {
    const batch = writeBatch(db);
    itens.forEach(item => {
      const produtoRef = doc(db, 'produtos', item.id);
      const produtoAtual = produtos.find(p => p.id === item.id);
      if (produtoAtual) {
        const novoEstoque = produtoAtual.estoque - item.quantidade;
        batch.update(produtoRef, { estoque: novoEstoque });
      }
    });
    await batch.commit();
  };

  const retornarEstoque = async (itens: ItemCarrinho[]) => {
    const batch = writeBatch(db);
    itens.forEach(item => {
      const produtoRef = doc(db, 'produtos', item.id);
      const produtoAtual = produtos.find(p => p.id === item.id);
      if (produtoAtual) {
        const novoEstoque = produtoAtual.estoque + item.quantidade;
        batch.update(produtoRef, { estoque: novoEstoque });
      }
    });
    await batch.commit();
  };

  const valor = { produtos, adicionarProduto, atualizarProduto, excluirProduto, baixarEstoque, retornarEstoque, estaCarregando };

  return <ContextoProdutos.Provider value={valor}>{children}</ContextoProdutos.Provider>;
}

export function useProdutos() {
  const contexto = useContext(ContextoProdutos);
  if (contexto === undefined) {
    throw new Error('useProdutos deve ser usado dentro de um FornecedorProdutos');
  }
  return contexto;
}
