import React, { useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import Routes from './src/routes';
import * as Notifications from 'expo-notifications';

import { 
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
 } from '@expo-google-fonts/jost';

import Confirmation from './src/pages/Confirmation';
import 'react-native-gesture-handler';
import { PlantProps } from './src/libs/storage';

export default function App(){
  const [ fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  useEffect(()=>{

    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {
         const data = notification.request.content.data.plant as PlantProps;
         console.log("#####  NOTIFICAÇÃO NOVA  #####");
         console.log(data);
      }
    );

    return() => subscription.remove();

    // CANCELA A NOTIFICAÇÃO
    // async function notifications() {
    //  await Notifications.cancelAllScheduledNotificationsAsync();

    //   const data = await Notifications.getAllScheduledNotificationsAsync();
    //   console.log('#### NOTIFICAÇÕES AGENDADAS ##### ');
    // }

    // notifications();
  },[]);

  if(!fontsLoaded)

  return <AppLoading />
    

  return(
      <Routes />
  )
}
