import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardHeader, CardTitle, CardContent } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useApp } from '../../src/context/AppContext';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../src/constants/theme';
import { Plano } from '../../src/types';

type Tab = 'usuarios' | 'pets' | 'reservas' | 'planos';

const fmt = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '';

export default function AdminTab() {
  const { usuarioLogado, usuarios, pets, reservas, planos, vagasTotais, removerUsuario, removerPet, removerReserva, adicionarPlano, atualizarPlano, removerPlano, atualizarVagasTotais } = useApp();
  const [tab, setTab] = useState<Tab>('usuarios');

  // estados da aba de planos
  const [editandoPlano, setEditandoPlano] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPreco, setEditPreco] = useState('');
  const [novoPlanoAberto, setNovoPlanoAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoDesc, setNovoDesc] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [vagasInput, setVagasInput] = useState(String(vagasTotais));

  const abrirEdicao = (p: Plano) => {
    setEditandoPlano(p.id);
    setEditNome(p.nome);
    setEditDesc(p.descricao);
    setEditPreco(String(p.preco));
  };

  const salvarEdicao = () => {
    if (!editandoPlano) return;
    const preco = parseFloat(editPreco);
    if (!editNome || isNaN(preco) || preco <= 0) return;
    atualizarPlano(editandoPlano, { nome: editNome, descricao: editDesc, preco });
    setEditandoPlano(null);
  };

  const salvarNovoPlano = () => {
    const preco = parseFloat(novoPreco);
    if (!novoNome || isNaN(preco) || preco <= 0) return;
    adicionarPlano({ nome: novoNome, descricao: novoDesc, preco });
    setNovoNome(''); setNovoDesc(''); setNovoPreco('');
    setNovoPlanoAberto(false);
  };

  const salvarVagas = () => {
    const v = parseInt(vagasInput);
    if (!isNaN(v) && v > 0) atualizarVagasTotais(v);
  };

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
    { label: 'Canceladas', value: reservasCanceladas.length, icon: 'close-circle', color: Colors.red },
    { label: 'Planos', value: planos.length, icon: 'bed-outline', color: Colors.teal },
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
          {(['usuarios', 'pets', 'reservas', 'planos'] as Tab[]).map(t => (
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
                  {!u.isAdmin && (
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() =>
                        Alert.alert('Remover usuário', `Deseja remover ${u.nome}?`, [
                          { text: 'Cancelar', style: 'cancel' },
                          { text: 'Remover', style: 'destructive', onPress: () => removerUsuario(u.id) },
                        ])
                      }
                    >
                      <Ionicons name="close-circle" size={22} color={Colors.red} />
                    </TouchableOpacity>
                  )}
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
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() =>
                      Alert.alert('Remover pet', `Deseja remover ${p.nome}?`, [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Remover', style: 'destructive', onPress: () => removerPet(p.id) },
                      ])
                    }
                  >
                    <Ionicons name="close-circle" size={22} color={Colors.red} />
                  </TouchableOpacity>
                </View>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Reservas */}
        {tab === 'reservas' && (
          <View style={styles.reservasSection}>
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
                      <View style={styles.tutorRow}>
                        <Ionicons name="person-circle-outline" size={13} color={Colors.teal} />
                        <Text style={styles.tutorText}>{getUsuarioNome(r.usuarioId)}</Text>
                      </View>
                      <Text style={styles.rowSub}>
                        {fmt(r.dataEntrada)} → {fmt(r.dataSaidaPrevista)}
                      </Text>
                      <Text style={styles.rowSub}>
                        {r.tipoAcomodacao} · R$ {r.valorTotal.toFixed(2)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() =>
                        Alert.alert('Remover reserva', `Deseja remover a reserva de ${getPetNome(r.petId)}?`, [
                          { text: 'Cancelar', style: 'cancel' },
                          { text: 'Remover', style: 'destructive', onPress: () => removerReserva(r.id) },
                        ])
                      }
                    >
                      <Ionicons name="close-circle" size={22} color={Colors.red} />
                    </TouchableOpacity>
                  </View>
                ))}
              </CardContent>
            </Card>
          </View>
        )}
        {/* Planos */}
        {tab === 'planos' && (
          <View style={styles.reservasSection}>

            {/* Vagas totais */}
            <Card>
              <CardHeader><CardTitle>Capacidade do Hotel</CardTitle></CardHeader>
              <CardContent>
                <Text style={styles.rowSub}>Total de vagas simultâneas disponíveis</Text>
                <View style={styles.vagasRow}>
                  <TextInput
                    style={styles.vagasInput}
                    value={vagasInput}
                    onChangeText={setVagasInput}
                    keyboardType="number-pad"
                  />
                  <TouchableOpacity style={styles.vagasBtn} onPress={salvarVagas}>
                    <Ionicons name="checkmark" size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.vagasAtual}>Atual: {vagasTotais} vagas</Text>
              </CardContent>
            </Card>

            {/* Lista de planos */}
            <Card>
              <CardHeader>
                <View style={styles.planosTitleRow}>
                  <CardTitle>Planos de Hospedagem</CardTitle>
                  <TouchableOpacity onPress={() => setNovoPlanoAberto(v => !v)} style={styles.addBtn}>
                    <Ionicons name={novoPlanoAberto ? 'close' : 'add'} size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </CardHeader>

              {/* Formulário novo plano */}
              {novoPlanoAberto && (
                <CardContent style={styles.novoPlanoForm}>
                  <Text style={styles.novoPlanoTitle}>Novo Plano</Text>
                  <Input label="Nome *" value={novoNome} onChangeText={setNovoNome} placeholder="Ex: Executivo" />
                  <Input label="Descrição" value={novoDesc} onChangeText={setNovoDesc} placeholder="Breve descrição" />
                  <Input label="Preço por diária (R$) *" value={novoPreco} onChangeText={setNovoPreco} keyboardType="decimal-pad" placeholder="0.00" />
                  <Button fullWidth onPress={salvarNovoPlano} style={{ marginTop: Spacing[2] }}>Adicionar Plano</Button>
                </CardContent>
              )}

              <CardContent>
                {planos.length === 0 ? (
                  <Text style={styles.empty}>Nenhum plano cadastrado.</Text>
                ) : planos.map(p => (
                  <View key={p.id}>
                    {editandoPlano === p.id ? (
                      <View style={styles.editForm}>
                        <Input label="Nome *" value={editNome} onChangeText={setEditNome} placeholder="Nome do plano" />
                        <Input label="Descrição" value={editDesc} onChangeText={setEditDesc} placeholder="Descrição" />
                        <Input label="Preço/diária (R$) *" value={editPreco} onChangeText={setEditPreco} keyboardType="decimal-pad" placeholder="0.00" />
                        <View style={styles.editBtns}>
                          <TouchableOpacity style={styles.cancelEditBtn} onPress={() => setEditandoPlano(null)}>
                            <Text style={styles.cancelEditText}>Cancelar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.saveBtn} onPress={salvarEdicao}>
                            <Text style={styles.saveBtnText}>Salvar</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.row}>
                        <View style={styles.rowIcon}>
                          <Ionicons name="bed-outline" size={18} color={Colors.teal} />
                        </View>
                        <View style={styles.rowContent}>
                          <View style={styles.rowHeader}>
                            <Text style={styles.rowTitle}>{p.nome}</Text>
                            <Text style={styles.planoPreco}>R$ {p.preco.toFixed(2)}/dia</Text>
                          </View>
                          <Text style={styles.rowSub}>{p.descricao}</Text>
                        </View>
                        <View style={styles.planoAcoes}>
                          <TouchableOpacity onPress={() => abrirEdicao(p)}>
                            <Ionicons name="create-outline" size={20} color={Colors.teal} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              Alert.alert('Remover plano', `Deseja remover o plano "${p.nome}"?`, [
                                { text: 'Cancelar', style: 'cancel' },
                                { text: 'Remover', style: 'destructive', onPress: () => removerPlano(p.id) },
                              ])
                            }
                          >
                            <Ionicons name="close-circle" size={20} color={Colors.red} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
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

  tutorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  tutorText: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.teal },

  empty: { fontSize: FontSizes.sm, color: Colors.gray[400], textAlign: 'center', paddingVertical: Spacing[4] },
  deleteBtn: { justifyContent: 'center', paddingLeft: Spacing[2] },

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

  // planos
  planosTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addBtn: { backgroundColor: Colors.teal, borderRadius: BorderRadius.full, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  planoPreco: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.teal },
  planoAcoes: { flexDirection: 'column', gap: Spacing[2], justifyContent: 'center', paddingLeft: Spacing[2] },

  novoPlanoForm: { backgroundColor: '#F0FDFA', borderRadius: BorderRadius.lg, margin: Spacing[2] },
  novoPlanoTitle: { fontSize: FontSizes.base, fontWeight: '700', color: Colors.teal, marginBottom: Spacing[3] },

  editForm: { paddingVertical: Spacing[3], borderBottomWidth: 1, borderBottomColor: Colors.gray[100] },
  editBtns: { flexDirection: 'row', gap: 10, marginTop: Spacing[2] },
  cancelEditBtn: { flex: 1, paddingVertical: Spacing[2], alignItems: 'center', borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.gray[300] },
  cancelEditText: { fontSize: FontSizes.sm, color: Colors.gray[600], fontWeight: '600' },
  saveBtn: { flex: 1, paddingVertical: Spacing[2], alignItems: 'center', borderRadius: BorderRadius.md, backgroundColor: Colors.teal },
  saveBtnText: { fontSize: FontSizes.sm, color: Colors.white, fontWeight: '700' },

  vagasRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: Spacing[3] },
  vagasInput: { flex: 1, borderWidth: 1.5, borderColor: Colors.gray[200], borderRadius: BorderRadius.md, padding: Spacing[3], fontSize: FontSizes.lg, fontWeight: '700', color: Colors.gray[900], backgroundColor: Colors.white },
  vagasBtn: { backgroundColor: Colors.teal, borderRadius: BorderRadius.md, padding: Spacing[3] },
  vagasAtual: { fontSize: FontSizes.xs, color: Colors.gray[400], marginTop: Spacing[2] },
});
