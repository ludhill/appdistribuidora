import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produto } from '../tipos';

interface ContextoDesejosType {
  itensDesejados: Produto[];
  adicionarAosDesejos: (produto: Produto) => void;
  removerDosDesejos: (idProduto: string) => void;
  itemEstaNosDesejos: (idProduto: string) => boolean;
  estaCarregando: boolean;
}

const ContextoDesejos = createContext<ContextoDesejosType | undefined>(undefined);

export function FornecedorDesejos({ children }: PropsWithChildren<{}>) {
  const [itensDesejados, setItensDesejados] = useState<Produto[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dadosSalvos = await AsyncStorage.getItem('@WRDistribuidora:desejos');
        if (dadosSalvos) setItensDesejados(JSON.parse(dadosSalvos));
      } catch (e) { console.error("Falha ao carregar lista de desejos.", e); }
      finally { setEstaCarregando(false); }
    }
    carregarDados();
  }, []);

  useEffect(() => {
    if (!estaCarregando) {
      AsyncStorage.setItem('@WRDistribuidora:desejos', JSON.stringify(itensDesejados));
    }
  }, [itensDesejados, estaCarregando]);

  const adicionarAosDesejos = (produto: Produto) => {
    setItensDesejados((estadoAtual) => [...estadoAtual, produto]);
  };

  const removerDosDesejos = (idProduto: string) => {
    setItensDesejados((estadoAtual) => estadoAtual.filter((p) => p.id !== idProduto));
  };

  const itemEstaNosDesejos = (idProduto: string) => {
    return itensDesejados.some(p => p.id === idProduto);
  };

  const valor = { itensDesejados, adicionarAosDesejos, removerDosDesejos, itemEstaNosDesejos, estaCarregando };

  return <ContextoDesejos.Provider value={valor}>{children}</ContextoDesejos.Provider>;
}

export function useDesejos() {
  const contexto = useContext(ContextoDesejos);
  if (contexto === undefined) {
    throw new Error('useDesejos deve ser usado dentro de um FornecedorDesejos');
  }
  return contexto;
}
