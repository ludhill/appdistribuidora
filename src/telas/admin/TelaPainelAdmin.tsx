import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { PilhaAdminParamList } from '../../tipos';
import OpcaoMenu from '../../componentes/OpcaoMenu';

type Props = NativeStackScreenProps<PilhaAdminParamList, 'PainelPrincipal'>;

export default function TelaPainelAdmin({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Painel Administrativo</Text>
        <View style={styles.menuContainer}>
          <OpcaoMenu icone="cube-outline" texto="Gerenciar Produtos" onPress={() => navigation.navigate('GerenciarProdutos')} />
          <OpcaoMenu icone="receipt-outline" texto="Gerenciar Pedidos" onPress={() => navigation.navigate('GerenciarPedidos')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: cores.brancoPuro, marginBottom: 32, textAlign: 'center' },
  menuContainer: { backgroundColor: '#2d343e', borderRadius: 8 },
});