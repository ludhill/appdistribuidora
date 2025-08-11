import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { useProdutos } from '../../contextos/ContextoProdutos';
import { PilhaAdminParamList, Produto } from '../../tipos';
import CabecalhoInterno from '../../componentes/CabecalhoInterno';

type Props = NativeStackScreenProps<PilhaAdminParamList, 'EditarProduto'>;

export default function TelaEditarProduto({ route, navigation }: Props) {
  const { idProduto } = route.params;
  const { produtos, adicionarProduto, atualizarProduto } = useProdutos();
  
  const [form, setForm] = useState<Omit<Produto, 'id'>>({
    nome: '', preco: 0, estoque: 0, categoria: '', imagemUrl: '', descricao: ''
  });

  const isEditing = idProduto !== undefined;

  useEffect(() => {
    if (isEditing) {
      const produtoExistente = produtos.find(p => p.id === idProduto);
      if (produtoExistente) {
        setForm(produtoExistente);
      }
    }
  }, [idProduto, produtos, isEditing]);

  const handleSalvar = () => {
    if (!form.nome || form.preco <= 0) {
      Alert.alert("Erro", "Preencha pelo menos o nome e um preço válido.");
      return;
    }
    
    if (isEditing) {
      atualizarProduto({ ...form, id: idProduto! });
    } else {
      adicionarProduto(form);
    }
    Alert.alert("Sucesso", `Produto ${isEditing ? 'atualizado' : 'adicionado'} com sucesso!`);
    navigation.goBack();
  };

  const handleInputChange = (campo: keyof typeof form, valor: string | number) => {
    setForm(prevState => ({ ...prevState, [campo]: valor }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CabecalhoInterno titulo={isEditing ? "Editar Produto" : "Novo Produto"} onVoltar={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput style={styles.input} placeholder="Nome do Produto" value={form.nome} onChangeText={(t) => handleInputChange('nome', t)} />
        <TextInput style={styles.input} placeholder="Preço (ex: 150.99)" value={String(form.preco)} onChangeText={(t) => handleInputChange('preco', Number(t))} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Estoque" value={String(form.estoque)} onChangeText={(t) => handleInputChange('estoque', Number(t))} keyboardType="number-pad" />
        <TextInput style={styles.input} placeholder="Categoria" value={form.categoria} onChangeText={(t) => handleInputChange('categoria', t)} />
        <TextInput style={styles.input} placeholder="URL da Imagem" value={form.imagemUrl} onChangeText={(t) => handleInputChange('imagemUrl', t)} />
        <TextInput style={[styles.input, { height: 100 }]} placeholder="Descrição" value={form.descricao} onChangeText={(t) => handleInputChange('descricao', t)} multiline />
        
        <TouchableOpacity style={styles.ctaButton} onPress={handleSalvar}>
          <Text style={styles.ctaButtonText}>Salvar Produto</Text>
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