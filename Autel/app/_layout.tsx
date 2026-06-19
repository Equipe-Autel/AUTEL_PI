import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/context/AppContext';
import { ToastProvider } from '../src/components/ui/Toast';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ToastProvider>
          <StatusBar style="light" translucent={false} backgroundColor="#2D7A7B" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#2D7A7B' },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: { fontWeight: '700' },
              contentStyle: { backgroundColor: '#F5F5F0' },
              statusBarTranslucent: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ title: 'Entrar' }} />
            <Stack.Screen name="cadastro-usuario" options={{ title: 'Cadastro' }} />
            <Stack.Screen name="cadastro-pet" options={{ title: 'Cadastrar Pet' }} />
            <Stack.Screen name="editar-pet/[id]" options={{ title: 'Editar Pet' }} />
            <Stack.Screen name="admin" options={{ title: 'Painel Admin' }} />
            <Stack.Screen name="quem-somos" options={{ title: 'Nossa Equipe' }} />
            <Stack.Screen name="contatos" options={{ title: 'Contatos' }} />
            <Stack.Screen name="+not-found" options={{ title: 'Não Encontrado' }} />
          </Stack>
        </ToastProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
