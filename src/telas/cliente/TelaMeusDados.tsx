import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';  
import { cores } from '../../constantes/cores';
import { useUsuario } from '../../contextos/ContextoUsuario';
import { PilhaPerfilParamList } from '../../tipos';
import CabecalhoInterno from '../../componentes/CabecalhoInterno';  


type Props = NativeStackScreenProps<PilhaPerfilParamList, 'MeusDados'>;

export default function TelaMeusDados({ navigation }: Props) {
  const { estado, atualizarPerfil } = useUsuario();
  const [form, setForm] = useState(estado.perfil);

  const handleSalvar = () => {
    atualizarPerfil(form);
    Alert.alert("Sucesso", "Os seus dados foram atualizados.");
    navigation.goBack();  
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <CabecalhoInterno titulo="Meus Dados" onVoltar={() => navigation.goBack()} />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={form.nome}
          onChangeText={(text) => setForm({ ...form, nome: text })}
          placeholder="Nome Completo"
          placeholderTextColor={cores.cinzaMetalico}
        />
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          placeholder="E-mail"
          placeholderTextColor={cores.cinzaMetalico}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={form.telefone}
          onChangeText={(text) => setForm({ ...form, telefone: text })}
          placeholder="Telefone"
          placeholderTextColor={cores.cinzaMetalico}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.ctaButton} onPress={handleSalvar}>
          <Text style={styles.ctaButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { padding: 20 },
  
  input: { backgroundColor: '#2d343e', color: cores.brancoPuro, padding: 16, borderRadius: 8, marginBottom: 16, fontSize: 16 },
  ctaButton: { backgroundColor: cores.vermelhoRacing, padding: 16, borderRadius: 8, marginTop: 16 },
  ctaButtonText: { color: cores.brancoPuro, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
});