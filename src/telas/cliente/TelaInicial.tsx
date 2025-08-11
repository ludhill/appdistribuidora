import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { PilhaClienteParamList } from '../../tipos';
import { useProdutos } from '../../contextos/ContextoProdutos';  

type Props = NativeStackScreenProps<PilhaClienteParamList, 'Catalogo'>;

export default function TelaInicial({ navigation }: Props) {
  
  const { produtos, estaCarregando } = useProdutos();

  if (estaCarregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color={cores.brancoPuro} style={{ flex: 1 }}/>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.headerTitle}>Catálogo de Produtos</Text>
        <View style={styles.productListContainer}>
          
          {produtos.map(produto => (
            <TouchableOpacity 
              key={produto.id} 
              style={styles.productCard}
              onPress={() => navigation.navigate('DetalhesDoProduto', { produto })}
            >
              <Image source={{ uri: produto.imagemUrl }} style={styles.productImage} resizeMode="cover" />
              <Text style={styles.productName}>{produto.nome}</Text>
              <Text style={styles.productPrice}>R$ {produto.preco.toFixed(2)}</Text>
              <Text style={styles.productStock}>Estoque: {produto.estoque}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  scrollViewContent: { padding: 16 },
  headerTitle: { fontSize: 30, fontWeight: 'bold', color: cores.brancoPuro, marginBottom: 16 },
  productListContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: { width: '48%', backgroundColor: cores.cinzaMetalico, borderRadius: 8, padding: 12, marginBottom: 16 },
  productImage: { width: '100%', height: 128, borderRadius: 6 },
  productName: { fontSize: 18, fontWeight: '600', marginTop: 8, color: cores.textoNoCard },
  productPrice: { fontSize: 16, color: cores.textoNoCard, fontWeight: 'bold' },
  productStock: { fontSize: 14, color: cores.textoNoCard },
});
