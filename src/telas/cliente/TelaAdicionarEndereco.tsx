import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { useUsuario } from '../../contextos/ContextoUsuario';
import { PilhaPerfilParamList } from '../../tipos';
import CabecalhoInterno from '../../componentes/CabecalhoInterno';

type Props = NativeStackScreenProps<PilhaPerfilParamList, 'AdicionarEndereco'>;

export default function TelaAdicionarEndereco({ navigation }: Props) {
  const { adicionarEndereco } = useUsuario();
  const [form, setForm] = useState({ rua: '', numero: '', cidade: '', cep: '', bairro: '' });
  const [carregandoCep, setCarregandoCep] = useState(false);

  const handleInputChange = (campo: keyof typeof form, valor: string) => {
    setForm(prevState => ({ ...prevState, [campo]: valor }));
  };
  
  const buscarCep = async (cep: string) => {
    if (cep.length !== 8) return;  
    setCarregandoCep(true);
    try {
      const response = await fetch(`https://opencep.com/v1/${cep}`);
      const data = await response.json();
      if (data.error) {
        Alert.alert("Erro", "CEP não encontrado.");
      } else {
        setForm(prevState => ({
          ...prevState,
          rua: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
        }));
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar o CEP. Verifique a sua conexão.");
    } finally {
      setCarregandoCep(false);
    }
  };

  const handleSalvar = () => {
    if (!form.rua || !form.cidade || !form.numero) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    adicionarEndereco({ ...form, id: Date.now().toString() });
    Alert.alert("Sucesso", "Novo endereço salvo!");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CabecalhoInterno titulo="Novo Endereço" onVoltar={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="CEP (apenas números)" 
            value={form.cep}
            onChangeText={(text) => {
              handleInputChange('cep', text.replace(/[^0-9]/g, '')); 
              if (text.length === 8) {
                buscarCep(text);
              }
            }} 
            keyboardType="number-pad"
            maxLength={8}
          />
          {carregandoCep && <ActivityIndicator style={styles.loader} color={cores.cinzaMetalico} />}
        </View>

        <TextInput style={styles.input} placeholder="Rua / Avenida" value={form.rua} onChangeText={(t) => handleInputChange('rua', t)} />
        <TextInput style={styles.input} placeholder="Número" value={form.numero} onChangeText={(t) => handleInputChange('numero', t)} keyboardType="number-pad" />
        <TextInput style={styles.input} placeholder="Bairro" value={form.bairro} onChangeText={(t) => handleInputChange('bairro', t)} />
        <TextInput style={styles.input} placeholder="Cidade" value={form.cidade} onChangeText={(t) => handleInputChange('cidade', t)} />
        
        <TouchableOpacity style={styles.ctaButton} onPress={handleSalvar}>
          <Text style={styles.ctaButtonText}>Salvar Endereço</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { padding: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d343e',
    borderRadius: 8,
    marginBottom: 16,
  },
  input: { 
    backgroundColor: '#2d343e', 
    color: cores.brancoPuro, 
    padding: 16, 
    borderRadius: 8, 
    marginBottom: 16, 
    fontSize: 16,
    flex: 1,
  },
  loader: {
    marginRight: 16,
  },
  ctaButton: { backgroundColor: cores.vermelhoRacing, padding: 16, borderRadius: 8, marginTop: 16 },
  ctaButtonText: { color: cores.brancoPuro, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
});
