import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardHeader, CardTitle, CardContent } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useApp } from '../../src/context/AppContext';
import { useToast } from '../../src/components/ui/Toast';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../src/constants/theme';

const FORM_INITIAL = {
  nome: '',
  cpf: '',
  rg: '',
  telefone: '',
  email: '',
  endereco: '',
};

export default function Cadastro() {
  const { usuarioLogado, adicionarUsuario } = useApp();
  const { toast } = useToast();
  const [form, setForm] = useState(FORM_INITIAL);
  const set = (key: keyof typeof FORM_INITIAL) => (val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  if (!usuarioLogado?.isAdmin) return null;

  const handleSubmit = () => {
    if (!form.nome || !form.cpf || !form.rg || !form.telefone || !form.email || !form.endereco) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    adicionarUsuario({ ...form, isAdmin: false });
    toast.success(`Cliente ${form.nome} cadastrado com sucesso!`);
    setForm(FORM_INITIAL);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card>
          <CardHeader style={styles.header}>
            <View style={styles.iconWrap}>
              <Ionicons name="person-add-outline" size={32} color={Colors.teal} />
            </View>
            <CardTitle style={styles.title}>Cadastrar Cliente</CardTitle>
            <Text style={styles.subtitle}>Preencha os dados para criar a conta do cliente</Text>
          </CardHeader>

          <CardContent>
            <Input
              label="Nome Completo *"
              value={form.nome}
              onChangeText={set('nome')}
              placeholder="Nome completo do cliente"
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
                placeholder="cliente@email.com"
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
              Cadastrar Cliente
            </Button>

            <Button variant="outline" fullWidth onPress={() => setForm(FORM_INITIAL)}>
              Limpar Formulário
            </Button>
          </CardContent>
        </Card>
      </View>
      <View style={{ height: Spacing[8] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.beige },
  content: { padding: Spacing[4] },
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
  subtitle: { fontSize: FontSizes.sm, color: Colors.gray[500], textAlign: 'center', marginTop: 4 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  submitBtn: { marginTop: Spacing[2], marginBottom: Spacing[3] },
});
