import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Importações de Tipos (incluindo a nova PilhaAutenticacaoParamList)
import { PilhaClienteParamList, PilhaPedidosParamList, PilhaPerfilParamList, NavegadorDrawerParamList, PilhaAdminParamList, PilhaAutenticacaoParamList } from '../tipos';
type NavegacaoCarrinhoProp = CompositeNavigationProp<
  DrawerNavigationProp<NavegadorDrawerParamList, 'Loja'>,
  NativeStackNavigationProp<PilhaClienteParamList>
>;
// Importações de Contextos e Telas
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { useCarrinho } from '../contextos/ContextoCarrinho';
import TelaLogin from '../telas/TelaLogin';
import TelaCadastro from '../telas/TelaCadastro';
import TelaCarregando from '../telas/TelaCarregando';
import TelaInicial from '../telas/cliente/TelaInicial';
import TelaDetalhesProduto from '../telas/cliente/TelaDetalhesProduto';
import TelaCarrinho from '../telas/cliente/TelaCarrinho';
import TelaCheckout from '../telas/cliente/TelaCheckout';
import TelaPerfil from '../telas/cliente/TelaPerfil';
import TelaMeusDados from '../telas/cliente/TelaMeusDados';
import TelaMeusPedidos from '../telas/cliente/TelaMeusPedidos';
import TelaDetalhesPedido from '../telas/cliente/TelaDetalhesPedido';
import TelaMeusCartoes from '../telas/cliente/TelaMeusCartoes';
import TelaNotificacoes from '../telas/cliente/TelaNotificacoes';
import ConteudoMenuLateral from '../componentes/ConteudoMenuLateral';
import TelaMeusEnderecos from '../telas/cliente/TelaMeusEnderecos';
import TelaAdicionarEndereco from '../telas/cliente/TelaAdicionarEndereco';
import TelaListaDesejos from '../telas/cliente/TelaListaDesejos';
import TelaRastreamento from '../telas/cliente/TelaRastreamento';
import TelaPainelAdmin from '../telas/admin/TelaPainelAdmin';
import TelaGerenciarPedidos from '../telas/admin/TelaGerenciarPedidos';
import TelaGerenciarProdutos from '../telas/admin/TelaGerenciarProdutos';
import TelaEditarProduto from '../telas/admin/TelaEditarProduto';
import TelaDetalhesPedidoAdmin from '../telas/admin/TelaDetalhesPedidoAdmin';
import { cores } from '../constantes/cores';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
 
//  Pilha de Autenticação
const AuthStack = createNativeStackNavigator<PilhaAutenticacaoParamList>();
function PilhaNavegacaoAutenticacao() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={TelaLogin} />
      <AuthStack.Screen name="Cadastro" component={TelaCadastro} />
    </AuthStack.Navigator>
  );
}

// Componente do Ícone do Carrinho
function IconeCarrinhoHeader() {
  // O hook useNavigation com o nosso tipo customizado
  const navigation = useNavigation<NavegacaoCarrinhoProp>();
  const { itens } = useCarrinho();
  const totalItens = itens.reduce((soma, item) => soma + item.quantidade, 0);

  return ( 
    <TouchableOpacity onPress={() => navigation.navigate('Loja', { screen: 'Carrinho' })} style={styles.headerIconContainer}>
      <Ionicons name="cart-outline" size={28} color={cores.brancoPuro} />
      {totalItens > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{totalItens}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// Pilha de Navegação do Cliente
const ClientStack = createNativeStackNavigator<PilhaClienteParamList>();
function PilhaNavegacaoCliente() {
  return (
    <ClientStack.Navigator screenOptions={{ headerShown: false }}>
      <ClientStack.Screen name="Catalogo" component={TelaInicial} />
      <ClientStack.Screen name="DetalhesDoProduto" component={TelaDetalhesProduto} />
      <ClientStack.Screen name="Carrinho" component={TelaCarrinho} />
      <ClientStack.Screen name="Checkout" component={TelaCheckout} />
    </ClientStack.Navigator>
  );
}

// Pilha de Navegação dos Pedidos
const PedidosStack = createNativeStackNavigator<PilhaPedidosParamList>();
function PilhaNavegacaoPedidos() {
  return (
    <PedidosStack.Navigator screenOptions={{ headerShown: false }}>
      <PedidosStack.Screen name="ListaPedidos" component={TelaMeusPedidos} />
      <PedidosStack.Screen name="DetalhesPedido" component={TelaDetalhesPedido} />
      <PedidosStack.Screen name="Rastreamento" component={TelaRastreamento} />
    </PedidosStack.Navigator>
  );
}

// Pilha de Navegação do Perfil
const PerfilStack = createNativeStackNavigator<PilhaPerfilParamList>();
function PilhaNavegacaoPerfil() {
  return (
    <PerfilStack.Navigator screenOptions={{ headerShown: false }}>
      <PerfilStack.Screen name="PerfilPrincipal" component={TelaPerfil} />
      <PerfilStack.Screen name="MeusDados" component={TelaMeusDados} />
      <PerfilStack.Screen name="MeusCartoes" component={TelaMeusCartoes} />
      <PerfilStack.Screen name="Notificacoes" component={TelaNotificacoes} />
      <PerfilStack.Screen name="Meus Pedidos" component={PilhaNavegacaoPedidos} />
      <PerfilStack.Screen name="MeusEnderecos" component={TelaMeusEnderecos} />
      <PerfilStack.Screen name="AdicionarEndereco" component={TelaAdicionarEndereco} />
      <PerfilStack.Screen name="ListaDesejos" component={TelaListaDesejos} />
    </PerfilStack.Navigator>
  );
}

// Pilha de Navegação do Admin
const AdminStack = createNativeStackNavigator<PilhaAdminParamList>();
function PilhaNavegacaoAdmin() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="PainelPrincipal" component={TelaPainelAdmin} />
      <AdminStack.Screen name="GerenciarProdutos" component={TelaGerenciarProdutos} />
      <AdminStack.Screen name="EditarProduto" component={TelaEditarProduto} />
      <AdminStack.Screen name="GerenciarPedidos" component={TelaGerenciarPedidos} />
      <AdminStack.Screen name="DetalhesPedidoAdmin" component={TelaDetalhesPedidoAdmin} />
    </AdminStack.Navigator>
  );
}

// --- NAVEGADOR PRINCIPAL  ---

const Drawer = createDrawerNavigator<NavegadorDrawerParamList>();

export default function NavegadorApp() {
  const { estado } = useAutenticacao();
  const perfil = estado.perfil; // Guardamos o perfil para facilitar a leitura

  if (estado.estaCarregando) {
    return <TelaCarregando />;
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <ConteudoMenuLateral {...props} perfilUsuario={estado.perfil!} />}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: cores.grafiteIntenso },
        headerTintColor: cores.brancoPuro,
        drawerActiveBackgroundColor: cores.vermelhoRacing,
        drawerActiveTintColor: cores.brancoPuro,
        drawerInactiveTintColor: cores.brancoPuro,
        headerTitleAlign: 'center',
        headerTitle: () => (
          <TouchableOpacity 
            onPress={() => {
              if (perfil === 'cliente') {
                navigation.navigate('Loja', { screen: 'Catalogo' });
              } else {
                // Para o admin, o "Home" leva ao painel principal
                navigation.navigate('PainelAdmin', { screen: 'PainelPrincipal' });
              }
            }}
          >
            <Ionicons name="home-outline" size={28} color={cores.brancoPuro} />
          </TouchableOpacity>
        ),

        // CORREÇÃO: O ícone do carrinho só aparece se o utilizador for um cliente
        headerRight: () => {
          if (perfil === 'cliente') {
            return <IconeCarrinhoHeader />;
          }
          return null; // Não mostra nada para o admin
        },
      })}
    >
      {estado.perfil === 'cliente' ? (
        <>
          <Drawer.Screen name="Loja" component={PilhaNavegacaoCliente} />
          <Drawer.Screen name="Perfil" component={PilhaNavegacaoPerfil} />
        </>
      ) : (
        <Drawer.Screen name="PainelAdmin" component={PilhaNavegacaoAdmin} options={{ title: 'Painel' }} />
      )}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerIconContainer: { marginRight: 15, padding: 5 },
  badgeContainer: {
    position: 'absolute', right: -6, top: -3, backgroundColor: cores.vermelhoRacing,
    borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: cores.brancoPuro, fontSize: 12, fontWeight: 'bold' },
});
