import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../constantes/cores';
import { useUsuario } from '../../contextos/ContextoUsuario';
import { PilhaPerfilParamList } from '../../tipos';
import CabecalhoInterno from '../../componentes/CabecalhoInterno';

type Props = NativeStackScreenProps<PilhaPerfilParamList, 'Notificacoes'>;

export default function TelaNotificacoes({ navigation }: Props) {
  const { estado, atualizarConfiguracoes } = useUsuario();

  const toggleSwitch = (tipo: 'email' | 'whatsapp') => {
    atualizarConfiguracoes({
      ...estado.configuracoes,
      [tipo]: !estado.configuracoes[tipo],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CabecalhoInterno titulo="Notificações" onVoltar={() => navigation.goBack()} />
      <View style={styles.container}>
        <View style={styles.option}>
          <Text style={styles.optionText}>Receber notificações por E-mail</Text>
          <Switch
            trackColor={{ false: cores.cinzaMetalico, true: cores.vermelhoRacing }}
            thumbColor={cores.brancoPuro}
            onValueChange={() => toggleSwitch('email')}
            value={estado.configuracoes.email}
          />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>Receber notificações por WhatsApp</Text>
          <Switch
            trackColor={{ false: cores.cinzaMetalico, true: cores.vermelhoRacing }}
            thumbColor={cores.brancoPuro}
            onValueChange={() => toggleSwitch('whatsapp')}
            value={estado.configuracoes.whatsapp}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.grafiteIntenso },
  container: { padding: 20 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2d343e', padding: 20, borderRadius: 8, marginBottom: 16 },
  optionText: { color: cores.brancoPuro, fontSize: 16, flex: 1, marginRight: 10 },
});
