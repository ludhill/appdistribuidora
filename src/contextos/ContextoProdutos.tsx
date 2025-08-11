import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produto } from '../tipos';
import { PRODUTOS_EXEMPLO } from '../constantes/dadosExemplo';  

interface ContextoProdutosType {
  produtos: Produto[];
  adicionarProduto: (novoProduto: Omit<Produto, 'id'>) => void;
  atualizarProduto: (produtoAtualizado: Produto) => void;
  excluirProduto: (idProduto: string) => void;
  estaCarregando: boolean;
}

const ContextoProdutos = createContext<ContextoProdutosType | undefined>(undefined);

export function FornecedorProdutos({ children }: PropsWithChildren<{}>) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dadosSalvos = await AsyncStorage.getItem('@WRDistribuidora:produtos');
        
        if (dadosSalvos) {
          setProdutos(JSON.parse(dadosSalvos));
        } else {
          setProdutos(PRODUTOS_EXEMPLO);
        }
      } catch (e) { console.error("Falha ao carregar produtos.", e); }
      finally { setEstaCarregando(false); }
    }
    carregarDados();
  }, []);

  useEffect(() => {
    if (!estaCarregando) {
      AsyncStorage.setItem('@WRDistribuidora:produtos', JSON.stringify(produtos));
    }
  }, [produtos, estaCarregando]);

  const adicionarProduto = (novoProduto: Omit<Produto, 'id'>) => {
    const produtoCompleto: Produto = { ...novoProduto, id: Date.now().toString() };
    setProdutos(estadoAtual => [...estadoAtual, produtoCompleto]);
  };

  const atualizarProduto = (produtoAtualizado: Produto) => {
    setProdutos(estadoAtual => 
      estadoAtual.map(p => p.id === produtoAtualizado.id ? produtoAtualizado : p)
    );
  };

  const excluirProduto = (idProduto: string) => {
    setProdutos(estadoAtual => estadoAtual.filter(p => p.id !== idProduto));
  };

  const valor = { produtos, adicionarProduto, atualizarProduto, excluirProduto, estaCarregando };

  return <ContextoProdutos.Provider value={valor}>{children}</ContextoProdutos.Provider>;
}

export function useProdutos() {
  const contexto = useContext(ContextoProdutos);
  if (contexto === undefined) {
    throw new Error('useProdutos deve ser usado dentro de um FornecedorProdutos');
  }
  return contexto;
}