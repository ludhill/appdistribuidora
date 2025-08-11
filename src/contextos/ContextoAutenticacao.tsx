import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../tipos';

type PerfilUsuario = 'cliente' | 'admin';

// Adicionamos a senha ao tipo de utilizador para a lista de cadastro
interface UtilizadorRegistado {
  email: string;
  senha: string;
  perfil: PerfilUsuario;
  dados: Usuario;
}

interface EstadoAutenticacao {
  usuario: Usuario | null;
  perfil: PerfilUsuario | null;
  estaCarregando: boolean;
}

interface ContextoAutenticacaoType {
  estado: EstadoAutenticacao;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  // NOVA FUNÇÃO: Cadastro
  cadastrar: (dados: Omit<UtilizadorRegistado, 'perfil'>) => Promise<{ sucesso: boolean; mensagem: string }>;
}

const ContextoAutenticacao = createContext<ContextoAutenticacaoType | undefined>(undefined);

export function FornecedorAutenticacao({ children }: PropsWithChildren<{}>) {
  const [estado, setEstado] = useState<EstadoAutenticacao>({ usuario: null, perfil: null, estaCarregando: true });
  // NOVO: A lista de utilizadores agora é um estado
  const [utilizadores, setUtilizadores] = useState<UtilizadorRegistado[]>([]);

  // Efeito para carregar tanto a sessão como a lista de utilizadores
  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        // Carregar lista de utilizadores
        const utilizadoresSalvos = await AsyncStorage.getItem('@WRDistribuidora:utilizadores');
        if (utilizadoresSalvos) {
          setUtilizadores(JSON.parse(utilizadoresSalvos));
        } else {
          // Se não houver lista salva, cria a inicial com o admin
          const listaInicial = [
            { email: 'admin@email.com', senha: 'admin', perfil: 'admin' as PerfilUsuario, dados: { nome: 'Admin WR', email: 'admin@email.com', telefone: '11 12345-6789' } }
          ];
          setUtilizadores(listaInicial);
        }

        // Carregar sessão do utilizador logado
        const sessaoSalva = await AsyncStorage.getItem('@WRDistribuidora:sessao');
        if (sessaoSalva) {
          const { usuario, perfil } = JSON.parse(sessaoSalva);
          setEstado({ usuario, perfil, estaCarregando: false });
        }
      } catch (e) {
        console.error("Falha ao carregar dados de autenticação.", e);
      } finally {
        setEstado(e => ({ ...e, estaCarregando: false }));
      }
    }
    carregarDadosIniciais();
  }, []);

  // Efeito para salvar a lista de utilizadores sempre que ela mudar
  useEffect(() => {
    if (!estado.estaCarregando) {
        AsyncStorage.setItem('@WRDistribuidora:utilizadores', JSON.stringify(utilizadores));
    }
  }, [utilizadores, estado.estaCarregando]);

  const login = async (email: string, senha: string): Promise<boolean> => {
    const utilizadorEncontrado = utilizadores.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha);
    if (utilizadorEncontrado) {
      const sessao = { usuario: utilizadorEncontrado.dados, perfil: utilizadorEncontrado.perfil };
      await AsyncStorage.setItem('@WRDistribuidora:sessao', JSON.stringify(sessao));
      setEstado({ ...sessao, estaCarregando: false });
      return true;
    }
    return false;
  };

  const cadastrar = async (dados: Omit<UtilizadorRegistado, 'perfil'>): Promise<{ sucesso: boolean; mensagem: string }> => {
    const emailJaExiste = utilizadores.some(u => u.email.toLowerCase() === dados.email.toLowerCase());
    if (emailJaExiste) {
      return { sucesso: false, mensagem: "Este e-mail já está em uso." };
    }

    const novoUtilizador: UtilizadorRegistado = {
        ...dados,
        perfil: 'cliente', // Novos cadastros são sempre clientes
    };
    setUtilizadores(estadoAtual => [...estadoAtual, novoUtilizador]);
    return { sucesso: true, mensagem: "Cadastro realizado com sucesso!" };
  };

  const logout = async () => { /* ... */ };

  const valor = { estado, login, logout, cadastrar };

  return <ContextoAutenticacao.Provider value={valor}>{children}</ContextoAutenticacao.Provider>;
}
export function useAutenticacao() {
  const contexto = useContext(ContextoAutenticacao);
  if (contexto === undefined) {
    throw new Error('useAutenticacao deve ser usado dentro de um FornecedorAutenticacao');
  }
  return contexto;
}