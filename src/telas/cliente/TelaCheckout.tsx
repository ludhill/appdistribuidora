import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { Endereco, PilhaClienteParamList } from '../../tipos';
import { useCarrinho } from '../../contextos/ContextoCarrinho';
import { usePedidos } from '../../contextos/ContextoPedidos';
import { useUsuario } from '../../contextos/ContextoUsuario'; 
import { Ionicons } from '@expo/vector-icons';


interface EnderecoForm {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
}

type Props = NativeStackScreenProps<PilhaClienteParamList, 'Checkout'>;

export default function TelaCheckout({ navigation }: Props) {
  const [form, setForm] = useState<EnderecoForm>({ rua: '', numero: '', bairro: '', cidade: '', cep: '' });
  const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(false);
  const [carregandoCep, setCarregandoCep] = useState(false);
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const { estado: estadoUsuario } = useUsuario(); 
  const { itens, limparCarrinho } = useCarrinho();
  const { adicionarPedido } = usePedidos();



  const handleInputChange = (campo: keyof EnderecoForm, valor: string) => {
    setForm(prevState => ({ ...prevState, [campo]: valor }));
  };

  const obterLocalizacao = async () => {
    setEstaCarregando(true);
    setErro(null);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não é possível obter a localização sem a sua permissão.');
      setEstaCarregando(false);
      return;
    }

    try {
      let position = await Location.getCurrentPositionAsync({});
      let addresses = await Location.reverseGeocodeAsync(position.coords);

      if (addresses && addresses.length > 0) {
        const endereco = addresses[0];
        setForm({
          rua: endereco.street || '',
          numero: endereco.streetNumber || '',
          bairro: endereco.district || '',
          cidade: endereco.city || '',
          cep: endereco.postalCode || '',
        });
      }
    } catch (error) {
      setErro('Ocorreu um erro ao obter a localização.');
      console.error(error);
    } finally {
      setEstaCarregando(false);
    }
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
          cep: data.cep || prevState.cep,
        }));
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar o CEP.");
    } finally {
      setCarregandoCep(false);
    }
  };

  const handleSelecionarEndereco = (endereco: Endereco) => {
    setForm({
      rua: endereco.rua,
      numero: endereco.numero,
      cidade: endereco.cidade,
      cep: endereco.cep,
      bairro: '', 
    });
  };

  const handleConfirmarPedido = () => {
    if (!form.rua || !form.cidade) {
      Alert.alert("Erro", "Por favor, preencha pelo menos a rua e a cidade.");
      return;
    }

    if (itens.length === 0) {
      Alert.alert("Carrinho Vazio", "Não é possível finalizar um pedido sem itens no carrinho.");
      return;
    }

    const totalPedido = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

    const novoPedido = {
      id: Date.now().toString(),
      data: new Date(),
      itens: itens,
      total: totalPedido,
      enderecoEntrega: form,
    };

    adicionarPedido(novoPedido);
    limparCarrinho();

    Alert.alert("Pedido Confirmado!", "O seu pedido foi registado com sucesso.");
    navigation.navigate('Catalogo');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Endereço de Entrega</Text>

        {estadoUsuario.enderecos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meus Endereços</Text>
            {estadoUsuario.enderecos.map(endereco => (
              <TouchableOpacity key={endereco.id} style={styles.cardEndereco} onPress={() => handleSelecionarEndereco(endereco)}>
                <Ionicons name="location-sharp" size={32} color={cores.cinzaMetalico} />
                <View style={styles.cardDetails}>
                  <Text style={styles.cardText}>{endereco.rua}, {endereco.numero}</Text>
                  <Text style={styles.cardSubText}>{endereco.cidade} - {endereco.cep}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.locationButton} onPress={obterLocalizacao} disabled={carregandoLocalizacao}>
          {carregandoLocalizacao ? <ActivityIndicator color={cores.textoNoCard} /> : <Text style={styles.locationButtonText}>Preencher com minha localização</Text>}
        </TouchableOpacity>

        <Text style={styles.separatorText}>OU PREENCHA MANUALMENTE</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="CEP (apenas números)"
              value={form.cep}
              onChangeText={(text) => {
                const cepLimpo = text.replace(/[^0-9]/g, '');
                handleInputChange('cep', cepLimpo);
                if (cepLimpo.length === 8) {
                  buscarCep(cepLimpo);
                }
              }}
              keyboardType="number-pad"
              maxLength={8}
            />
            {carregandoCep && <ActivityIndicator style={styles.loader} color={cores.cinzaMetalico} />}
          </View>
          <TextInput style={styles.input} placeholder="Rua / Avenida" value={form.rua} onChangeText={(text) => handleInputChange('rua', text)} />
          <TextInput style={styles.input} placeholder="Número" value={form.numero} onChangeText={(text) => handleInputChange('numero', text)} keyboardType="number-pad" />
          <TextInput style={styles.input} placeholder="Bairro" value={form.bairro} onChangeText={(text) => handleInputChange('bairro', text)} />
          <TextInput style={styles.input} placeholder="Cidade" value={form.cidade} onChangeText={(text) => handleInputChange('cidade', text)} />
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={handleConfirmarPedido}>
          <Text style={styles.ctaButtonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: cores.brancoPuro, marginBottom: 24, textAlign: 'center' },
  locationButton: { backgroundColor: cores.cinzaMetalico, padding: 16, borderRadius: 8, width: '100%', alignItems: 'center' },
  locationButtonText: { color: cores.textoNoCard, fontSize: 16, fontWeight: 'bold' },
  errorText: { color: cores.vermelhoRacing, marginTop: 12, textAlign: 'center' },
  formContainer: { width: '100%', marginTop: 24 },
  input: { backgroundColor: '#2d343e', color: cores.brancoPuro, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, marginBottom: 12, fontSize: 16 },
  ctaButton: { backgroundColor: cores.vermelhoRacing, padding: 16, borderRadius: 8, width: '100%', marginTop: 16 },
  ctaButtonText: { color: cores.brancoPuro, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }, 
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d343e',
    borderRadius: 8,
    marginBottom: 12,
  },
  loader: {
    marginRight: 16,
  },  
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: cores.brancoPuro, marginBottom: 12 },
  cardEndereco: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2d343e', padding: 20, borderRadius: 8, marginBottom: 12 },
  cardDetails: { marginLeft: 16 },
  cardText: { color: cores.brancoPuro, fontSize: 16, fontWeight: 'bold' },
  cardSubText: { color: cores.cinzaMetalico, fontSize: 14 },
  separatorText: { color: cores.cinzaMetalico, textAlign: 'center', fontSize: 14, marginVertical: 20, fontWeight: 'bold' },
});
