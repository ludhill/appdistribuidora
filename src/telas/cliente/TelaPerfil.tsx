import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../../constantes/cores';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PilhaPerfilParamList } from '../../tipos';

const OpcaoMenu = ({ icone, texto, onPress }: { icone: any; texto: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.opcaoContainer} onPress={onPress}>
    <Ionicons name={icone} size={24} color={cores.cinzaMetalico} />
    <Text style={styles.opcaoTexto}>{texto}</Text>
    <Ionicons name="chevron-forward-outline" size={24} color={cores.cinzaMetalico} />
  </TouchableOpacity>
);


type Props = NativeStackScreenProps<PilhaPerfilParamList, 'PerfilPrincipal'>;

export default function TelaPerfil({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Minha Conta</Text>
        <View style={styles.menuContainer}>
          
          <OpcaoMenu icone="person-outline" texto="Meus Dados" onPress={() => navigation.navigate('MeusDados')} />
          <OpcaoMenu icone="receipt-outline" texto="Meus Pedidos" onPress={() => navigation.navigate('Meus Pedidos', { screen: 'ListaPedidos' })} />
          <OpcaoMenu icone="location-outline" texto="Meus Endereços" onPress={() => navigation.navigate('MeusEnderecos')} />
          <OpcaoMenu icone="card-outline" texto="Meus Cartões" onPress={() => navigation.navigate('MeusCartoes')} />
          <OpcaoMenu icone="heart-outline" texto="Lista de Desejos" onPress={() => navigation.navigate('ListaDesejos')} />
          {/* <OpcaoMenu icone="notifications-outline" texto="Notificações" onPress={() => navigation.navigate('Notificacoes')} /> */}
          {/* <OpcaoMenu icone="log-out-outline" texto="Sair (Logout)" onPress={() => {}} /> */}
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
  opcaoContainer: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: cores.grafiteIntenso },
  opcaoTexto: { flex: 1, color: cores.brancoPuro, fontSize: 18, marginLeft: 16 },
});