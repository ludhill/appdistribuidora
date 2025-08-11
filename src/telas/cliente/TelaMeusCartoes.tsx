import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../../constantes/cores';
import { useUsuario } from '../../contextos/ContextoUsuario';
import { PilhaPerfilParamList } from '../../tipos';
import CabecalhoInterno from '../../componentes/CabecalhoInterno';

type Props = NativeStackScreenProps<PilhaPerfilParamList, 'MeusCartoes'>;

export default function TelaMeusCartoes({ navigation }: Props) {
  const { estado } = useUsuario();

  return (
    <SafeAreaView style={styles.safeArea}>
      <CabecalhoInterno titulo="Meus Cartões" onVoltar={() => navigation.goBack()} />
      <FlatList
        data={estado.cartoes}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.title}>Meus Cartões</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum cartão cadastrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons name="card" size={32} color={cores.cinzaMetalico} />
            <View style={styles.cardDetails}>
              <Text style={styles.cardText}>**** **** **** {item.ultimosDigitos}</Text>
              <Text style={styles.cardSubText}>{item.nomeTitular}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.container}
      />
      <TouchableOpacity style={styles.ctaButton} onPress={() => alert('Tela de adicionar cartão a ser implementada.')}>
        <Text style={styles.ctaButtonText}>Adicionar Novo Cartão</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: cores.brancoPuro, marginBottom: 24, textAlign: 'center' },
  emptyText: { fontSize: 16, color: cores.cinzaMetalico, textAlign: 'center', marginTop: 40 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2d343e', padding: 20, borderRadius: 8, marginBottom: 12 },
  cardDetails: { marginLeft: 16 },
  cardText: { color: cores.brancoPuro, fontSize: 18, fontWeight: 'bold' },
  cardSubText: { color: cores.cinzaMetalico, fontSize: 14 },
  ctaButton: { backgroundColor: cores.vermelhoRacing, padding: 16, margin: 20, borderRadius: 8 },
  ctaButtonText: { color: cores.brancoPuro, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
});
