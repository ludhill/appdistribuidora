import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../constantes/cores';
import { Pedido } from '../tipos';

interface Props {
  statusAtual: Pedido['status'];
  onStatusChange: (novoStatus: Pedido['status']) => void;
}

const opcoesStatus: Pedido['status'][] = ['Aguardando Confirmação', 'Processando', 'Enviado', 'Entregue'];

export default function SeletorStatus({ statusAtual, onStatusChange }: Props) {
  const [modalVisivel, setModalVisivel] = useState(false);

  const handleSelect = (status: Pedido['status']) => {
    onStatusChange(status);
    setModalVisivel(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.seletorContainer} onPress={() => setModalVisivel(true)}>
        <Text style={styles.seletorTexto}>{statusAtual}</Text>
        <Ionicons name="chevron-down-outline" size={24} color={cores.cinzaMetalico} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Selecione um Status</Text>
            {opcoesStatus.map(opcao => (
              <TouchableOpacity 
                key={opcao} 
                style={styles.opcaoBotao} 
                onPress={() => handleSelect(opcao)}
              >
                <Text style={styles.opcaoTexto}>{opcao}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.botaoFechar} onPress={() => setModalVisivel(false)}>
              <Text style={styles.botaoFecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  seletorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d343e',
    padding: 16,
    borderRadius: 8,
  },
  seletorTexto: {
    color: cores.brancoPuro,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalConteudo: {
    backgroundColor: cores.grafiteIntenso,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitulo: {
    color: cores.brancoPuro,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  opcaoBotao: {
    backgroundColor: '#2d343e',
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  opcaoTexto: {
    color: cores.brancoPuro,
    fontSize: 18,
    textAlign: 'center',
  },
  botaoFechar: {
    backgroundColor: cores.vermelhoRacing,
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  botaoFecharTexto: {
    color: cores.brancoPuro,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
