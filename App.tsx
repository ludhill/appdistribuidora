import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Importações de Contextos e Telas
import { FornecedorAutenticacao, useAutenticacao } from './src/contextos/ContextoAutenticacao';
import { FornecedorCarrinho } from './src/contextos/ContextoCarrinho';
// ... (importações de todos os outros fornecedores)
import NavegadorApp from './src/navegacao/NavegadorApp';
import TelaLogin from './src/telas/TelaLogin';
import TelaCadastro from './src/telas/TelaCadastro';
import TelaCarregando from './src/telas/TelaCarregando';
import { PilhaAutenticacaoParamList } from './src/tipos';
import { FornecedorProdutos } from './src/contextos/ContextoProdutos';
import { FornecedorPedidos } from './src/contextos/ContextoPedidos';
import { FornecedorDesejos } from './src/contextos/ContextoDesejos';
import { FornecedorUsuario } from './src/contextos/ContextoUsuario';

// Pilha de Navegação para Autenticação
const AuthStack = createNativeStackNavigator<PilhaAutenticacaoParamList>();
function PilhaNavegacaoAutenticacao() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={TelaLogin} />
      <AuthStack.Screen name="Cadastro" component={TelaCadastro} />
    </AuthStack.Navigator>
  );
}

// Componente que decide qual navegador renderizar
function RaizNavegacao() {
  const { estado } = useAutenticacao();

  if (estado.estaCarregando) {
    return <TelaCarregando />;
  }

  return (
    <NavigationContainer>
      {!estado.usuario ? (
        // Se NÃO houver utilizador, mostra a pilha de Login/Cadastro
        <PilhaNavegacaoAutenticacao />
      ) : (
        // Se HOUVER utilizador, mostra o navegador principal
        <NavegadorApp />
      )}
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

// Componente principal da aplicação
export default function App() {
  return (
    <FornecedorAutenticacao>
      <FornecedorProdutos>
        <FornecedorCarrinho>
          <FornecedorPedidos>
            <FornecedorUsuario>
              <FornecedorDesejos>
                <RaizNavegacao />
              </FornecedorDesejos>
            </FornecedorUsuario>
          </FornecedorPedidos>
        </FornecedorCarrinho>
      </FornecedorProdutos>
    </FornecedorAutenticacao>
  );
}