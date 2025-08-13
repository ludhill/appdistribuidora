import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { PilhaPedidosParamList } from '../../tipos';
import CabecalhoInterno from '../../componentes/CabecalhoInterno';
import { usePedidos } from '../../contextos/ContextoPedidos';

type Props = NativeStackScreenProps<PilhaPedidosParamList, 'DetalhesPedido'>;

export default function TelaDetalhesPedido({ route, navigation }: Props) {
  const { pedido } = route.params;
  const { excluirPedido } = usePedidos();

  const podeModificar = pedido.status === 'Aguardando Pagamento' || pedido.status === 'Processando';
  const podeRastrear = pedido.status === 'Enviado' || pedido.status === 'Entregue';

  const handleCancelarPedido = () => {
    Alert.alert(
      "Cancelar Pedido",
      "Tem a certeza de que deseja cancelar este pedido? Esta ação não pode ser desfeita.",
      [
        { text: "Não", style: "cancel" },
        { 
          text: "Sim, cancelar", 
          onPress: () => {
            excluirPedido(pedido.id);
            navigation.goBack();
          },
          style: 'destructive' 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CabecalhoInterno titulo={`Pedido #${pedido.id.slice(-5)}`} onVoltar={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={styles.statusValue}>{pedido.status}</Text>
        </View>
        
        {podeRastrear && (
          <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Rastreamento', { pedido })}>
            <Text style={styles.ctaButtonText}>Rastrear Pedido</Text>
          </TouchableOpacity>
        )}

        {podeModificar && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelarPedido}>
            <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo da Compra</Text>
          {pedido.itens.map(item => (
            <View key={item.id} style={styles.item}>
              <Text style={styles.itemText}>{item.quantidade}x {item.nome}</Text>
              <Text style={styles.itemText}>R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.total}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>R$ {pedido.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { padding: 20 },
  statusContainer: { padding: 20, backgroundColor: '#2d343e', borderRadius: 8, marginBottom: 20, alignItems: 'center' },
  statusLabel: { color: cores.cinzaMetalico, fontSize: 16 },
  statusValue: { color: cores.brancoPuro, fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  ctaButton: { backgroundColor: cores.vermelhoRacing, padding: 16, borderRadius: 8, marginBottom: 20 },
  ctaButtonText: { color: cores.brancoPuro, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: cores.vermelhoRacing,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  cancelButtonText: {
    color: cores.vermelhoRacing,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: { marginTop: 10 },
  sectionTitle: { color: cores.brancoPuro, fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  itemText: { color: cores.cinzaMetalico, fontSize: 16 },
  total: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: cores.cinzaMetalico },
  totalText: { color: cores.brancoPuro, fontSize: 18, fontWeight: 'bold' },
});
