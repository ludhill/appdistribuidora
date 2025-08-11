import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../constantes/cores';

interface Props {
  titulo: string;
  onVoltar: () => void;
}

export default function CabecalhoInterno({ titulo, onVoltar }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onVoltar} style={styles.botaoVoltar}>
        <Ionicons name="arrow-back-outline" size={28} color={cores.brancoPuro} />
      </TouchableOpacity>
      <Text style={styles.titulo}>{titulo}</Text>
      <View style={{ width: 40 }} />  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: cores.grafiteIntenso,  
  },
  botaoVoltar: {
    padding: 5,
  },
  titulo: {
    color: cores.brancoPuro,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
