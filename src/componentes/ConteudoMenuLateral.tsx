import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { cores } from '../constantes/cores';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import OpcaoMenu from './OpcaoMenu';

// A prop 'setPerfilUsuario' foi removida
interface ConteudoMenuLateralProps extends DrawerContentComponentProps {
  perfilUsuario: 'cliente' | 'admin';
}

export default function ConteudoMenuLateral(props: ConteudoMenuLateralProps) {
    const { logout } = useAutenticacao();

    return (
        <View style={{flex: 1, backgroundColor: cores.grafiteIntenso}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>WR Distribuidora</Text>
                    <Text style={styles.drawerSubtitle}>Bem-vindo(a)!</Text>
                </View>
                
                <DrawerItemList {...props} />

            </DrawerContentScrollView>
            
            <View style={styles.drawerFooter}>
              <OpcaoMenu icone="log-out-outline" texto="Sair" onPress={logout} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerHeader: { padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#2d343e' },
    drawerTitle: { fontSize: 24, fontWeight: 'bold', color: cores.brancoPuro },
    drawerSubtitle: { color: cores.brancoPuro, fontSize: 14 },
    drawerFooter: { borderTopWidth: 1, borderTopColor: '#2d343e', paddingBottom: 20 },
});