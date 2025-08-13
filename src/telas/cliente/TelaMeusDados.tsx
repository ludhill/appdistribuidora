import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { useAutenticacao } from '../../contextos/ContextoAutenticacao'; // 1. Mudar o hook
import { PilhaPerfilParamList } from '../../tipos';
import CabecalhoInterno from '../../componentes/CabecalhoInterno';

type Props = NativeStackScreenProps<PilhaPerfilParamList, 'MeusDados'>;

export default function TelaMeusDados({ navigation }: Props) {
  // 2. Usar o hook de autenticação
  const { estado, atualizarPerfil } = useAutenticacao();
  // 3. Inicializar o formulário com os dados do utilizador logado
  const [form, setForm] = useState(estado.dadosCompletos!.dados);

  // Efeito para atualizar o formulário se os dados no contexto mudarem
  useEffect(() => {
    if (estado.dadosCompletos) {
      setForm(estado.dadosCompletos.dados);
    }
  }, [estado.dadosCompletos]);

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
        />
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          placeholder="E-mail"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={form.telefone}
          onChangeText={(text) => setForm({ ...form, telefone: text })}
          placeholder="Telefone"
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