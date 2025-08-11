import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Pedido } from '../tipos';
 
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export async function registarParaNotificacoesPushAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Falha ao obter o token para notificações push!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } else {
    alert('É necessário usar um dispositivo físico para as Notificações Push.');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}


export async function enviarNotificacaoPedidoEnviado(pedido: Pedido) {
  const trigger: Notifications.NotificationTriggerInput = { seconds: 2 };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Pedido Enviado! 🚚",
      body: `O seu pedido #${pedido.id.slice(-5)} foi enviado e está a caminho!`,
      data: { idPedido: pedido.id },
    },
    trigger,
  });
}