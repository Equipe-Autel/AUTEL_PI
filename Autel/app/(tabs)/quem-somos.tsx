import React, { useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '../../src/components/ui/Card';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../src/constants/theme';

const EQUIPE = [
  { nome: 'Amanda Dahm', cargo: 'Veterinária', especialidade: 'Medicina Veterinária', icon: 'medical' },
  { nome: 'Caroline Lopes', cargo: 'Especialista em Comportamento', especialidade: 'Adestramento', icon: 'heart' },
  { nome: 'Ian Melo', cargo: 'Cuidador Senior', especialidade: 'Cuidados e Nutrição', icon: 'nutrition' },
  { nome: 'Antônio Lucas', cargo: 'Coordenador de Atividades', especialidade: 'Recreação', icon: 'football' },
];

const VALORES = [
  { icon: 'heart', color: Colors.red, titulo: 'Amor pelos Animais', desc: 'Cada membro da nossa equipe é apaixonado por animais. Para nós, é uma vocação.' },
  { icon: 'shield-checkmark', color: Colors.teal, titulo: 'Excelência Profissional', desc: 'Todos os cuidadores possuem formação especializada em bem-estar e medicina animal.' },
  { icon: 'people', color: Colors.orange, titulo: 'Família & Comunidade', desc: 'Tratamos cada pet como parte da família. Seu bichinho merece o melhor.' },
];

export default function QuemSomos() {
  const scrollRef = useRef<ScrollView>(null);
  const [heroHeight, setHeroHeight] = React.useState(0);

  return (
    <ScrollView ref={scrollRef} style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero} onLayout={(e) => setHeroHeight(e.nativeEvent.layout.height)}>
        <Text style={styles.heroTitle}>Nossa Equipe</Text>
        <Text style={styles.heroSubtitle}>
          Profissionais dedicados e apaixonados por animais
        </Text>
        <TouchableOpacity
          style={styles.scrollDownBtn}
          onPress={() => scrollRef.current?.scrollTo({ y: heroHeight, animated: true })}
        >
          <Ionicons name="chevron-down" size={28} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>
      </View>

      {/* História */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nossa História</Text>
        <Text style={styles.text}>
          O Autel nasceu em 2015 do sonho de oferecer um espaço onde pets pudessem ser tratados
          não apenas com profissionalismo, mas principalmente com amor e dedicação. Nosso hotel começou
          como um pequeno espaço com capacidade para apenas 5 pets.
        </Text>
        <Text style={[styles.text, { marginTop: Spacing[3] }]}>
          Hoje, somos uma equipe multidisciplinar de profissionais qualificados, cada um trazendo
          sua expertise única para garantir que cada pet receba o melhor cuidado possível.
        </Text>
      </View>

      {/* Valores */}
      <View style={[styles.section, { backgroundColor: Colors.white }]}>
        <Text style={styles.sectionTitle}>Nossos Valores</Text>
        <View style={styles.valoresGap}>
          {VALORES.map(v => (
            <Card key={v.titulo} style={styles.valorCard}>
              <CardContent style={styles.valorContent}>
                <View style={[styles.valorIcon, { backgroundColor: `${v.color}18` }]}>
                  <Ionicons name={v.icon as any} size={24} color={v.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.valorTitle}>{v.titulo}</Text>
                  <Text style={styles.valorDesc}>{v.desc}</Text>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>

      {/* Equipe */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>A Equipe</Text>
        <View style={styles.equipeGrid}>
          {EQUIPE.map(e => (
            <Card key={e.nome} style={styles.equipeCard}>
              <CardContent style={styles.equipeContent}>
                <View style={styles.equipeAvatar}>
                  <Ionicons name={e.icon as any} size={28} color={Colors.teal} />
                </View>
                <Text style={styles.equipeNome}>{e.nome}</Text>
                <Text style={styles.equipeCargo}>{e.cargo}</Text>
                <View style={styles.equipeTag}>
                  <Text style={styles.equipeTagText}>{e.especialidade}</Text>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
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
  },
  scrollDownBtn: {
    marginTop: Spacing[4],
    padding: Spacing[2],
  },

  section: { padding: Spacing[4], paddingVertical: Spacing[5] },
  sectionTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.gray[900], marginBottom: Spacing[4] },
  text: { fontSize: FontSizes.sm, color: Colors.gray[700], lineHeight: 22 },

  valoresGap: { gap: 10 },
  valorCard: {},
  valorContent: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[3], padding: Spacing[4] },
  valorIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  valorTitle: { fontSize: FontSizes.base, fontWeight: '700', color: Colors.gray[900], marginBottom: 4 },
  valorDesc: { fontSize: FontSizes.sm, color: Colors.gray[600], lineHeight: 20 },

  equipeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  equipeCard: { width: '47.5%' },
  equipeContent: { alignItems: 'center', padding: Spacing[4] },
  equipeAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
  },
  equipeNome: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.gray[900], textAlign: 'center' },
  equipeCargo: { fontSize: FontSizes.xs, color: Colors.gray[500], textAlign: 'center', marginTop: 2, marginBottom: Spacing[2] },
  equipeTag: {
    backgroundColor: Colors.tealLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  equipeTagText: { fontSize: FontSizes.xs, color: Colors.teal, fontWeight: '600' },
});
