import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../src/components/ui/Card';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { useApp } from '../src/context/AppContext';
import { useToast } from '../src/components/ui/Toast';
import { Colors, FontSizes, Spacing, BorderRadius } from '../src/constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useApp();
  const { toast } = useToast();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email.trim()) {
      toast.error('Digite seu e-mail.');
      return;
    }
    const isCode = email.trim().toUpperCase().startsWith('ADM');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isCode && !emailRegex.test(email.trim())) {
      toast.error('Digite um e-mail válido.');
      return;
    }
    if (!senha) {
      toast.error('Digite sua senha.');
      return;
    }
    try {
      const usuario = await login(email.trim(), senha);
      if (usuario) {
        toast.success(`Bem-vindo, ${usuario.nome}!`);
        router.replace('/');
      } else {
        toast.error('Credenciais incorretas ou usuário não encontrado.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao realizar login.');
    }
  };


  return (
    <View style={[styles.safeArea, { paddingBottom: insets.bottom }]}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
              label="E-mail / Código"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com ou ADM001"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              placeholder="Digite sua senha"
              secureTextEntry
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
              <Text style={styles.testTitle}>Usuários de teste (Banco de Dados):</Text>
              <TouchableOpacity
                style={[styles.testCard, { borderColor: Colors.orange }]}
                onPress={() => { setEmail('ADM001'); setSenha('senha_admin'); }}
                activeOpacity={0.7}
              >
                <Text style={[styles.testRole, { color: Colors.orange }]}>Administrador</Text>
                <Text style={styles.testEmail}>ADM001 (senha: senha_admin)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.testCard, { borderColor: Colors.teal }]}
                onPress={() => { setEmail('joaosilva@email.com'); setSenha('senha_segura_123'); }}
                activeOpacity={0.7}
              >
                <Text style={[styles.testRole, { color: Colors.teal }]}>Usuário Comum</Text>
                <Text style={styles.testEmail}>joaosilva@email.com (senha: senha_segura_123)</Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.beige },
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
