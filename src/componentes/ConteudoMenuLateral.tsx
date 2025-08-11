import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { cores } from '../constantes/cores';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import OpcaoMenu from './OpcaoMenu';

interface ConteudoMenuLateralProps extends DrawerContentComponentProps {
  perfilUsuario: 'cliente' | 'admin';
}

export default function ConteudoMenuLateral(props: ConteudoMenuLateralProps) {
    // Obter a função de logout do contexto de autenticação
    const { logout } = useAutenticacao();

    return (
        <View style={{flex: 1, backgroundColor: cores.grafiteIntenso}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>WR Distribuidora</Text>
                    <Text style={styles.drawerSubtitle}>Bem-vindo(a)!</Text>
                </View>
                
                {/* Renderiza os itens principais (Loja, Perfil, etc.) */}
                <DrawerItemList {...props} />

            </DrawerContentScrollView>
            
            {/* O botão de Sair fica fixo na parte inferior e chama a função logout */}
            <View style={styles.drawerFooter}>
                 {/* <DrawerItem
                    label="Alternar para Admin"
                    onPress={() => setPerfilUsuario('admin')}
                    labelStyle={{color: cores.vermelhoRacing, fontWeight: 'bold'}}
                 />
                 <DrawerItem
                    label="Alternar para Cliente"
                    onPress={() => setPerfilUsuario('cliente')}
                    labelStyle={{color: cores.vermelhoRacing, fontWeight: 'bold'}}
                 />
                <DrawerItem
                    label="Sair"
                    onPress={() => alert('Funcionalidade de logout a ser implementada.')}
                    labelStyle={{color: cores.brancoPuro}}
                /> */}
              <OpcaoMenu icone="log-out-outline" texto="Sair" onPress={logout} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerHeader: { 
        padding: 20, 
        paddingTop: 50,
        borderBottomWidth: 1, 
        borderBottomColor: '#2d343e', 
    },
    drawerTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: cores.brancoPuro 
    },
    drawerSubtitle: { 
        color: cores.brancoPuro, 
        fontSize: 14 
    },
    drawerFooter: { 
        borderTopWidth: 1, 
        borderTopColor: '#2d343e', 
        paddingBottom: 20,
    },
});
