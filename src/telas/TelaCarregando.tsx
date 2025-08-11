import React from 'react';
import { View, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { cores } from '../constantes/cores';

export default function TelaCarregando() {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color={cores.brancoPuro} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.grafiteIntenso,
  },
});
