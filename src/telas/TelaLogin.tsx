import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../constantes/cores';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { PilhaAutenticacaoParamList } from '../tipos';

// A tela agora recebe as props de navegação da Pilha de Autenticação
type Props = NativeStackScreenProps<PilhaAutenticacaoParamList, 'Login'>;

export default function TelaLogin({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [estaCarregando, setEstaCarregando] = useState(false);
  const { login } = useAutenticacao();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha o email e a senha.");
      return;
    }
    setEstaCarregando(true);
    const sucesso = await login(email, senha);
    if (!sucesso) {
      Alert.alert("Falha no Login", "Email ou senha incorretos.");
    }
    setEstaCarregando(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>WR Distribuidora</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={cores.cinzaMetalico}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={cores.cinzaMetalico}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <TouchableOpacity style={styles.ctaButton} onPress={handleLogin} disabled={estaCarregando}>
          {estaCarregando ? <ActivityIndicator color={cores.brancoPuro} /> : <Text style={styles.ctaButtonText}>Entrar</Text>}
        </TouchableOpacity>

        {/* BOTÃO DE CADASTRO ADICIONADO AQUI */}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.secondaryButtonText}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: cores.brancoPuro, textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#2d343e', color: cores.brancoPuro, padding: 16, borderRadius: 8, marginBottom: 16, fontSize: 16 },
  ctaButton: { backgroundColor: cores.vermelhoRacing, padding: 16, borderRadius: 8, marginTop: 16 },
  ctaButtonText: { color: cores.brancoPuro, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { 
    marginTop: 24,
    padding: 10,
  },
  secondaryButtonText: { 
    color: cores.cinzaMetalico, 
    textAlign: 'center', 
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});