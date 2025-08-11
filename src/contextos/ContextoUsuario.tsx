import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario, Endereco, Cartao, ConfiguracoesNotificacao } from '../tipos';

interface EstadoUsuario {
  perfil: Usuario;
  enderecos: Endereco[];
  cartoes: Cartao[];
  configuracoes: ConfiguracoesNotificacao;  
}

interface ContextoUsuarioType {
  estado: EstadoUsuario;
  atualizarPerfil: (novosDados: Usuario) => void;
  adicionarEndereco: (novoEndereco: Endereco) => void;
  adicionarCartao: (novoCartao: Cartao) => void;  
  atualizarConfiguracoes: (novasConfigs: ConfiguracoesNotificacao) => void;  
  estaCarregando: boolean;
}
const ContextoUsuario = createContext<ContextoUsuarioType | undefined>(undefined);

export function FornecedorUsuario({ children }: PropsWithChildren<{}>) {
  const [estado, setEstado] = useState<EstadoUsuario>({
    perfil: { nome: 'Lucas', email: 'lucas@email.com', telefone: '99 99999-9999' },
    enderecos: [],
    cartoes: [],
    configuracoes: { email: true, whatsapp: false }, // Estado inicial
  });
  const [estaCarregando, setEstaCarregando] = useState(true);
 
  useEffect(() => {
    async function carregarDados() {
      try {
        const dadosSalvos = await AsyncStorage.getItem('@WRDistribuidora:usuario');
        if (dadosSalvos) {
          setEstado(JSON.parse(dadosSalvos));
        }
      } catch (e) {
        console.error("Falha ao carregar dados do utilizador.", e);
      } finally {
        setEstaCarregando(false);
      }
    }
    carregarDados();
  }, []);

  
  useEffect(() => {
    async function salvarDados() {
      if (!estaCarregando) {
        try {
          await AsyncStorage.setItem('@WRDistribuidora:usuario', JSON.stringify(estado));
        } catch (e) {
          console.error("Falha ao salvar dados do utilizador.", e);
        }
      }
    }
    salvarDados();
  }, [estado, estaCarregando]);

  const atualizarPerfil = (novosDados: Usuario) => {
    setEstado(estadoAtual => ({ ...estadoAtual, perfil: novosDados }));
  };

  const adicionarEndereco = (novoEndereco: Endereco) => {
    setEstado(estadoAtual => ({
      ...estadoAtual,
      enderecos: [...estadoAtual.enderecos, novoEndereco],
    }));
  };

  const adicionarCartao = (novoCartao: Cartao) => {
    setEstado(estadoAtual => ({
      ...estadoAtual,
      cartoes: [...estadoAtual.cartoes, novoCartao],
    }));
  };

  const atualizarConfiguracoes = (novasConfigs: ConfiguracoesNotificacao) => {
    setEstado(estadoAtual => ({ ...estadoAtual, configuracoes: novasConfigs }));
  };


  const valor = { estado, atualizarPerfil, adicionarEndereco, adicionarCartao, atualizarConfiguracoes, estaCarregando };
  return <ContextoUsuario.Provider value={valor}>{children}</ContextoUsuario.Provider>;
}

export function useUsuario() {
  const contexto = useContext(ContextoUsuario);
  if (contexto === undefined) {
    throw new Error('useUsuario deve ser usado dentro de um FornecedorUsuario');
  }
  return contexto;
}
