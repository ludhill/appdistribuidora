import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { PilhaPedidosParamList } from '../../tipos';
import CabecalhoInterno from '../../componentes/CabecalhoInterno';

type Props = NativeStackScreenProps<PilhaPedidosParamList, 'Rastreamento'>;

export default function TelaRastreamento({ route, navigation }: Props) {
  const { pedido } = route.params;
  const statusSteps = ['Processando', 'Enviado', 'Entregue'];
  
  const currentStepIndex = pedido.status === 'Aguardando Pagamento' ? -1 : statusSteps.indexOf(pedido.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CabecalhoInterno titulo="Rastreamento" onVoltar={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Pedido #{pedido.id.slice(-5)}</Text>
        <Text style={styles.trackingCode}>Código: {pedido.codigoRastreio}</Text>

        <View style={styles.timeline}>
          {statusSteps.map((step, index) => (
            <View key={step} style={styles.stepContainer}>
              <View style={styles.dotContainer}>
                <View style={[styles.dot, index <= currentStepIndex && styles.dotActive]} />
                {index < statusSteps.length - 1 && <View style={[styles.line, index < currentStepIndex && styles.lineActive]} />}
              </View>
              <Text style={[styles.stepText, index <= currentStepIndex && styles.stepTextActive]}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: cores.brancoPuro, marginBottom: 8, textAlign: 'center' },
  trackingCode: { fontSize: 16, color: cores.cinzaMetalico, marginBottom: 40, textAlign: 'center' },
  timeline: { paddingLeft: 10 },
  stepContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  dotContainer: { alignItems: 'center' },
  dot: { width: 20, height: 20, borderRadius: 10, backgroundColor: cores.cinzaMetalico },
  dotActive: { backgroundColor: cores.vermelhoRacing },
  line: { width: 4, height: 60, backgroundColor: cores.cinzaMetalico },
  lineActive: { backgroundColor: cores.vermelhoRacing },
  stepText: { color: cores.cinzaMetalico, fontSize: 18, marginLeft: 20, paddingTop: 0 },
  stepTextActive: { color: cores.brancoPuro, fontWeight: 'bold' },
});