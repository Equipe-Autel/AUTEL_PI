import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '../src/components/ui/Card';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { useToast } from '../src/components/ui/Toast';
import { Colors, FontSizes, Spacing, BorderRadius } from '../src/constants/theme';

const INFOS = [
  {
    icon: 'call',
    title: 'Telefone',
    lines: ['(11) 3456-7890', '(11) 98765-4321 (WhatsApp)'],
    color: Colors.teal,
  },
  {
    icon: 'mail',
    title: 'E-mail',
    lines: ['contato@autel.com.br', 'reservas@autel.com.br'],
    color: Colors.orange,
  },
  {
    icon: 'location',
    title: 'Localização',
    lines: ['Rua dos Pets, 123 — Jardim Animal', 'São Paulo, SP — CEP 01310-100'],
    color: Colors.teal,
  },
  {
    icon: 'time',
    title: 'Horário',
    lines: ['Seg–Sex: 08h às 18h', 'Sáb: 09h às 15h'],
    color: Colors.orange,
  },
];

export default function Contatos() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' });
  const { toast } = useToast();

  const set = (key: keyof typeof form) => (val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    if (!form.nome || !form.email || !form.mensagem) {
      toast.error('Preencha nome, e-mail e mensagem.');
      return;
    }
    toast.success('Mensagem enviada! Entraremos em contato em breve.');
    setForm({ nome: '', email: '', telefone: '', mensagem: '' });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Entre em Contato</Text>
        <Text style={styles.heroSubtitle}>Estamos aqui para responder suas dúvidas</Text>
      </View>

      <View style={styles.content}>
        {/* Info Cards */}
        <Text style={styles.sectionTitle}>Informações de Contato</Text>
        <View style={styles.infoGap}>
          {INFOS.map(info => (
            <Card key={info.title}>
              <CardContent style={styles.infoContent}>
                <View style={[styles.infoIcon, { backgroundColor: `${info.color}18` }]}>
                  <Ionicons name={info.icon as any} size={22} color={info.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitle}>{info.title}</Text>
                  {info.lines.map(l => (
                    <Text key={l} style={styles.infoLine}>{l}</Text>
                  ))}
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Formulário */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing[4] }]}>Enviar Mensagem</Text>
        <Card>
          <CardContent>
            <Input
              label="Nome *"
              value={form.nome}
              onChangeText={set('nome')}
              placeholder="Seu nome"
              autoCapitalize="words"
            />
            <View style={styles.row}>
              <Input
                label="E-mail *"
                value={form.email}
                onChangeText={set('email')}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.half}
              />
              <Input
                label="Telefone"
                value={form.telefone}
                onChangeText={set('telefone')}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                containerStyle={styles.half}
              />
            </View>
            <View style={styles.textareaWrap}>
              <Text style={styles.textareaLabel}>Mensagem *</Text>
              <TextInput
                style={styles.textarea}
                value={form.mensagem}
                onChangeText={set('mensagem')}
                placeholder="Como podemos ajudar?"
                placeholderTextColor={Colors.gray[400]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            <Button fullWidth onPress={handleSubmit}>
              Enviar Mensagem
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

  hero: {
    backgroundColor: Colors.teal,
    padding: Spacing[6],
    paddingTop: Spacing[8],
    paddingBottom: Spacing[8],
    alignItems: 'center',
  },
  heroTitle: { fontSize: FontSizes['3xl'], fontWeight: '800', color: Colors.white, textAlign: 'center', marginBottom: Spacing[2] },
  heroSubtitle: { fontSize: FontSizes.base, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },

  content: { padding: Spacing[4], paddingTop: Spacing[5] },
  sectionTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.gray[900], marginBottom: Spacing[3] },

  infoGap: { gap: 10, marginBottom: Spacing[2] },
  infoContent: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[3], padding: Spacing[4] },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoTitle: { fontSize: FontSizes.base, fontWeight: '700', color: Colors.gray[900], marginBottom: 4 },
  infoLine: { fontSize: FontSizes.sm, color: Colors.gray[600], marginTop: 1 },

  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  textareaWrap: { marginBottom: Spacing[3] },
  textareaLabel: { fontSize: FontSizes.sm, fontWeight: '500', color: Colors.gray[700], marginBottom: 6 },
  textarea: {
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
    fontSize: FontSizes.base,
    color: Colors.gray[900],
    backgroundColor: Colors.white,
    minHeight: 100,
  },
});
