import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardHeader, CardTitle, CardContent } from '../src/components/ui/Card';
import { Badge } from '../src/components/ui/Badge';
import { useApp } from '../src/context/AppContext';
import { Colors, FontSizes, Spacing, BorderRadius } from '../src/constants/theme';

type Tab = 'usuarios' | 'pets' | 'reservas';

const fmt = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '';

export default function Admin() {
  const { usuarioLogado, usuarios, pets, reservas } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('usuarios');

  useEffect(() => {
    if (!usuarioLogado?.isAdmin) {
      router.replace('/');
    }
  }, [usuarioLogado]);

  if (!usuarioLogado?.isAdmin) return null;

  const reservasAtivas = reservas.filter(r => r.status === 'Ativa');
  const reservasCanceladas = reservas.filter(r => r.status === 'Cancelada');
  const reservasFinalizadas = reservas.filter(r => r.status === 'Finalizada');
  const receitaTotal = reservas
    .filter(r => r.status !== 'Cancelada')
    .reduce((s, r) => s + r.valorTotal, 0);

  const getPetNome = (id: string) => pets.find(p => p.id === id)?.nome ?? '—';
  const getUsuarioNome = (id: string) => usuarios.find(u => u.id === id)?.nome ?? '—';

  const STATS = [
    { label: 'Usuários', value: usuarios.length, icon: 'people', color: Colors.blue },
    { label: 'Pets', value: pets.length, icon: 'paw', color: '#8B5CF6' },
    { label: 'Ativas', value: reservasAtivas.length, icon: 'calendar', color: Colors.green },
    { label: 'Receita', value: `R$${receitaTotal.toFixed(0)}`, icon: 'cash', color: Colors.orange },
  ] as const;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Stats */}
        <View style={styles.statsGrid}>
          {STATS.map(s => (
            <Card key={s.label} style={styles.statCard}>
              <CardContent style={styles.statContent}>
                <Ionicons name={s.icon as any} size={24} color={s.color} style={styles.statIcon} />
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['usuarios', 'pets', 'reservas'] as Tab[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Usuários */}
        {tab === 'usuarios' && (
          <Card>
            <CardHeader><CardTitle>Usuários Cadastrados</CardTitle></CardHeader>
            <CardContent>
              {usuarios.map(u => (
                <View key={u.id} style={styles.row}>
                  <View style={styles.rowIcon}>
                    <Ionicons name="person" size={18} color={Colors.teal} />
                  </View>
                  <View style={styles.rowContent}>
                    <View style={styles.rowHeader}>
                      <Text style={styles.rowTitle}>{u.nome}</Text>
                      <Badge variant={u.isAdmin ? 'default' : 'secondary'}>
                        {u.isAdmin ? 'Admin' : 'Cliente'}
                      </Badge>
                    </View>
                    <Text style={styles.rowSub}>{u.email}</Text>
                    <Text style={styles.rowSub}>{u.telefone} · {u.cpf}</Text>
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Pets */}
        {tab === 'pets' && (
          <Card>
            <CardHeader><CardTitle>Pets Cadastrados</CardTitle></CardHeader>
            <CardContent>
              {pets.length === 0 ? (
                <Text style={styles.empty}>Nenhum pet cadastrado.</Text>
              ) : pets.map(p => (
                <View key={p.id} style={styles.row}>
                  <View style={styles.rowIcon}>
                    <Ionicons name="paw" size={18} color={Colors.teal} />
                  </View>
                  <View style={styles.rowContent}>
                    <View style={styles.rowHeader}>
                      <Text style={styles.rowTitle}>{p.nome}</Text>
                      <Badge variant="secondary">{p.especie}</Badge>
                    </View>
                    <Text style={styles.rowSub}>{p.raca} · {p.porte} · {p.sexo}</Text>
                    <Text style={styles.rowSub}>Tutor: {getUsuarioNome(p.usuarioId)}</Text>
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Reservas */}
        {tab === 'reservas' && (
          <View style={styles.reservasSection}>
            {/* Summary */}
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, { borderColor: Colors.green }]}>
                <Text style={[styles.summaryNum, { color: Colors.green }]}>{reservasAtivas.length}</Text>
                <Text style={styles.summaryLabel}>Ativas</Text>
              </View>
              <View style={[styles.summaryCard, { borderColor: Colors.red }]}>
                <Text style={[styles.summaryNum, { color: Colors.red }]}>{reservasCanceladas.length}</Text>
                <Text style={styles.summaryLabel}>Canceladas</Text>
              </View>
              <View style={[styles.summaryCard, { borderColor: Colors.gray[400] }]}>
                <Text style={[styles.summaryNum, { color: Colors.gray[600] }]}>{reservasFinalizadas.length}</Text>
                <Text style={styles.summaryLabel}>Finalizadas</Text>
              </View>
            </View>

            <Card>
              <CardHeader><CardTitle>Todas as Reservas</CardTitle></CardHeader>
              <CardContent>
                {reservas.length === 0 ? (
                  <Text style={styles.empty}>Nenhuma reserva cadastrada.</Text>
                ) : reservas.map(r => (
                  <View key={r.id} style={styles.row}>
                    <View style={styles.rowIcon}>
                      <Ionicons name="calendar" size={18} color={Colors.teal} />
                    </View>
                    <View style={styles.rowContent}>
                      <View style={styles.rowHeader}>
                        <Text style={styles.rowTitle}>{getPetNome(r.petId)}</Text>
                        <Badge
                          variant={
                            r.status === 'Ativa' ? 'default'
                            : r.status === 'Cancelada' ? 'destructive'
                            : 'secondary'
                          }
                        >
                          {r.status}
                        </Badge>
                      </View>
                      <Text style={styles.rowSub}>
                        {fmt(r.dataEntrada)} → {fmt(r.dataSaidaPrevista)}
                      </Text>
                      <Text style={styles.rowSub}>
                        {r.tipoAcomodacao} · R$ {r.valorTotal.toFixed(2)} · {getUsuarioNome(r.usuarioId)}
                      </Text>
                    </View>
                  </View>
                ))}
              </CardContent>
            </Card>
          </View>
        )}
      </View>
      <View style={{ height: Spacing[8] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.beige },
  content: { padding: Spacing[4], gap: Spacing[4] },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47.5%' },
  statContent: { alignItems: 'center', padding: Spacing[4] },
  statIcon: { marginBottom: 8, opacity: 0.8 },
  statValue: { fontSize: FontSizes['2xl'], fontWeight: '800', color: Colors.gray[900] },
  statLabel: { fontSize: FontSizes.xs, color: Colors.gray[500], marginTop: 2 },

  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing[2],
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  tabActive: { backgroundColor: Colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  tabText: { fontSize: FontSizes.sm, fontWeight: '500', color: Colors.gray[500] },
  tabTextActive: { color: Colors.teal, fontWeight: '700' },

  row: {
    flexDirection: 'row',
    gap: Spacing[3],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[50],
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  rowContent: { flex: 1 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  rowTitle: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray[900], flex: 1, marginRight: 8 },
  rowSub: { fontSize: FontSizes.xs, color: Colors.gray[500], marginTop: 1 },

  empty: { fontSize: FontSizes.sm, color: Colors.gray[400], textAlign: 'center', paddingVertical: Spacing[4] },

  reservasSection: { gap: Spacing[3] },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    padding: Spacing[3],
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryNum: { fontSize: FontSizes['2xl'], fontWeight: '800' },
  summaryLabel: { fontSize: FontSizes.xs, color: Colors.gray[500], marginTop: 2 },
});
