import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produto } from '../tipos';

export interface ItemCarrinho extends Produto {
  quantidade: number;
}

interface ContextoCarrinhoType {
  itens: ItemCarrinho[];
  adicionarAoCarrinho: (produto: Produto) => void;
  aumentarQuantidade: (idProduto: string) => void;
  diminuirQuantidade: (idProduto: string) => void;
  limparCarrinho: () => void;
  estaCarregando: boolean;
}

const ContextoCarrinho = createContext<ContextoCarrinhoType | undefined>(undefined);

export function FornecedorCarrinho({ children }: PropsWithChildren<{}>) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);

  useEffect(() => {
    async function carregarCarrinho() {
      try {
        const carrinhoSalvo = await AsyncStorage.getItem('@WRDistribuidora:carrinho');
        if (carrinhoSalvo !== null) {
          setItens(JSON.parse(carrinhoSalvo));
        }
      } catch (e) {
        console.error("Falha ao carregar o carrinho.", e);
      } finally {
        setEstaCarregando(false);
      }
    }
    carregarCarrinho();
  }, []);

  useEffect(() => {
    if (!estaCarregando) {
      AsyncStorage.setItem('@WRDistribuidora:carrinho', JSON.stringify(itens));
    }
  }, [itens, estaCarregando]);

  const adicionarAoCarrinho = (produto: Produto) => {
    setItens((estado) => {
      const itemExistente = estado.find((item) => item.id === produto.id);
      if (itemExistente) {
        return estado.map((item) =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...estado, { ...produto, quantidade: 1 }];
    });
  };

  const aumentarQuantidade = (idProduto: string) => {
    setItens((estado) =>
      estado.map((item) =>
        item.id === idProduto ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  const diminuirQuantidade = (idProduto: string) => {
    setItens((estado) => {
      const itemAlvo = estado.find((item) => item.id === idProduto);
      if (itemAlvo?.quantidade === 1) {
        return estado.filter((item) => item.id !== idProduto);
      }
      return estado.map((item) =>
        item.id === idProduto ? { ...item, quantidade: item.quantidade - 1 } : item
      );
    });
  };

  const limparCarrinho = () => setItens([]);

  const valor = { itens, adicionarAoCarrinho, aumentarQuantidade, diminuirQuantidade, limparCarrinho, estaCarregando };

  return <ContextoCarrinho.Provider value={valor}>{children}</ContextoCarrinho.Provider>;
}

export function useCarrinho() {
  const contexto = useContext(ContextoCarrinho);
  if (contexto === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de um FornecedorCarrinho');
  }
  return contexto;
}
