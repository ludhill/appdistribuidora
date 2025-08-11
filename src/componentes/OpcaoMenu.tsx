import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../constantes/cores';

interface Props {
  icone: keyof typeof Ionicons.glyphMap;
  texto: string;
  onPress: () => void;
}

export default function OpcaoMenu({ icone, texto, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.opcaoContainer} onPress={onPress}>
      <Ionicons name={icone} size={24} color={cores.cinzaMetalico} />
      <Text style={styles.opcaoTexto}>{texto}</Text>
      <Ionicons name="chevron-forward-outline" size={24} color={cores.cinzaMetalico} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  opcaoContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: cores.grafiteIntenso 
  },
  opcaoTexto: { 
    flex: 1, 
    color: cores.brancoPuro, 
    fontSize: 18, 
    marginLeft: 16 
  },
});
