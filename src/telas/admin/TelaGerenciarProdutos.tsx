import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../../constantes/cores';
import { useProdutos } from '../../contextos/ContextoProdutos';
import { PilhaAdminParamList } from '../../tipos';
import CabecalhoInterno from '../../componentes/CabecalhoInterno';

type Props = NativeStackScreenProps<PilhaAdminParamList, 'GerenciarProdutos'>;

export default function TelaGerenciarProdutos({ navigation }: Props) {
  const { produtos, excluirProduto, estaCarregando } = useProdutos();

  const handleExcluir = (id: string, nome: string) => {
    Alert.alert(
      "Excluir Produto",
      `Tem a certeza de que deseja excluir o produto "${nome}"?`,
      [
        { text: "Não", style: "cancel" },
        { text: "Sim, excluir", onPress: () => excluirProduto(id), style: 'destructive' }
      ]
    );
  };

  if (estaCarregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CabecalhoInterno titulo="Gerenciar Produtos" onVoltar={() => navigation.goBack()} />
        <ActivityIndicator size="large" color={cores.brancoPuro} style={{ flex: 1 }}/>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <CabecalhoInterno titulo="Gerenciar Produtos" onVoltar={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        {produtos.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum produto cadastrado. Clique no botão abaixo para adicionar o primeiro!</Text>
        ) : (
          produtos.map(produto => (
            <View key={produto.id} style={styles.produtoCard}>
              <View style={styles.produtoInfo}>
                <Text style={styles.produtoNome}>{produto.nome || "Produto sem nome"}</Text>
                <Text style={styles.produtoSub}>
                  Preço: R$ {typeof produto.preco === 'number' ? produto.preco.toFixed(2) : 'N/A'} | Estoque: {produto.estoque ?? 'N/A'}
                </Text>
              </View>
              <View style={styles.botoesContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('EditarProduto', { idProduto: produto.id })}>
                  <Ionicons name="pencil-outline" size={24} color={cores.cinzaMetalico} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleExcluir(produto.id, produto.nome)}>
                  <Ionicons name="trash-outline" size={24} color={cores.vermelhoRacing} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('EditarProduto', {})}>
        <Text style={styles.ctaButtonText}>Adicionar Novo Produto</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { 
    padding: 20, 
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 18,
    color: cores.cinzaMetalico,
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  produtoCard: { flexDirection: 'row', backgroundColor: '#2d343e', padding: 16, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  produtoInfo: { flex: 1 },
  produtoNome: { color: cores.brancoPuro, fontSize: 18, fontWeight: 'bold' },
  produtoSub: { color: cores.cinzaMetalico, fontSize: 14, marginTop: 4 },
  botoesContainer: { flexDirection: 'row', gap: 20 },
  ctaButton: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: cores.vermelhoRacing, padding: 16, borderRadius: 8 },
  ctaButtonText: { color: cores.brancoPuro, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
});