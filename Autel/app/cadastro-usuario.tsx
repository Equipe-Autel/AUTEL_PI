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

export default function CadastroUsuario() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    rg: '',
    telefone: '',
    email: '',
    endereco: '',
  });

  const { adicionarUsuario, login } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  const set = (key: keyof typeof form) => (val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    if (!form.nome || !form.cpf || !form.rg || !form.telefone || !form.email || !form.endereco) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const novo = adicionarUsuario({ ...form, isAdmin: false });
    login(novo.email);
    toast.success('Cadastro realizado com sucesso!');
    router.push('/cadastro-pet');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card>
          <CardHeader style={styles.header}>
            <View style={styles.iconWrap}>
              <Ionicons name="person-add-outline" size={32} color={Colors.teal} />
            </View>
            <CardTitle style={styles.title}>Cadastro de Usuário</CardTitle>
            <CardDescription style={styles.desc}>
              Preencha seus dados para criar sua conta no Autel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              label="Nome Completo *"
              value={form.nome}
              onChangeText={set('nome')}
              placeholder="Seu nome completo"
              autoCapitalize="words"
            />
            <View style={styles.row}>
              <Input
                label="CPF *"
                value={form.cpf}
                onChangeText={set('cpf')}
                placeholder="000.000.000-00"
                keyboardType="numeric"
                containerStyle={styles.half}
              />
              <Input
                label="RG *"
                value={form.rg}
                onChangeText={set('rg')}
                placeholder="00.000.000-0"
                keyboardType="numeric"
                containerStyle={styles.half}
              />
            </View>
            <View style={styles.row}>
              <Input
                label="Telefone *"
                value={form.telefone}
                onChangeText={set('telefone')}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                containerStyle={styles.half}
              />
              <Input
                label="E-mail *"
                value={form.email}
                onChangeText={set('email')}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.half}
              />
            </View>
            <Input
              label="Endereço Completo *"
              value={form.endereco}
              onChangeText={set('endereco')}
              placeholder="Rua, número, bairro, cidade — Estado"
            />

            <Button fullWidth onPress={handleSubmit} style={styles.submitBtn}>
              Cadastrar
            </Button>

            <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Já tenho conta — Fazer login</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.beige },
  content: { padding: Spacing[4], paddingBottom: Spacing[8] },
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
  title: { textAlign: 'center' },
  desc: { textAlign: 'center' },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  submitBtn: { marginTop: Spacing[2], marginBottom: Spacing[3] },
  loginLink: { alignItems: 'center' },
  loginLinkText: { fontSize: FontSizes.sm, color: Colors.teal, fontWeight: '600' },
});
