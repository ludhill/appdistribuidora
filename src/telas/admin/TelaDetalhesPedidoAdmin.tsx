import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { usePedidos } from '../../contextos/ContextoPedidos';
import { PilhaAdminParamList, Pedido } from '../../tipos';
import CabecalhoInterno from '../../componentes/CabecalhoInterno';
import SeletorStatus from '../../componentes/SeletorStatus';

type Props = NativeStackScreenProps<PilhaAdminParamList, 'DetalhesPedidoAdmin'>;

export default function TelaDetalhesPedidoAdmin({ route, navigation }: Props) {
  const { idPedido } = route.params;
  const { pedidos, atualizarStatusPedido } = usePedidos();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [codigoRastreio, setCodigoRastreio] = useState('');

  useEffect(() => {
    const pedidoEncontrado = pedidos.find(p => p.id === idPedido);
    if (pedidoEncontrado) {
      setPedido(pedidoEncontrado);
      setCodigoRastreio(pedidoEncontrado.codigoRastreio);
    }
  }, [idPedido, pedidos]);

  if (!pedido) {
    return <SafeAreaView style={styles.safeArea}><Text style={styles.emptyText}>Pedido não encontrado.</Text></SafeAreaView>;
  }

  const handleStatusChange = (novoStatus: Pedido['status']) => {
    setPedido(p => p ? { ...p, status: novoStatus } : null);
    atualizarStatusPedido(pedido.id, novoStatus);
    Alert.alert("Sucesso", "Status do pedido atualizado.");
  };
  
  const handleSalvarRastreio = () => {
    atualizarStatusPedido(pedido.id, pedido.status, codigoRastreio);
    Alert.alert("Sucesso", "Código de rastreio salvo.");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <CabecalhoInterno titulo={`Pedido #${pedido.id.slice(-5)}`} onVoltar={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alterar Status</Text>
          <SeletorStatus statusAtual={pedido.status} onStatusChange={handleStatusChange} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Código de Rastreio</Text>
          <TextInput 
            style={styles.input}
            value={codigoRastreio}
            onChangeText={setCodigoRastreio}
            placeholder="Insira o código de rastreio"
            placeholderTextColor={cores.cinzaMetalico}
          />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados do Cliente</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Nome: {pedido.clienteDados.nome}</Text>
            <Text style={styles.infoText}>Email: {pedido.clienteDados.email}</Text>
            <Text style={styles.infoText}>Telefone: {pedido.clienteDados.telefone || 'Não informado'}</Text>
          </View>
        </View>

          <TouchableOpacity style={styles.ctaButton} onPress={handleSalvarRastreio}>
            <Text style={styles.ctaButtonText}>Salvar Código</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { padding: 20 },
  emptyText: { color: cores.brancoPuro, textAlign: 'center', marginTop: 50 },
  section: { marginBottom: 24 },
  sectionTitle: { color: cores.brancoPuro, fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#2d343e', color: cores.brancoPuro, padding: 16, borderRadius: 8, fontSize: 16 },
  ctaButton: { backgroundColor: cores.cinzaMetalico, padding: 16, borderRadius: 8, marginTop: 12 },
  ctaButtonText: { color: cores.textoNoCard, textAlign: 'center', fontSize: 16, fontWeight: 'bold' }, 
  infoBox: {backgroundColor: '#2d343e', padding: 16, borderRadius: 8,}, 
  infoText: {color: cores.brancoPuro, fontSize: 16, marginBottom: 8,},
});
