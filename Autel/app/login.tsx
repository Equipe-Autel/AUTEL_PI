import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../src/components/ui/Card';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { useApp } from '../src/context/AppContext';
import { useToast } from '../src/components/ui/Toast';
import { Colors, FontSizes, Spacing, BorderRadius } from '../src/constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const { login } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = () => {
    if (!email.trim()) {
      toast.error('Digite seu e-mail.');
      return;
    }
    const usuario = login(email.trim().toLowerCase());
    if (usuario) {
      toast.success(`Bem-vindo, ${usuario.nome}!`);
      router.replace('/');
    } else {
      toast.error('Usuário não encontrado. Verifique o e-mail ou cadastre-se.');
    }
  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <CardHeader style={styles.header}>
          <View style={styles.iconWrap}>
            <Ionicons name="log-in-outline" size={36} color={Colors.teal} />
          </View>
          <CardTitle style={styles.title}>Entrar no Autel</CardTitle>
          <CardDescription style={styles.desc}>
            Digite seu e-mail cadastrado para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Button fullWidth onPress={handleLogin} style={styles.loginBtn}>
            Entrar
          </Button>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Ainda não tem conta? </Text>
            <TouchableOpacity onPress={() => router.push('/cadastro-usuario')}>
              <Text style={styles.registerLink}>Cadastre-se aqui</Text>
            </TouchableOpacity>
          </View>

          {/* Usuários de teste */}
          <View style={styles.testSection}>
            <Text style={styles.testTitle}>Usuários de teste:</Text>
            <TouchableOpacity
              style={[styles.testCard, { borderColor: Colors.orange }]}
              onPress={() => setEmail('admin@autel.com')}
              activeOpacity={0.7}
            >
              <Text style={[styles.testRole, { color: Colors.orange }]}>Administrador</Text>
              <Text style={styles.testEmail}>admin@autel.com</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.testCard, { borderColor: Colors.teal }]}
              onPress={() => setEmail('joao@email.com')}
              activeOpacity={0.7}
            >
              <Text style={[styles.testRole, { color: Colors.teal }]}>Usuário Comum</Text>
              <Text style={styles.testEmail}>joao@email.com</Text>
            </TouchableOpacity>
          </View>


        </CardContent>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.beige },
  content: { flexGrow: 1, justifyContent: 'center', padding: Spacing[4], paddingVertical: Spacing[8] },
  card: { width: '100%' },
  header: { alignItems: 'center' },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
  },
  title: { textAlign: 'center', fontSize: FontSizes['2xl'] },
  desc: { textAlign: 'center' },
  loginBtn: { marginTop: Spacing[2], marginBottom: Spacing[3] },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: Spacing[4] },
  registerText: { fontSize: FontSizes.sm, color: Colors.gray[600] },
  registerLink: { fontSize: FontSizes.sm, color: Colors.teal, fontWeight: '600' },
  testSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    paddingTop: Spacing[4],
    gap: 8,
    marginBottom: Spacing[3],
  },
  testTitle: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.gray[500],
    textAlign: 'center',
    marginBottom: 4,
  },
  testCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
    alignItems: 'center',
    backgroundColor: Colors.beige,
  },
  testRole: { fontSize: FontSizes.xs, fontWeight: '700' },
  testEmail: { fontSize: FontSizes.xs, color: Colors.gray[600], marginTop: 2 },
  resetBtn: { alignItems: 'center' },
  resetText: { fontSize: FontSizes.xs, color: Colors.red },
});
