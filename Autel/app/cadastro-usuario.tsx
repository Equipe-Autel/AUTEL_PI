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

const maskCPF = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

export default function CadastroUsuario() {
  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    cpf: '',
    telefone: '',
    email: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    contatoEmergencia: '',
    telefoneEmergencia: '',
  });

  const { adicionarUsuario, login } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  const set = (key: keyof typeof form) => (val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const setCPF = (val: string) => setForm(prev => ({ ...prev, cpf: maskCPF(val) }));
  const setPhone = (val: string) => setForm(prev => ({ ...prev, telefone: maskPhone(val) }));
  const setPhoneEmerg = (val: string) => setForm(prev => ({ ...prev, telefoneEmergencia: maskPhone(val) }));

  const handleSubmit = () => {
    const required = [
      form.nome, form.sobrenome, form.cpf, form.telefone, form.email,
      form.logradouro, form.numero, form.bairro, form.cidade, form.estado,
    ];
    if (required.some(f => !f)) {
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
            <View style={styles.row}>
              <Input
                label="Nome *"
                value={form.nome}
                onChangeText={set('nome')}
                placeholder="Seu nome"
                autoCapitalize="words"
                containerStyle={styles.half}
              />
              <Input
                label="Sobrenome *"
                value={form.sobrenome}
                onChangeText={set('sobrenome')}
                placeholder="Seu sobrenome"
                autoCapitalize="words"
                containerStyle={styles.half}
              />
            </View>

            <View style={styles.row}>
              <Input
                label="CPF *"
                value={form.cpf}
                onChangeText={setCPF}
                placeholder="000.000.000-00"
                keyboardType="numeric"
                containerStyle={styles.half}
              />
              <Input
                label="Telefone *"
                value={form.telefone}
                onChangeText={setPhone}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                containerStyle={styles.half}
              />
            </View>

            <Input
              label="E-mail *"
              value={form.email}
              onChangeText={set('email')}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.sectionLabel}>Endereço</Text>

            <Input
              label="Logradouro *"
              value={form.logradouro}
              onChangeText={set('logradouro')}
              placeholder="Rua, Avenida, Travessa..."
              autoCapitalize="words"
            />

            <View style={styles.row}>
              <Input
                label="Número *"
                value={form.numero}
                onChangeText={set('numero')}
                placeholder="123"
                keyboardType="numeric"
                containerStyle={styles.third}
              />
              <Input
                label="Complemento"
                value={form.complemento}
                onChangeText={set('complemento')}
                placeholder="Apto, Bloco..."
                autoCapitalize="words"
                containerStyle={styles.twoThirds}
              />
            </View>

            <Input
              label="Bairro *"
              value={form.bairro}
              onChangeText={set('bairro')}
              placeholder="Seu bairro"
              autoCapitalize="words"
            />

            <View style={styles.row}>
              <Input
                label="Cidade *"
                value={form.cidade}
                onChangeText={set('cidade')}
                placeholder="Sua cidade"
                autoCapitalize="words"
                containerStyle={styles.twoThirds}
              />
              <Input
                label="Estado *"
                value={form.estado}
                onChangeText={(v) => set('estado')(v.toUpperCase().slice(0, 2))}
                placeholder="SP"
                autoCapitalize="characters"
                containerStyle={styles.third}
              />
            </View>

            <Text style={styles.sectionLabel}>Contato de Emergência</Text>

            <View style={styles.row}>
              <Input
                label="Nome do Contato"
                value={form.contatoEmergencia}
                onChangeText={set('contatoEmergencia')}
                placeholder="Nome completo"
                autoCapitalize="words"
                containerStyle={styles.half}
              />
              <Input
                label="Telefone de Emergência"
                value={form.telefoneEmergencia}
                onChangeText={setPhoneEmerg}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                containerStyle={styles.half}
              />
            </View>

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
  sectionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Spacing[2],
    marginBottom: Spacing[1],
  },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  third: { flex: 1 },
  twoThirds: { flex: 2 },
  submitBtn: { marginTop: Spacing[2], marginBottom: Spacing[3] },
  loginLink: { alignItems: 'center' },
  loginLinkText: { fontSize: FontSizes.sm, color: Colors.teal, fontWeight: '600' },
});
