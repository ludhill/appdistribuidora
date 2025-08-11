import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../constantes/cores';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { PilhaAutenticacaoParamList } from '../tipos';  
import CabecalhoInterno from '../componentes/CabecalhoInterno';

type Props = NativeStackScreenProps<PilhaAutenticacaoParamList, 'Cadastro'>;

export default function TelaCadastro({ navigation }: Props) {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', senha: '' });
  const { cadastrar } = useAutenticacao();

  const handleCadastro = async () => {
    if (!form.nome || !form.email || !form.senha) {
      Alert.alert("Erro", "Preencha nome, email e senha.");
      return;
    }
    const { sucesso, mensagem } = await cadastrar({
        email: form.email,
        senha: form.senha,
        dados: { nome: form.nome, email: form.email, telefone: form.telefone }
    });

    Alert.alert(sucesso ? "Sucesso" : "Erro", mensagem);
    if (sucesso) {
        navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CabecalhoInterno titulo="Criar Conta" onVoltar={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput style={styles.input} placeholder="Nome Completo" onChangeText={(t) => setForm({...form, nome: t})} />
        <TextInput style={styles.input} placeholder="E-mail" onChangeText={(t) => setForm({...form, email: t})} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Telefone (Opcional)" onChangeText={(t) => setForm({...form, telefone: t})} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Senha" onChangeText={(t) => setForm({...form, senha: t})} secureTextEntry />
        <TouchableOpacity style={styles.ctaButton} onPress={handleCadastro}>
          <Text style={styles.ctaButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
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
