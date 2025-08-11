import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, SafeAreaView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { PilhaClienteParamList } from '../../tipos';
import { useCarrinho } from '../../contextos/ContextoCarrinho';
import { useDesejos } from '../../contextos/ContextoDesejos';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<PilhaClienteParamList, 'DetalhesDoProduto'>;

export default function TelaDetalhesProduto({ route, navigation }: Props) {
    const { produto } = route.params;
    const { adicionarAoCarrinho } = useCarrinho();
    const { adicionarAosDesejos, removerDosDesejos, itemEstaNosDesejos } = useDesejos();
    const nosDesejos = itemEstaNosDesejos(produto.id);
 
    const handleAdicionar = () => {
        adicionarAoCarrinho(produto);
        Alert.alert("Sucesso!", `${produto.nome} foi adicionado ao carrinho.`);
    }

    const handleToggleDesejo = () => {
        if (nosDesejos) {
            removerDosDesejos(produto.id);
        } else {
            adicionarAosDesejos(produto);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <Image source={{ uri: produto.imagemUrl }} style={styles.detailImage} />

                <TouchableOpacity style={styles.wishlistButton} onPress={handleToggleDesejo}>
                    <Ionicons name={nosDesejos ? "heart" : "heart-outline"} size={32} color={cores.vermelhoRacing} />
                </TouchableOpacity>

                <View style={styles.detailContent}>
                    <Text style={styles.detailName}>{produto.nome}</Text>
                    <Text style={styles.detailPrice}>R$ {produto.preco.toFixed(2)}</Text>
                    <Text style={styles.detailDescription}>{produto.descricao || 'Descrição detalhada do produto aqui.'}</Text>
                    <Text style={styles.detailInfo}>Categoria: {produto.categoria}</Text>
                    <Text style={styles.detailInfo}>Em estoque: {produto.estoque} unidades</Text>


                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={handleAdicionar}
                        >
                            <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.goToCartButton}
                            onPress={() => navigation.navigate('Carrinho')}
                        >
                            <Text style={styles.buttonText}>Ir para o Carrinho</Text>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Catalogo')}
                    >
                        <Text style={styles.secondaryButtonText}>Voltar à Loja</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
    detailImage: { width: '100%', height: 256 },
    detailContent: { padding: 24, backgroundColor: cores.grafiteIntenso },
    detailName: { fontSize: 30, fontWeight: 'bold', color: cores.brancoPuro },
    detailPrice: { fontSize: 24, color: cores.brancoPuro, fontWeight: 'bold', marginVertical: 8 },
    detailDescription: { fontSize: 16, color: cores.brancoPuro, lineHeight: 24, marginTop: 16 },
    detailInfo: { fontSize: 16, color: cores.cinzaMetalico, marginTop: 16 },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        gap: 10, 
    },
    addToCartButton: {
        backgroundColor: cores.vermelhoRacing,
        padding: 16,
        borderRadius: 8,
        flex: 1,  
    },
    goToCartButton: {
        backgroundColor: cores.cinzaMetalico,
        padding: 16,
        borderRadius: 8,
        flex: 1,
    },
    buttonText: {
        color: cores.brancoPuro,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
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
        fontSize: 16,
        fontWeight: 'bold',
    }, 
    wishlistButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 25,
    },
});
