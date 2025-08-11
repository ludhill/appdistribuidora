import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { PilhaClienteParamList } from '../../tipos';
import { useCarrinho, ItemCarrinho } from '../../contextos/ContextoCarrinho';

type Props = NativeStackScreenProps<PilhaClienteParamList, 'Carrinho'>;

export default function TelaCarrinho({ navigation }: Props) {
  
  const { itens, aumentarQuantidade, diminuirQuantidade, estaCarregando } = useCarrinho();

  const total = itens.reduce((soma: number, item: ItemCarrinho) => soma + item.preco * item.quantidade, 0);

  
  if (estaCarregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={cores.brancoPuro} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Meu Carrinho</Text>

        {itens.length === 0 ? (
          <>
            <Text style={styles.emptyText}>O seu carrinho está vazio.</Text>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Catalogo')}
            >
              <Text style={styles.secondaryButtonText}>Voltar à Loja</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {itens.map((item) => (
              <View key={item.id} style={styles.itemContainer}>
                <Image source={{ uri: item.imagemUrl }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.nome}</Text>
                  <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</Text>
                </View>
                <View style={styles.quantityControl}>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => diminuirQuantidade(item.id)}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantidade}</Text>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => aumentarQuantidade(item.id)}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.ctaButtonText}>Finalizar Compra</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Catalogo')}
            >
              <Text style={styles.secondaryButtonText}>Continuar a comprar</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { padding: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 30, fontWeight: 'bold', color: cores.brancoPuro, marginBottom: 24, textAlign: 'center' },
  emptyText: { fontSize: 18, color: cores.cinzaMetalico, textAlign: 'center', marginTop: 50, marginBottom: 20 },
  itemContainer: { flexDirection: 'row', backgroundColor: '#2d343e', padding: 10, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  itemImage: { width: 60, height: 60, borderRadius: 6 },
  itemDetails: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: cores.brancoPuro },
  itemPrice: { fontSize: 14, color: cores.cinzaMetalico },
  quantityControl: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: { backgroundColor: cores.cinzaMetalico, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  quantityButtonText: { color: cores.textoNoCard, fontSize: 20, fontWeight: 'bold' },
  quantityText: { color: cores.brancoPuro, fontSize: 18, fontWeight: 'bold', marginHorizontal: 12 },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: cores.cinzaMetalico },
  totalText: { fontSize: 20, fontWeight: 'bold', color: cores.brancoPuro },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: cores.brancoPuro },
  ctaButton: { backgroundColor: cores.vermelhoRacing, padding: 16, borderRadius: 8, width: '100%', marginTop: 24 },
  ctaButtonText: { color: cores.brancoPuro, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: cores.cinzaMetalico,
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: cores.cinzaMetalico,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});