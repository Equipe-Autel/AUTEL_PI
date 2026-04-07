import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../src/components/ui/Button';
import { Colors, FontSizes, Spacing } from '../src/constants/theme';

export default function NotFound() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={80} color={Colors.gray[300]} />
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Página não encontrada</Text>
      <Text style={styles.desc}>A tela que você procura não existe.</Text>
      <Button onPress={() => router.replace('/')} style={styles.btn}>
        Voltar ao Início
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[6],
    backgroundColor: Colors.beige,
  },
  code: {
    fontSize: 72,
    fontWeight: '900',
    color: Colors.gray[200],
    marginTop: Spacing[4],
    lineHeight: 80,
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: Colors.gray[800],
    marginBottom: Spacing[2],
  },
  desc: {
    fontSize: FontSizes.base,
    color: Colors.gray[500],
    marginBottom: Spacing[6],
  },
  btn: {},
});
