import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Badge } from '../../src/components/ui/Badge';
import { useApp } from '../../src/context/AppContext';
import { Pet } from '../../src/types';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../src/constants/theme';

export default function MeusPets() {
  const { usuarioLogado, pets, removerPet } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!usuarioLogado) {
      router.replace('/login');
    }
  }, [usuarioLogado]);

  if (!usuarioLogado) return null;

  const meusPets = pets.filter(p => p.usuarioId === usuarioLogado.id);

  const handleRemover = (pet: Pet) => {
    Alert.alert('Remover pet', `Deseja remover ${pet.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removerPet(pet.id) },
    ]);
  };

  if (meusPets.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="paw-outline" size={64} color={Colors.gray[300]} />
        <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
        <Text style={styles.emptyDesc}>Cadastre seu primeiro pet!</Text>
        <Button onPress={() => router.push('/cadastro-pet')} style={{ marginTop: Spacing[4] }}>
          Cadastrar Pet
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Meus Pets</Text>
          <Button size="sm" onPress={() => router.push('/cadastro-pet')}>+ Adicionar</Button>
        </View>
        {meusPets.map(p => (
          <Card key={p.id} style={styles.petCard}>
            <CardContent style={styles.petCardContent}>
              <View style={styles.petAvatar}>
                <Ionicons name={p.especie === 'Gato' ? 'paw-outline' : 'paw'} size={28} color={Colors.teal} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.petCardHeader}>
                  <Text style={styles.petNome}>{p.nome}</Text>
                  <View style={styles.badgeRow}>
                    <Badge variant="secondary">{p.especie}</Badge>
                    <Badge variant={p.comportamento === 'Calmo' ? 'success' : p.comportamento === 'Agitado' ? 'warning' : 'destructive'}>
                      {p.comportamento}
                    </Badge>
                  </View>
                </View>
                <Text style={styles.petInfo}>{p.raca} · {p.porte} · {p.sexo}</Text>
                <Text style={styles.petInfo}>{p.idade < 1 ? 'Filhote' : `${p.idade} ${p.idade === 1 ? 'ano' : 'anos'}`} · {p.peso} kg · {p.castrado ? 'Castrado' : 'Não castrado'}</Text>
                {p.observacoesSaude ? (
                  <Text style={styles.petObs}>{p.observacoesSaude}</Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => handleRemover(p)} style={styles.deleteBtn}>
                <Ionicons name="close-circle" size={22} color={Colors.red} />
              </TouchableOpacity>
            </CardContent>
          </Card>
        ))}
      </View>
      <View style={{ height: Spacing[8] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.beige },
  content: { padding: Spacing[4], gap: 10 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing[6] },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.gray[700], marginTop: Spacing[4] },
  emptyDesc: { fontSize: FontSizes.sm, color: Colors.gray[500], marginTop: Spacing[2] },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing[2] },
  sectionTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.gray[900] },

  petCard: { marginBottom: 0 },
  petCardContent: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[3], padding: Spacing[4] },
  petAvatar: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  petCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  petNome: { fontSize: FontSizes.base, fontWeight: '700', color: Colors.gray[900], flex: 1, marginRight: 8 },
  petInfo: { fontSize: FontSizes.xs, color: Colors.gray[500], marginTop: 2 },
  petObs: { fontSize: FontSizes.xs, color: Colors.gray[400], marginTop: 4, fontStyle: 'italic' },
  deleteBtn: { paddingLeft: Spacing[2], justifyContent: 'center' },
  badgeRow: { flexDirection: 'row', gap: 4 },
});
