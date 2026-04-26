import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
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

type Plano = {
  nome: string;
  preco: string;
  descricao: string;
  items: string[];
  detalhes: string[];
  cor: string;
  icon: string;
};

const PLANOS: Plano[] = [
  {
    nome: 'Standard',
    preco: 'R$ 80/dia',
    descricao: 'Cuidado essencial com carinho e atenção para o seu pet.',
    items: ['3 passeios diários', 'Alimentação balanceada'],
    detalhes: [
      '3 passeios diários de 20 min cada',
      'Alimentação balanceada inclusa',
      'Área coletiva de descanso',
      'Monitoramento durante o dia',
      'Atendimento veterinário de emergência',
      'Relatório diário por mensagem',
    ],
    cor: Colors.teal,
    icon: 'star-outline',
  },
  {
    nome: 'Premium',
    preco: 'R$ 150/dia',
    descricao: 'Experiência superior com espaço exclusivo e mais atenção individual.',
    items: ['Suíte individual + 5 passeios', 'Fotos diárias do pet'],
    detalhes: [
      'Suíte individual climatizada',
      '5 passeios diários de 30 min cada',
      'Alimentação premium personalizada',
      'Fotos diárias enviadas ao tutor',
      'Banho e tosa uma vez por semana',
      'Monitoramento 24h por câmera',
      'Atendimento veterinário incluído',
    ],
    cor: Colors.orange,
    icon: 'star-half-outline',
  },
  {
    nome: 'Luxo',
    preco: 'R$ 250/dia',
    descricao: 'O máximo em conforto e exclusividade para pets especiais.',
    items: ['Suíte VIP + Spa inclusos', 'Vídeos ao vivo 24h'],
    detalhes: [
      'Suíte VIP com cama ortopédica',
      'Passeios ilimitados com cuidador exclusivo',
      'Cardápio gourmet personalizado',
      'Sessão de spa e massagem diária',
      'Vídeos ao vivo 24h para o tutor',
      'Transporte de ida e volta incluso',
      'Consulta veterinária semanal',
      'Brinquedos e atividades interativas',
    ],
    cor: Colors.tealDark,
    icon: 'star',
  },
];

export default function Home() {
  const router = useRouter();
  const { usuarioLogado } = useApp();
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null);

  if (usuarioLogado?.isAdmin) {
    router.replace('/(tabs)/admin');
    return null;
  }

  return (
    <>
    <Modal
      visible={!!planoSelecionado}
      transparent
      animationType="slide"
      onRequestClose={() => setPlanoSelecionado(null)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setPlanoSelecionado(null)}>
        <Pressable style={styles.modalContainer} onPress={() => {}}>
          {planoSelecionado && (
            <>
              <View style={[styles.modalHeader, { backgroundColor: planoSelecionado.cor }]}>
                <Ionicons name={planoSelecionado.icon as any} size={32} color={Colors.white} />
                <View style={{ flex: 1, marginLeft: Spacing[3] }}>
                  <Text style={styles.modalNome}>{planoSelecionado.nome}</Text>
                  <Text style={styles.modalPreco}>{planoSelecionado.preco}</Text>
                </View>
                <TouchableOpacity onPress={() => setPlanoSelecionado(null)}>
                  <Ionicons name="close" size={24} color={Colors.white} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalDesc}>{planoSelecionado.descricao}</Text>
                <Text style={[styles.modalSecTitle, { color: planoSelecionado.cor }]}>O que está incluído</Text>
                {planoSelecionado.detalhes.map((item) => (
                  <View key={item} style={styles.modalItem}>
                    <Ionicons name="checkmark-circle" size={18} color={planoSelecionado.cor} />
                    <Text style={styles.modalItemText}>{item}</Text>
                  </View>
                ))}
                <Button
                  size="lg"
                  fullWidth
                  onPress={() => { setPlanoSelecionado(null); router.push('/hotel'); }}
                  style={[styles.modalBtn, { backgroundColor: planoSelecionado.cor }]}
                  textStyle={{ color: Colors.white }}
                >
                  Reservar este Plano
                </Button>
              </ScrollView>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
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
            <TouchableOpacity key={p.nome} onPress={() => setPlanoSelecionado(p)} activeOpacity={0.8}>
              <Card style={[styles.planoCard, { borderLeftColor: p.cor }]}>
                <CardContent style={styles.planoContent}>
                  <View style={styles.planoHeader}>
                    <View>
                      <Text style={[styles.planoNome, { color: p.cor }]}>{p.nome}</Text>
                      <Text style={styles.planoPreco}>{p.preco}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={p.cor} />
                  </View>
                  {p.items.map((item) => (
                    <View key={item} style={styles.planoItem}>
                      <View style={[styles.planoDot, { backgroundColor: p.cor }]} />
                      <Text style={styles.planoItemText}>{item}</Text>
                    </View>
                  ))}
                </CardContent>
              </Card>
            </TouchableOpacity>
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
    </>
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[5],
  },
  modalNome: {
    fontSize: FontSizes['2xl'],
    fontWeight: '800',
    color: Colors.white,
  },
  modalPreco: {
    fontSize: FontSizes.base,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  modalBody: {
    padding: Spacing[5],
  },
  modalDesc: {
    fontSize: FontSizes.base,
    color: Colors.gray[600],
    lineHeight: 22,
    marginBottom: Spacing[4],
  },
  modalSecTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing[3],
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[2],
  },
  modalItemText: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
    flex: 1,
  },
  modalBtn: {
    marginTop: Spacing[5],
    marginBottom: Spacing[6],
  },
});
