import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { Usuario, Endereco, Cartao, ConfiguracoesNotificacao } from '../tipos';

type PerfilUsuario = 'cliente' | 'admin';

interface DadosCompletosUsuario {
  perfil: PerfilUsuario;
  dados: Usuario;
  enderecos: Endereco[];
  cartoes: Cartao[];
  configuracoes: ConfiguracoesNotificacao;
}

interface EstadoAutenticacao {
  usuario: User | null;
  dadosCompletos: DadosCompletosUsuario | null;
  estaCarregando: boolean;
}

interface ContextoAutenticacaoType {
  estado: EstadoAutenticacao;
  login: (email: string, senha: string) => Promise<{ sucesso: boolean; mensagem?: string }>;
  logout: () => Promise<void>;
  cadastrar: (dados: any) => Promise<{ sucesso: boolean; mensagem: string }>;
  atualizarPerfil: (novosDados: Usuario) => Promise<void>;
  adicionarEndereco: (novoEndereco: Endereco) => Promise<void>;
}

const ContextoAutenticacao = createContext<ContextoAutenticacaoType | undefined>(undefined);

export function FornecedorAutenticacao({ children }: PropsWithChildren<{}>) {
  const [estado, setEstado] = useState<EstadoAutenticacao>({
    usuario: null,
    dadosCompletos: null,
    estaCarregando: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (utilizadorFirebase) => {
      if (utilizadorFirebase) {
        const docRef = doc(db, "usuarios", utilizadorFirebase.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEstado({
            usuario: utilizadorFirebase,
            dadosCompletos: docSnap.data() as DadosCompletosUsuario,
            estaCarregando: false,
          });
        }
      } else {
        setEstado({ usuario: null, dadosCompletos: null, estaCarregando: false });
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      return { sucesso: true };
    } catch (error: any) {
      return { sucesso: false, mensagem: "Email ou senha incorretos." };
    }
  };

  const cadastrar = async (dados: any) => {
    try {
      const credenciais = await createUserWithEmailAndPassword(auth, dados.email, dados.senha);
      const dadosParaSalvar: DadosCompletosUsuario = {
        perfil: 'cliente',
        dados: { nome: dados.nome, email: dados.email, telefone: dados.telefone },
        enderecos: [],
        cartoes: [],
        configuracoes: { email: true, whatsapp: false },
      };
      await setDoc(doc(db, "usuarios", credenciais.user.uid), dadosParaSalvar);
      return { sucesso: true, mensagem: "Cadastro realizado com sucesso!" };
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        return { sucesso: false, mensagem: "Este e-mail já está em uso." };
      }
      return { sucesso: false, mensagem: "Falha ao cadastrar." };
    }
  };
  
  const atualizarPerfil = async (novosDados: Usuario) => {
    if (!estado.usuario) return;
    const docRef = doc(db, "usuarios", estado.usuario.uid);
    await updateDoc(docRef, { dados: novosDados });
    setEstado(e => e.dadosCompletos ? ({ ...e, dadosCompletos: { ...e.dadosCompletos, dados: novosDados }}) : e);
  };

  const adicionarEndereco = async (novoEndereco: Endereco) => {
    if (!estado.usuario || !estado.dadosCompletos) return;
    const novosEnderecos = [...estado.dadosCompletos.enderecos, novoEndereco];
    const docRef = doc(db, "usuarios", estado.usuario.uid);
    await updateDoc(docRef, { enderecos: novosEnderecos });
    setEstado(e => e.dadosCompletos ? ({ ...e, dadosCompletos: { ...e.dadosCompletos, enderecos: novosEnderecos }}) : e);
  };

  const logout = async () => { await signOut(auth); };

  const valor = { estado, login, logout, cadastrar, atualizarPerfil, adicionarEndereco };
  return <ContextoAutenticacao.Provider value={valor}>{children}</ContextoAutenticacao.Provider>;
}

export function useAutenticacao() {
  const contexto = useContext(ContextoAutenticacao);
  if (contexto === undefined) {
    throw new Error('useAutenticacao deve ser usado dentro de um FornecedorAutenticacao');
  }
  return contexto;
}
