import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// UI Componentes
import { Card, CardHeader, CardTitle, CardContent } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Badge } from '../../src/components/ui/Badge';
import { Select } from '../../src/components/ui/Select';
import { DatePicker } from '../../src/components/ui/DatePicker';

// Context
import { useApp } from '../../src/context/AppContext';
import { useToast } from '../../src/components/ui/Toast';
import { Reserva } from '../../src/types';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../src/constants/theme';

// mapeamento de estilo para reserva
const STATUS_VARIANT: Record<string, any> = {
  Ativa: 'default',
  Cancelada: 'destructive',
  Finalizada: 'secondary',
};

const ACOMODACOES = [
  { label: 'Standard — R$ 80/dia', value: 'Standard' },
  { label: 'Premium — R$ 150/dia', value: 'Premium' },
  { label: 'Luxo — R$ 250/dia', value: 'Luxo' },
];

// iso para br
const fmt = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '';

export default function MinhasReservas() {
  const { usuarioLogado, reservas, pets, cancelarReserva, atualizarReserva, calcularValorHospedagem } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  // estados para controle de Modais e Edição
  const [cancelModal, setCancelModal] = useState<Reserva | null>(null);
  const [editModal, setEditModal] = useState<Reserva | null>(null);
  const [editDataSaida, setEditDataSaida] = useState('');
  const [editAcomodacao, setEditAcomodacao] = useState<'Standard' | 'Premium' | 'Luxo'>('Standard');

  // proteção de rota: Redireciona se o usuário deslogar
  useEffect(() => {
    if (!usuarioLogado) {
      router.replace('/login');
    }
  }, [usuarioLogado]);

  if (!usuarioLogado) return null;

  // separação de reservas para melhor organização na tela
  const minhasReservas = reservas.filter(r => r.usuarioId === usuarioLogado.id);
  const ativas = minhasReservas.filter(r => r.status === 'Ativa');
  const historico = minhasReservas.filter(r => r.status !== 'Ativa');

  const getPet = (petId: string) => pets.find(p => p.id === petId);
  const getPetNome = (petId: string) => getPet(petId)?.nome ?? 'Pet';

  // calculo de multa
  const diasRestantes = (dataEntrada: string) =>
    Math.ceil((new Date(dataEntrada).getTime() - Date.now()) / 86400000);

  const handleCancelar = () => {
    if (!cancelModal) return;
    const { sucesso, multa } = cancelarReserva(cancelModal.id);
    
    if (sucesso) {
      multa > 0
        ? toast.warning(`Cancelada. Multa de R$ ${multa.toFixed(2)} aplicada.`)
        : toast.success('Reserva cancelada com sucesso!');
    } else {
      toast.error('Não foi possível cancelar a reserva.');
    }
    setCancelModal(null);
  };

  const openEdit = (r: Reserva) => {
    setEditModal(r);
    setEditDataSaida(r.dataSaidaPrevista);
    setEditAcomodacao(r.tipoAcomodacao);
  };

  const handleEditar = () => {
    if (!editModal || !editDataSaida) return;
    const novoValor = calcularValorHospedagem(editModal.dataEntrada, editDataSaida, editAcomodacao);
    
    atualizarReserva(editModal.id, {
      dataSaidaPrevista: editDataSaida,
      tipoAcomodacao: editAcomodacao,
      valorTotal: novoValor,
    });
    
    toast.success('Alterações salvas!');
    setEditModal(null);
  };

  const getCancelInfo = (r: Reserva) => {
    const d = diasRestantes(r.dataEntrada);
    const temMulta = d >= 0 && d < 7;
    return { temMulta, multa: temMulta ? r.valorTotal * 0.3 : 0, dias: d };
  };

  // tela vazia
  if (minhasReservas.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="calendar-clear-outline" size={48} color={Colors.gray[300]} />
        </View>
        <Text style={styles.emptyTitle}>Nenhuma reserva por aqui</Text>
        <Text style={styles.emptyDesc}>Seu histórico de hospedagens aparecerá aqui assim que você fizer sua primeira reserva.</Text>
        <Button onPress={() => router.push('/hotel')} style={{ marginTop: Spacing[4] }}>
          Explorar Hotéis
        </Button>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* reservas ativas */}
          {ativas.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reservas Ativas</Text>
              {ativas.map(r => {
                const pet = getPet(r.petId);
                const dr = diasRestantes(r.dataEntrada);
                return (
                  <Card key={r.id} style={styles.reservaCard}>
                    <CardHeader style={styles.reservaHeader}>
                      <View style={styles.reservaHeaderRow}>
                        <View style={{ flex: 1 }}>
                          <CardTitle>🐾 {getPetNome(r.petId)}</CardTitle>
                          {pet && (
                            <Text style={styles.petInfo}>{pet.especie} • {pet.raca}</Text>
                          )}
                        </View>
                        <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>
                      </View>
                    </CardHeader>
                    
                    <CardContent>
                      <View style={styles.datesRow}>
                        <View>
                          <Text style={styles.dateLabel}>Check-in</Text>
                          <Text style={styles.dateValue}>{fmt(r.dataEntrada)}</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={16} color={Colors.teal} />
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={styles.dateLabel}>Check-out</Text>
                          <Text style={styles.dateValue}>{fmt(r.dataSaidaPrevista)}</Text>
                        </View>
                      </View>

                      {dr > 0 && (
                        <View style={styles.daysInfo}>
                          <Ionicons name="notifications-outline" size={14} color={Colors.blue} />
                          <Text style={styles.daysInfoText}>
                            Sua reserva começa em {dr} {dr === 1 ? 'dia' : 'dias'}!
                          </Text>
                        </View>
                      )}

                      <View style={styles.infoRow}>
                        <View>
                          <Text style={styles.infoLabel}>Acomodação</Text>
                          <Text style={styles.infoValue}>{r.tipoAcomodacao}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={styles.infoLabel}>Alimentação</Text>
                          <Text style={styles.infoValue}>{r.responsavelAlimentacao}</Text>
                        </View>
                      </View>

                      <View style={styles.valorRow}>
                        <Text style={styles.valorLabel}>Total da Hospedagem</Text>
                        <Text style={styles.valorText}>R$ {r.valorTotal.toFixed(2)}</Text>
                      </View>

                      <View style={styles.acoesBtns}>
                        <Button variant="outline" size="sm" onPress={() => openEdit(r)} style={{ flex: 1 }}>
                          <Ionicons name="create-outline" size={16} /> Editar
                        </Button>
                        <Button variant="destructive" size="sm" onPress={() => setCancelModal(r)} style={{ flex: 1 }}>
                          <Ionicons name="close-circle-outline" size={16} /> Cancelar
                        </Button>
                      </View>
                    </CardContent>
                  </Card>
                );
              })}
            </View>
          )}

          {/* SEÇÃO: HISTÓRICO */}
          {historico.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { marginTop: Spacing[4] }]}>Histórico</Text>
              {historico.map(r => (
                <Card key={r.id} style={{ ...styles.reservaCard, ...styles.historicoCard }}>
                  <CardHeader style={styles.reservaHeader}>
                    <View style={styles.reservaHeaderRow}>
                      <Text style={styles.historicoPetNome}>{getPetNome(r.petId)}</Text>
                      <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>
                    </View>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.datesRowSimple}>
                      <Text style={styles.dateValueSmall}>{fmt(r.dataEntrada)}</Text>
                      <Text style={styles.dateLabel}>até</Text>
                      <Text style={styles.dateValueSmall}>{fmt(r.dataSaidaPrevista)}</Text>
                      <View style={{ flex: 1 }} />
                      <Text style={styles.historicoValor}>R$ {r.valorTotal.toFixed(2)}</Text>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}
        </View>
        <View style={{ height: Spacing[8] }} />
      </ScrollView>

      {/* MODAL: CANCELAMENTO */}
      <Modal visible={!!cancelModal} transparent animationType="fade" onRequestClose={() => setCancelModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Confirmar Cancelamento</Text>
            <Text style={styles.modalDesc}>Deseja mesmo interromper esta reserva?</Text>

            {cancelModal && (() => {
              const { temMulta, multa } = getCancelInfo(cancelModal);
              return temMulta ? (
                <View style={styles.multaWarning}>
                  <Ionicons name="alert-circle" size={24} color="#92400E" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.multaTitle}>Política de Multa Ativa</Text>
                    <Text style={styles.multaDesc}>Cancelamentos com menos de 7 dias de antecedência geram multa de 30%.</Text>
                    <Text style={styles.multaValor}>Taxa de cancelamento: R$ {multa.toFixed(2)}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.semMulta}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.green} />
                  <Text style={{ color: '#15803D', fontSize: FontSizes.sm, flex: 1, fontWeight: '500' }}>
                    Cancelamento Gratuito liberado para este período!
                  </Text>
                </View>
              );
            })()}

            <View style={styles.modalBtns}>
              <Button variant="outline" onPress={() => setCancelModal(null)} style={{ flex: 1 }}>Manter Reserva</Button>
              <Button variant="destructive" onPress={handleCancelar} style={{ flex: 1 }}>Confirmar</Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* modal de edição*/}
      <Modal visible={!!editModal} transparent animationType="slide" onRequestClose={() => setEditModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Ajustar Estadia</Text>
            <Text style={styles.modalDesc}>Você pode alterar a data de saída e o tipo de quarto.</Text>

            <DatePicker
              label="Nova Data de Saída"
              value={editDataSaida}
              onChange={setEditDataSaida}
              minimumDate={editModal?.dataEntrada}
            />

            <Select
              label="Alterar Acomodação"
              options={ACOMODACOES}
              value={editAcomodacao}
              onChange={v => setEditAcomodacao(v as any)}
            />

            {editModal && editDataSaida && (
              <View style={styles.novoValor}>
                <View>
                  <Text style={styles.novoValorLabel}>Novo valor total:</Text>
                  <Text style={styles.novoValorPrice}>
                    R$ {calcularValorHospedagem(editModal.dataEntrada, editDataSaida, editAcomodacao).toFixed(2)}
                  </Text>
                </View>
                <Ionicons name="calculator-outline" size={24} color={Colors.blue} />
              </View>
            )}

            <View style={styles.modalBtns}>
              <Button variant="outline" onPress={() => setEditModal(null)} style={{ flex: 1 }}>Descartar</Button>
              <Button onPress={handleEditar} style={{ flex: 1 }}>Salvar Alterações</Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.beige },
  content: { padding: Spacing[4] },
  section: { marginBottom: Spacing[2] },
  
  // empty state
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing[8], backgroundColor: Colors.beige },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing[4] },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.gray[800], textAlign: 'center' },
  emptyDesc: { fontSize: FontSizes.base, color: Colors.gray[500], textAlign: 'center', marginTop: Spacing[2], lineHeight: 22 },

  // cards
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.gray[900], marginBottom: Spacing[4], letterSpacing: 0.5 },
  reservaCard: { marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  historicoCard: { opacity: 0.8, backgroundColor: '#F3F4F6' },
  reservaHeader: { paddingBottom: Spacing[3], borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  reservaHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petInfo: { fontSize: FontSizes.xs, color: Colors.gray[500], marginTop: 2, fontWeight: '500' },
  historicoPetNome: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray[600] },

  // card de detalhes
  datesRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0FDFA', borderRadius: BorderRadius.lg, padding: Spacing[3], marginVertical: Spacing[3] },
  datesRowSimple: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateLabel: { fontSize: 10, textTransform: 'uppercase', color: Colors.gray[400], fontWeight: '700' },
  dateValue: { fontSize: FontSizes.base, fontWeight: '700', color: Colors.gray[900] },
  dateValueSmall: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray[700] },

  daysInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.blueLight, borderRadius: BorderRadius.md, padding: Spacing[2], marginBottom: Spacing[3] },
  daysInfoText: { fontSize: FontSizes.xs, color: Colors.blue, fontWeight: '600' },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing[4] },
  infoLabel: { fontSize: 10, textTransform: 'uppercase', color: Colors.gray[400], fontWeight: '700', marginBottom: 2 },
  infoValue: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray[800] },

  valorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing[3], borderTopWidth: 1, borderTopColor: '#F3F4F6', marginBottom: Spacing[4] },
  valorLabel: { fontSize: FontSizes.sm, color: Colors.gray[600], fontWeight: '500' },
  valorText: { fontSize: FontSizes.xl, fontWeight: '900', color: Colors.teal },
  historicoValor: { fontSize: FontSizes.base, fontWeight: '700', color: Colors.gray[500] },

  acoesBtns: { flexDirection: 'row', gap: 12 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: Spacing[6], paddingBottom: Spacing[10], gap: Spacing[4] },
  modalTitle: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.gray[900] },
  modalDesc: { fontSize: FontSizes.sm, color: Colors.gray[500], marginBottom: Spacing[2] },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: Spacing[4] },

  multaWarning: { flexDirection: 'row', gap: 12, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FEF3C7', borderRadius: BorderRadius.lg, padding: Spacing[4] },
  multaTitle: { fontSize: FontSizes.sm, fontWeight: '800', color: '#92400E', marginBottom: 2 },
  multaDesc: { fontSize: FontSizes.xs, color: '#B45309', lineHeight: 16 },
  multaValor: { fontSize: FontSizes.base, fontWeight: '800', color: '#B45309', marginTop: 8 },

  semMulta: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#F0FDF4', borderRadius: BorderRadius.lg, padding: Spacing[4] },

  novoValor: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0F9FF', borderRadius: BorderRadius.lg, padding: Spacing[4], borderWidth: 1, borderColor: '#BAE6FD' },
  novoValorLabel: { fontSize: FontSizes.xs, color: Colors.blue, fontWeight: '700', textTransform: 'uppercase' },
  novoValorPrice: { fontSize: FontSizes.xl, fontWeight: '900', color: Colors.blue, marginTop: 2 },
});