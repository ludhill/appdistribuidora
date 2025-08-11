import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { usePedidos } from '../../contextos/ContextoPedidos';
import { PilhaPedidosParamList } from '../../tipos';
import CabecalhoInterno from '../../componentes/CabecalhoInterno';

type Props = NativeStackScreenProps<PilhaPedidosParamList, 'ListaPedidos'>;

export default function TelaMeusPedidos({ navigation }: Props) {
  const { pedidos, estaCarregando } = usePedidos();

  if (estaCarregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CabecalhoInterno titulo="Meus Pedidos" onVoltar={() => navigation.goBack()} />
        <ActivityIndicator size="large" color={cores.brancoPuro} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }
  const listaKey = pedidos.map(p => p.id).join(',');

  return (
    <SafeAreaView style={styles.safeArea}>
      <CabecalhoInterno titulo="Meus Pedidos" onVoltar={() => navigation.goBack()} />
      <ScrollView 
        key={listaKey}
        contentContainerStyle={styles.container}
      >
        {pedidos.length === 0 ? (
          <Text style={styles.emptyText}>Você ainda não fez nenhum pedido.</Text>
        ) : (
          pedidos.map(pedido => (
            <TouchableOpacity key={pedido.id} style={styles.pedidoCard} onPress={() => navigation.navigate('DetalhesPedido', { pedido })}>
              <Text style={styles.pedidoHeader}>Pedido de {pedido.data.toLocaleDateString('pt-BR')}</Text>
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
