import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardHeader, CardTitle, CardContent } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Select } from '../../src/components/ui/Select';
import { DatePicker } from '../../src/components/ui/DatePicker';
import { useApp } from '../../src/context/AppContext';
import { useToast } from '../../src/components/ui/Toast';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../src/constants/theme';

const ACOMODACOES = [
  { label: 'Standard — R$ 80/dia', value: 'Standard' },
  { label: 'Premium — R$ 150/dia', value: 'Premium' },
  { label: 'Luxo — R$ 250/dia', value: 'Luxo' },
];

const ALIMENTACAO = [
  { label: 'Hotel (cardápio padrão)', value: 'Hotel' },
  { label: 'Tutor (trarei a ração)', value: 'Tutor' },
];

export default function Hotel() {
  const { usuarioLogado, pets, adicionarReserva, calcularValorHospedagem, obterVagasDisponiveis } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  const [petId, setPetId] = useState('');
  const [dataEntrada, setDataEntrada] = useState('');
  const [dataSaida, setDataSaida] = useState('');
  const [alimentacao, setAlimentacao] = useState<'Hotel' | 'Tutor'>('Hotel');
  const [acomodacao, setAcomodacao] = useState<'Standard' | 'Premium' | 'Luxo'>('Standard');
  const [observacoes, setObservacoes] = useState('');
  const [valorTotal, setValorTotal] = useState(0);
  const [vagas, setVagas] = useState<number | null>(null);
  const [dias, setDias] = useState(0);

  const meusPets = usuarioLogado ? pets.filter(p => p.usuarioId === usuarioLogado.id) : [];
  const petOptions = meusPets.map(p => ({ label: `${p.nome} — ${p.especie} (${p.raca})`, value: p.id }));
  const hoje = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (dataEntrada && dataSaida) {
      const entrada = new Date(dataEntrada);
      const saida = new Date(dataSaida);
      if (saida > entrada) {
        const d = Math.ceil((saida.getTime() - entrada.getTime()) / 86400000);
        setDias(d);
        setValorTotal(calcularValorHospedagem(dataEntrada, dataSaida, acomodacao));
        setVagas(obterVagasDisponiveis(dataEntrada, dataSaida));
      } else {
        setValorTotal(0);
        setVagas(null);
        setDias(0);
      }
    }
  }, [dataEntrada, dataSaida, acomodacao]);

  if (!usuarioLogado) {
    return (
      <View style={styles.center}>
        <Ionicons name="home-outline" size={64} color={Colors.teal} />
        <Text style={styles.centerTitle}>Faça Login para Reservar</Text>
        <Text style={styles.centerDesc}>Você precisa estar logado para fazer uma reserva.</Text>
        <View style={styles.centerBtns}>
          <Button fullWidth onPress={() => router.push('/login')}>Fazer Login</Button>
          <Button variant="outline" fullWidth onPress={() => router.push('/cadastro-usuario')} style={{ marginTop: 10 }}>
            Cadastrar
          </Button>
        </View>
      </View>
    );
  }

  if (meusPets.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.orange} />
        <Text style={styles.centerTitle}>Cadastre um Pet Primeiro</Text>
        <Text style={styles.centerDesc}>
          Você precisa cadastrar pelo menos um pet antes de fazer uma reserva.
        </Text>
        <Button onPress={() => router.push('/cadastro-pet')} style={{ marginTop: 16 }}>
          Cadastrar Pet
        </Button>
      </View>
    );
  }

  const handleSubmit = () => {
    if (!petId) { toast.error('Selecione um pet para a reserva.'); return; }
    if (!dataEntrada || !dataSaida) { toast.error('Selecione as datas de entrada e saída.'); return; }
    if (new Date(dataSaida) <= new Date(dataEntrada)) {
      toast.error('A data de saída deve ser posterior à entrada.'); return;
    }
    if (vagas !== null && vagas <= 0) {
      toast.error('Não há vagas disponíveis para este período.'); return;
    }

    adicionarReserva({
      petId,
      usuarioId: usuarioLogado.id,
      dataEntrada,
      dataSaidaPrevista: dataSaida,
      responsavelAlimentacao: alimentacao,
      tipoAcomodacao: acomodacao,
      observacoesComida: observacoes,
      status: 'Ativa',
      valorTotal,
    });

    const pet = meusPets.find(p => p.id === petId);
    toast.success(`Reserva confirmada para ${pet?.nome}!`);
    router.push('/minhas-reservas');
  };

  const vagaColor =
    vagas === null ? Colors.gray[400]
    : vagas === 0 ? Colors.red
    : vagas <= 5 ? Colors.yellow
    : Colors.green;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card>
          <CardHeader>
            <CardTitle>Dados da Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              label="Selecione o Pet *"
              options={petOptions}
              value={petId}
              onChange={setPetId}
              placeholder="Escolha um pet"
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <DatePicker
                  label="Entrada *"
                  value={dataEntrada}
                  onChange={setDataEntrada}
                  minimumDate={hoje}
                />
              </View>
              <View style={styles.half}>
                <DatePicker
                  label="Saída *"
                  value={dataSaida}
                  onChange={setDataSaida}
                  minimumDate={dataEntrada || hoje}
                />
              </View>
            </View>

            {vagas !== null && dataEntrada && dataSaida && (
              <View style={[styles.vagasBanner, { backgroundColor: `${vagaColor}22`, borderColor: vagaColor }]}>
                <Ionicons name="calendar-outline" size={16} color={vagaColor} />
                <Text style={[styles.vagasText, { color: vagaColor }]}>
                  {vagas === 0
                    ? 'Sem vagas disponíveis'
                    : `${vagas} vaga${vagas !== 1 ? 's' : ''} disponível${vagas !== 1 ? 's' : ''}${vagas <= 5 ? ' — Reserve logo!' : ''}`}
                </Text>
              </View>
            )}

            <Select
              label="Tipo de Acomodação *"
              options={ACOMODACOES}
              value={acomodacao}
              onChange={v => setAcomodacao(v as any)}
            />

            <Select
              label="Responsável pela Alimentação *"
              options={ALIMENTACAO}
              value={alimentacao}
              onChange={v => setAlimentacao(v as any)}
            />

            <View style={styles.textareaContainer}>
              <Text style={styles.textareaLabel}>Observações</Text>
              <TextInput
                style={styles.textarea}
                value={observacoes}
                onChangeText={setObservacoes}
                placeholder="Alergias, preferências alimentares, medicações..."
                placeholderTextColor={Colors.gray[400]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {valorTotal > 0 && (
              <View style={styles.resumo}>
                <View style={styles.resumoRow}>
                  <View>
                    <Text style={styles.resumoLabel}>Período</Text>
                    <Text style={styles.resumoValue}>{dias} {dias === 1 ? 'dia' : 'dias'}</Text>
                  </View>
                  <View style={styles.resumoRight}>
                    <Text style={styles.resumoLabel}>Valor Total</Text>
                    <Text style={styles.resumoPrice}>R$ {valorTotal.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <Text style={styles.resumoNote}>
                  * Cancelamentos com menos de 7 dias terão multa de 30%
                </Text>
              </View>
            )}

            <Button
              fullWidth
              disabled={vagas === 0}
              onPress={handleSubmit}
              style={{ marginTop: Spacing[2] }}
            >
              Confirmar Reserva
            </Button>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.beige },
  content: { padding: Spacing[4], paddingBottom: Spacing[8] },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[6],
  },
  centerTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.gray[900], marginTop: Spacing[4], textAlign: 'center' },
  centerDesc: { fontSize: FontSizes.sm, color: Colors.gray[500], textAlign: 'center', marginTop: Spacing[2], marginBottom: Spacing[4] },
  centerBtns: { width: '100%' },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  vagasBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
    marginBottom: Spacing[3],
  },
  vagasText: { fontSize: FontSizes.sm, fontWeight: '600', flex: 1 },
  textareaContainer: { marginBottom: Spacing[3] },
  textareaLabel: { fontSize: FontSizes.sm, fontWeight: '500', color: Colors.gray[700], marginBottom: 6 },
  textarea: {
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
    fontSize: FontSizes.base,
    color: Colors.gray[900],
    backgroundColor: Colors.white,
    minHeight: 80,
  },
  resumo: {
    backgroundColor: Colors.tealLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.teal,
    borderRadius: BorderRadius.md,
    padding: Spacing[4],
    marginBottom: Spacing[3],
  },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  resumoRight: { alignItems: 'flex-end' },
  resumoLabel: { fontSize: FontSizes.sm, color: Colors.gray[500] },
  resumoValue: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray[800] },
  resumoPrice: { fontSize: FontSizes['2xl'], fontWeight: '800', color: Colors.teal },
  divider: { height: 1, backgroundColor: Colors.teal, opacity: 0.2, marginVertical: Spacing[2] },
  resumoNote: { fontSize: FontSizes.xs, color: Colors.gray[500] },
});
