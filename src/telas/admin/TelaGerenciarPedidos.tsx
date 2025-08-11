import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { usePedidos } from '../../contextos/ContextoPedidos';
import { PilhaAdminParamList } from '../../tipos';
import CabecalhoInterno from '../../componentes/CabecalhoInterno';

type Props = NativeStackScreenProps<PilhaAdminParamList, 'GerenciarPedidos'>;

export default function TelaGerenciarPedidos({ navigation }: Props) {
  const { pedidos, estaCarregando } = usePedidos();

  if (estaCarregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CabecalhoInterno titulo="Gerenciar Pedidos" onVoltar={() => navigation.goBack()} />
        <ActivityIndicator size="large" color={cores.brancoPuro} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <CabecalhoInterno titulo="Gerenciar Pedidos" onVoltar={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        {pedidos.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum pedido encontrado.</Text>
        ) : (
          pedidos.map(pedido => (
            <TouchableOpacity key={pedido.id} style={styles.pedidoCard} onPress={() => navigation.navigate('DetalhesPedidoAdmin', { idPedido: pedido.id })}>
              <Text style={styles.pedidoHeader}>Pedido #{pedido.id.slice(-5)}</Text>
              <Text style={styles.pedidoTotal}>Total: R$ {pedido.total.toFixed(2)}</Text>
              <Text style={styles.pedidoStatus}>Status: {pedido.status}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { padding: 20 },
  emptyText: { fontSize: 18, color: cores.cinzaMetalico, textAlign: 'center', marginTop: 50 },
  pedidoCard: { backgroundColor: '#2d343e', padding: 16, borderRadius: 8, marginBottom: 16 },
  pedidoHeader: { fontSize: 18, fontWeight: 'bold', color: cores.brancoPuro },
  pedidoTotal: { fontSize: 16, color: cores.brancoPuro, marginTop: 8 },
  pedidoStatus: { fontSize: 14, color: cores.cinzaMetalico, marginTop: 4, fontStyle: 'italic' },
});