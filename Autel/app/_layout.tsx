import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../src/context/AppContext';
import { ToastProvider } from '../src/components/ui/Toast';

export default function RootLayout() {
  return (
    <AppProvider>
      <ToastProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#2D7A7B' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#F5F5F0' },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: 'Entrar', presentation: 'modal' }} />
          <Stack.Screen name="cadastro-usuario" options={{ title: 'Cadastro' }} />
          <Stack.Screen name="cadastro-pet" options={{ title: 'Cadastrar Pet' }} />
          <Stack.Screen name="admin" options={{ title: 'Painel Admin' }} />
          <Stack.Screen name="quem-somos" options={{ title: 'Nossa Equipe' }} />
          <Stack.Screen name="contatos" options={{ title: 'Contatos' }} />
          <Stack.Screen name="+not-found" options={{ title: 'Não Encontrado' }} />
        </Stack>
      </ToastProvider>
    </AppProvider>
  );
}
