import '../../global.css';
import '@/i18n';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import {SavedContentProvider} from '@/features/saved/context/SavedContext';
import {QueryProvider} from '@/providers/QueryProvider';


export default function RootLayout() {

  return (

    <QueryProvider>

      <SavedContentProvider>

        <StatusBar
          style="dark"
        />

        <Stack
          screenOptions={{
            headerShown:false,
          }}
        >

          <Stack.Screen
            name="(tabs)"
          />


          <Stack.Screen
            name="article/[id]"
          />


          <Stack.Screen
            name="video/[id]"
          />


          <Stack.Screen
            name="profile"
          />


          <Stack.Screen
            name="admin"
          />

        </Stack>


        <Toast />


      </SavedContentProvider>

    </QueryProvider>

  );

}