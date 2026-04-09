import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

function HeaderLeft() {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.headerLeft} onPress={() => router.push('/')}>
      <Ionicons name="paw" size={20} color={Colors.teal} />
      <Text style={styles.headerTitle}>Autel</Text>
    </TouchableOpacity>
  );
}

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
        <TouchableOpacity onPress={() => router.push('/admin')} style={styles.adminBtn}>
          <Ionicons name="shield-checkmark" size={18} color={Colors.teal} />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={18} color={Colors.teal} />
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
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.gray[900],
        headerTitleStyle: { fontWeight: '700' },
        headerLeft: () => <HeaderLeft />,
        headerRight: () => <HeaderRight />,
        headerTitle: '',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hotel"
        options={{
          title: 'Hotel',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quem-somos"
        options={{
          title: 'Equipe',
          href: usuarioLogado ? null : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contatos"
        options={{
          title: 'Contato',
          href: usuarioLogado ? null : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="minhas-reservas"
        options={{
          title: 'Reservas',
          href: usuarioLogado ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meus-pets"
        options={{
          title: 'Meus Pets',
          href: usuarioLogado ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 16,
  },
  headerTitle: {
    color: Colors.teal,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 12,
  },
  headerBtn: {
    marginRight: 12,
    backgroundColor: Colors.teal,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
  },
  headerBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  adminBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  logoutBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});
