import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { PilhaAdminParamList } from '../../tipos';
import OpcaoMenu from '../../componentes/OpcaoMenu';
import { useProdutos } from '../../contextos/ContextoProdutos';
import { PRODUTOS_EXEMPLO } from '../../constantes/dadosExemplo';

type Props = NativeStackScreenProps<PilhaAdminParamList, 'PainelPrincipal'>;

export default function TelaPainelAdmin({ navigation }: Props) {
  const { produtos, adicionarProduto } = useProdutos();

  const handleCarregarDadosIniciais = () => {
    if (produtos.length > 0) {
      Alert.alert("Aviso", "A base de dados de produtos já contém itens.");
      return;
    }

    Alert.alert(
      "Carregar Dados de Exemplo",
      "Deseja carregar a lista de produtos de exemplo para o Firebase? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, carregar", 
          onPress: () => {
            PRODUTOS_EXEMPLO.forEach(produto => {
              const { id, ...dadosProduto } = produto;
              adicionarProduto(dadosProduto);
            });
            Alert.alert("Sucesso", "Produtos de exemplo carregados para o Firebase!");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Painel Administrativo</Text>
        <View style={styles.menuContainer}>
          <OpcaoMenu icone="cube-outline" texto="Gerenciar Produtos" onPress={() => navigation.navigate('GerenciarProdutos')} />
          <OpcaoMenu icone="receipt-outline" texto="Gerenciar Pedidos" onPress={() => navigation.navigate('GerenciarPedidos')} />
        </View>

        {/* <TouchableOpacity style={styles.seedButton} onPress={handleCarregarDadosIniciais}>
          <Text style={styles.seedButtonText}>Carregar Produtos Iniciais (Apenas 1 vez)</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: cores.brancoPuro, marginBottom: 32, textAlign: 'center' },
  menuContainer: { backgroundColor: '#2d343e', borderRadius: 8 },
  seedButton: {
    backgroundColor: cores.cinzaMetalico,
    padding: 12,
    borderRadius: 8,
    marginTop: 40,
  },
  seedButtonText: {
    color: cores.textoNoCard,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});
