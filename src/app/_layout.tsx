import React from 'react';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {useFonts,Inter_400Regular,Inter_500Medium,Inter_600SemiBold,Inter_700Bold} from '@expo-google-fonts/inter';
import {AppProvider} from '../state';
export default function Layout(){const [ready,error]=useFonts({Inter_400Regular,Inter_500Medium,Inter_600SemiBold,Inter_700Bold});if(!ready&&!error)return null;return <AppProvider><StatusBar style="dark"/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:'#f9f9ff'}}}/></AppProvider>;}
