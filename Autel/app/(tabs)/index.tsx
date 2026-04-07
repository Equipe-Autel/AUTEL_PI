import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';

const FEATURES = [
  { icon: 'heart', label: 'Amor', desc: 'Atenção individual', color: Colors.teal, bg: Colors.tealLight },
  { icon: 'shield-checkmark', label: 'Segurança', desc: 'Monitoramento 24h', color: Colors.orange, bg: Colors.orangeLight },
  { icon: 'time', label: 'Flexível', desc: 'Reservas online', color: Colors.teal, bg: Colors.tealLight },
  { icon: 'star', label: 'Excelência', desc: 'Primeira linha', color: Colors.orange, bg: Colors.orangeLight },
] as const;

const PLANOS = [
  {
    nome: 'Standard',
    preco: 'R$ 80/dia',
    items: ['3 passeios diários', 'Alimentação balanceada'],
    cor: Colors.teal,
  },
  {
    nome: 'Premium',
    preco: 'R$ 150/dia',
    items: ['Suíte individual + 5 passeios', 'Fotos diárias do pet'],
    cor: Colors.orange,
  },
  {
    nome: 'Luxo',
    preco: 'R$ 250/dia',
    items: ['Suíte VIP + Spa inclusos', 'Vídeos ao vivo 24h'],
    cor: Colors.tealDark,
  },
];

export default function Home() {
  const router = useRouter();
  const { usuarioLogado } = useApp();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Ionicons name="paw" size={48} color="rgba(255,255,255,0.3)" style={styles.heroPaw} />
        <Text style={styles.heroTitle}>Bem-vindo ao Autel</Text>
        <Text style={styles.heroSubtitle}>
          O melhor centro de hospedagem para seu melhor amigo
        </Text>
        <Button
          size="lg"
          fullWidth
          onPress={() => router.push('/hotel')}
          style={styles.heroBtn}
          textStyle={{ color: Colors.white }}
        >
          Fazer Reserva
        </Button>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Por Que Escolher o Autel?</Text>
        <View style={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <Card key={f.label} style={styles.featureCard}>
              <CardContent style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: f.bg }]}>
                  <Ionicons name={f.icon as any} size={24} color={f.color} />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>

      {/* Planos */}
      <View style={[styles.section, { backgroundColor: Colors.white }]}>
        <Text style={styles.sectionTitle}>Nossos Planos</Text>
        <View style={styles.planos}>
          {PLANOS.map((p) => (
            <Card key={p.nome} style={[styles.planoCard, { borderLeftColor: p.cor }]}>
              <CardContent style={styles.planoContent}>
                <View style={styles.planoHeader}>
                  <View>
                    <Text style={[styles.planoNome, { color: p.cor }]}>{p.nome}</Text>
                    <Text style={styles.planoPreco}>{p.preco}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
                </View>
                {p.items.map((item) => (
                  <View key={item} style={styles.planoItem}>
                    <View style={[styles.planoDot, { backgroundColor: p.cor }]} />
                    <Text style={styles.planoItemText}>{item}</Text>
                  </View>
                ))}
              </CardContent>
            </Card>
          ))}
        </View>
      </View>

      {/* Missão */}
      <View style={styles.section}>
        <Card style={[styles.missaoCard, { borderColor: Colors.teal }]}>
          <CardContent>
            <Text style={[styles.missaoTitle, { color: Colors.tealDark }]}>Nossa Missão</Text>
            <Text style={styles.missaoText}>
              Oferecer um ambiente seguro, confortável e divertido para que seu bichinho se sinta
              em casa enquanto você estiver ausente.
            </Text>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onPress={() => router.push('/quem-somos')}
              style={styles.missaoBtn}
            >
              Conhecer a Equipe
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
    position: 'relative',
    overflow: 'hidden',
  },
  heroPaw: { position: 'absolute', top: 16, right: 16 },
  heroTitle: {
    fontSize: FontSizes['3xl'],
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  heroSubtitle: {
    fontSize: FontSizes.base,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: Spacing[6],
  },
  heroBtn: { backgroundColor: Colors.orange, maxWidth: 280 },

  section: {
    padding: Spacing[4],
    paddingVertical: Spacing[5],
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.gray[900],
    marginBottom: Spacing[4],
  },

  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureCard: { width: '47.5%' },
  featureContent: { alignItems: 'center', padding: Spacing[3] },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[2],
  },
  featureLabel: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray[900], marginBottom: 2 },
  featureDesc: { fontSize: FontSizes.xs, color: Colors.gray[500], textAlign: 'center' },

  planos: { gap: 10 },
  planoCard: { borderLeftWidth: 4 },
  planoContent: { padding: Spacing[4] },
  planoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing[2] },
  planoNome: { fontSize: FontSizes.lg, fontWeight: '700' },
  planoPreco: { fontSize: FontSizes['2xl'], fontWeight: '800', color: Colors.gray[900] },
  planoItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  planoDot: { width: 6, height: 6, borderRadius: 3 },
  planoItemText: { fontSize: FontSizes.sm, color: Colors.gray[700] },

  missaoCard: { borderWidth: 2, backgroundColor: Colors.beige },
  missaoTitle: { fontSize: FontSizes.lg, fontWeight: '700', marginBottom: Spacing[2] },
  missaoText: { fontSize: FontSizes.sm, color: Colors.gray[700], marginBottom: Spacing[4], lineHeight: 20 },
  missaoBtn: { borderColor: Colors.teal },
});
