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
import { Card, CardHeader, CardTitle, CardContent } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Badge } from '../../src/components/ui/Badge';
import { Select } from '../../src/components/ui/Select';
import { DatePicker } from '../../src/components/ui/DatePicker';
import { useApp } from '../../src/context/AppContext';
import { useToast } from '../../src/components/ui/Toast';
import { Reserva } from '../../src/types';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../src/constants/theme';

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

const fmt = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '';

export default function MinhasReservas() {
  const { usuarioLogado, reservas, pets, cancelarReserva, atualizarReserva, calcularValorHospedagem } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  const [cancelModal, setCancelModal] = useState<Reserva | null>(null);
  const [editModal, setEditModal] = useState<Reserva | null>(null);
  const [editDataSaida, setEditDataSaida] = useState('');
  const [editAcomodacao, setEditAcomodacao] = useState<'Standard' | 'Premium' | 'Luxo'>('Standard');

  useEffect(() => {
    if (!usuarioLogado) {
      router.replace('/login');
    }
  }, [usuarioLogado]);

  if (!usuarioLogado) return null;

  const minhasReservas = reservas.filter(r => r.usuarioId === usuarioLogado.id);
  const ativas = minhasReservas.filter(r => r.status === 'Ativa');
  const historico = minhasReservas.filter(r => r.status !== 'Ativa');

  const getPetNome = (petId: string) => pets.find(p => p.id === petId)?.nome ?? 'Pet';
  const getPet = (petId: string) => pets.find(p => p.id === petId);

  const diasRestantes = (dataEntrada: string) =>
    Math.ceil((new Date(dataEntrada).getTime() - Date.now()) / 86400000);

  const handleCancelar = () => {
    if (!cancelModal) return;
    const { sucesso, multa } = cancelarReserva(cancelModal.id);
    if (sucesso) {
      multa > 0
        ? toast.warning(`Reserva cancelada. Multa de R$ ${multa.toFixed(2)} será aplicada.`)
        : toast.success('Reserva cancelada sem multa!');
    } else {
      toast.error('Erro ao cancelar reserva.');
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
    toast.success('Reserva atualizada com sucesso!');
    setEditModal(null);
  };

  // Multa info para modal de cancelamento
  const getCancelInfo = (r: Reserva) => {
    const d = diasRestantes(r.dataEntrada);
    const temMulta = d >= 0 && d < 7;
    return { temMulta, multa: temMulta ? r.valorTotal * 0.3 : 0, dias: d };
  };

  if (minhasReservas.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="calendar-outline" size={64} color={Colors.gray[300]} />
        <Text style={styles.emptyTitle}>Nenhuma reserva encontrada</Text>
        <Text style={styles.emptyDesc}>Faça sua primeira reserva agora!</Text>
        <Button onPress={() => router.push('/hotel')} style={{ marginTop: Spacing[4] }}>
          Nova Reserva
        </Button>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Ativas */}
          {ativas.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Reservas Ativas</Text>
              {ativas.map(r => {
                const pet = getPet(r.petId);
                const dr = diasRestantes(r.dataEntrada);
                return (
                  <Card key={r.id} style={styles.reservaCard}>
                    <CardHeader style={styles.reservaHeader}>
                      <View style={styles.reservaHeaderRow}>
                        <View style={{ flex: 1 }}>
                          <CardTitle>{getPetNome(r.petId)}</CardTitle>
                          {pet && (
                            <Text style={styles.petInfo}>{pet.especie} — {pet.raca}</Text>
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
                        <Ionicons name="arrow-forward" size={18} color={Colors.gray[300]} />
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={styles.dateLabel}>Check-out</Text>
                          <Text style={styles.dateValue}>{fmt(r.dataSaidaPrevista)}</Text>
                        </View>
                      </View>

                      {dr > 0 && (
                        <View style={styles.daysInfo}>
                          <Ionicons name="time-outline" size={14} color={Colors.blue} />
                          <Text style={styles.daysInfoText}>
                            Faltam {dr} {dr === 1 ? 'dia' : 'dias'} para o check-in
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
                        <Text style={styles.valorLabel}>Valor Total</Text>
                        <Text style={styles.valorText}>R$ {r.valorTotal.toFixed(2)}</Text>
                      </View>

                      <View style={styles.acoesBtns}>
                        <Button
                          variant="outline"
                          size="sm"
                          onPress={() => openEdit(r)}
                          style={{ flex: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onPress={() => setCancelModal(r)}
                          style={{ flex: 1 }}
                        >
                          Cancelar
                        </Button>
                      </View>
                    </CardContent>
                  </Card>
                );
              })}
            </View>
          )}

          {/* Histórico */}
          {historico.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Histórico</Text>
              {historico.map(r => (
                <Card key={r.id} style={[styles.reservaCard, styles.historicoCard]}>
                  <CardHeader style={styles.reservaHeader}>
                    <View style={styles.reservaHeaderRow}>
                      <CardTitle style={{ color: Colors.gray[500] }}>{getPetNome(r.petId)}</CardTitle>
                      <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>
                    </View>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.datesRow}>
                      <View>
                        <Text style={styles.dateLabel}>Check-in</Text>
                        <Text style={styles.dateValue}>{fmt(r.dataEntrada)}</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={18} color={Colors.gray[300]} />
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.dateLabel}>Check-out</Text>
                        <Text style={styles.dateValue}>{fmt(r.dataSaidaPrevista)}</Text>
                      </View>
                    </View>
                    <View style={styles.valorRow}>
                      <Text style={styles.valorLabel}>Valor</Text>
                      <Text style={styles.valorText}>R$ {r.valorTotal.toFixed(2)}</Text>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}
        </View>
        <View style={{ height: Spacing[8] }} />
      </ScrollView>

      {/* Modal Cancelar */}
      <Modal visible={!!cancelModal} transparent animationType="slide" onRequestClose={() => setCancelModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Confirmar Cancelamento</Text>
            <Text style={styles.modalDesc}>Tem certeza que deseja cancelar esta reserva?</Text>

            {cancelModal && (() => {
              const { temMulta, multa } = getCancelInfo(cancelModal);
              return temMulta ? (
                <View style={styles.multaWarning}>
                  <Ionicons name="warning" size={20} color={Colors.yellow} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.multaTitle}>Atenção: Multa por Cancelamento</Text>
                    <Text style={styles.multaDesc}>
                      Faltam menos de 7 dias — multa de 30% do valor total.
                    </Text>
                    <Text style={styles.multaValor}>Multa: R$ {multa.toFixed(2)}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.semMulta}>
                  <Ionicons name="checkmark-circle" size={18} color={Colors.green} />
                  <Text style={{ color: '#15803D', fontSize: FontSizes.sm, flex: 1 }}>
                    Cancelamento sem multa (mais de 7 dias de antecedência)
                  </Text>
                </View>
              );
            })()}

            <View style={styles.modalBtns}>
              <Button variant="outline" onPress={() => setCancelModal(null)} style={{ flex: 1 }}>Voltar</Button>
              <Button variant="destructive" onPress={handleCancelar} style={{ flex: 1 }}>Confirmar</Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Editar */}
      <Modal visible={!!editModal} transparent animationType="slide" onRequestClose={() => setEditModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Editar Reserva</Text>

            <DatePicker
              label="Nova Data de Saída"
              value={editDataSaida}
              onChange={setEditDataSaida}
              minimumDate={editModal?.dataEntrada}
            />

            <Select
              label="Tipo de Acomodação"
              options={ACOMODACOES}
              value={editAcomodacao}
              onChange={v => setEditAcomodacao(v as any)}
            />

            {editModal && editDataSaida && (
              <View style={styles.novoValor}>
                <Text style={styles.novoValorLabel}>Novo valor total:</Text>
                <Text style={styles.novoValorPrice}>
                  R$ {calcularValorHospedagem(editModal.dataEntrada, editDataSaida, editAcomodacao).toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.modalBtns}>
              <Button variant="outline" onPress={() => setEditModal(null)} style={{ flex: 1 }}>Cancelar</Button>
              <Button onPress={handleEditar} style={{ flex: 1 }}>Salvar</Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.beige },
  content: { padding: Spacing[4], gap: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing[6] },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.gray[700], marginTop: Spacing[4] },
  emptyDesc: { fontSize: FontSizes.sm, color: Colors.gray[500], marginTop: Spacing[2] },

  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.gray[900],
    marginBottom: Spacing[3],
    marginTop: Spacing[2],
  },
  reservaCard: { marginBottom: 10 },
  historicoCard: { opacity: 0.75 },
  reservaHeader: { paddingBottom: 0 },
  reservaHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  petInfo: { fontSize: FontSizes.sm, color: Colors.gray[500], marginTop: 2 },

  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.beige,
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
    marginBottom: Spacing[3],
  },
  dateLabel: { fontSize: FontSizes.xs, color: Colors.gray[500] },
  dateValue: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray[900] },

  daysInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.blueLight,
    borderRadius: BorderRadius.md,
    padding: Spacing[2],
    marginBottom: Spacing[3],
  },
  daysInfoText: { fontSize: FontSizes.sm, color: Colors.blue },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  infoLabel: { fontSize: FontSizes.xs, color: Colors.gray[500] },
  infoValue: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray[800] },

  valorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
    marginBottom: Spacing[3],
  },
  valorLabel: { fontSize: FontSizes.sm, color: Colors.gray[500] },
  valorText: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.green },

  acoesBtns: { flexDirection: 'row', gap: 10 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing[6],
    paddingBottom: Spacing[8],
    gap: Spacing[3],
  },
  modalTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.gray[900] },
  modalDesc: { fontSize: FontSizes.sm, color: Colors.gray[500] },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: Spacing[2] },

  multaWarning: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Colors.yellowLight,
    borderRadius: BorderRadius.md,
    padding: Spacing[4],
  },
  multaTitle: { fontSize: FontSizes.sm, fontWeight: '700', color: '#92400E', marginBottom: 4 },
  multaDesc: { fontSize: FontSizes.xs, color: '#92400E' },
  multaValor: { fontSize: FontSizes.base, fontWeight: '700', color: '#92400E', marginTop: 6 },

  semMulta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    backgroundColor: Colors.greenLight,
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
  },

  novoValor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.blueLight,
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
  },
  novoValorLabel: { fontSize: FontSizes.sm, color: Colors.gray[600] },
  novoValorPrice: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.blue },
});
