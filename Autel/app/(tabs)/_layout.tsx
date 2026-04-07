import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

function HeaderRight() {
  const { usuarioLogado, logout } = useApp();
  const router = useRouter();

  if (!usuarioLogado) {
    return (
      <TouchableOpacity
        onPress={() => router.push('/login')}
        style={styles.headerBtn}
      >
        <Text style={styles.headerBtnText}>Entrar</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.headerRight}>
      {usuarioLogado.isAdmin && (
        <TouchableOpacity onPress={() => router.push('/admin')} style={styles.headerBtn}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.white} />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={logout} style={styles.headerBtn}>
        <Ionicons name="log-out-outline" size={20} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

export default function TabsLayout() {
  const { usuarioLogado } = useApp();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.teal,
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray[200],
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: Colors.teal },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: '700' },
        headerRight: () => <HeaderRight />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerTitle: 'Autel Pet Hotel',
        }}
      />
      <Tabs.Screen
        name="hotel"
        options={{
          title: 'Reservar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
          headerTitle: 'Reserva',
        }}
      />
      <Tabs.Screen
        name="minhas-reservas"
        options={{
          title: 'Reservas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
          headerTitle: 'Minhas Reservas',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 8,
  },
  headerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerBtnText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
