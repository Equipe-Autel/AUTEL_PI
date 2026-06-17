import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Componentes UI do sistema
import { Card, CardHeader, CardTitle, CardContent } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Select } from '../../src/components/ui/Select';
import { DatePicker } from '../../src/components/ui/DatePicker';

// Contexto e Hooks
import { useApp } from '../../src/context/AppContext';
import { useToast } from '../../src/components/ui/Toast';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../src/constants/theme';


const ALIMENTACAO = [
  { label: 'Cardápio Autel (Ração Premium inclusa)', value: 'Hotel' },
  { label: 'Alimentação Própria (Tutor fornece)', value: 'Tutor' },
];

export default function Hotel() {
  const { usuarioLogado, usuarios, pets, planos, adicionarReserva, calcularValorHospedagem, obterVagasDisponiveis } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  // estados do formulário de reserva
  const [petId, setPetId] = useState('');
  const [dataEntrada, setDataEntrada] = useState('');
  const [dataSaida, setDataSaida] = useState('');
  const [alimentacao, setAlimentacao] = useState<'Hotel' | 'Tutor'>('Hotel');
  const [acomodacao, setAcomodacao] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Estados de cálculo e disponibilidade
  const [valorTotal, setValorTotal] = useState(0);
  const [vagas, setVagas] = useState<number | null>(null);
  const [dias, setDias] = useState(0);
  const [mostrarForm, setMostrarForm] = useState(false);

  const isAdmin = usuarioLogado?.isAdmin ?? false;

  // inicializa acomodação com o primeiro plano disponível
  useEffect(() => {
    if (planos.length > 0 && !acomodacao) {
      setAcomodacao(planos[0].nome);
    }
  }, [planos]);

  // Admin vê todos os pets de clientes; usuário comum só os seus
  const meusPets = !usuarioLogado
    ? []
    : isAdmin
      ? pets.filter(p => !usuarios.find(u => u.id === p.usuarioId)?.isAdmin)
      : pets.filter(p => p.usuarioId === usuarioLogado.id);

  const petOptions = meusPets.map(p => {
    if (isAdmin) {
      const tutor = usuarios.find(u => u.id === p.usuarioId);
      return { label: `🐾 ${p.nome} (${p.raca}) — ${tutor ? `${tutor.nome} ${tutor.sobrenome}` : '?'}`, value: p.id };
    }
    return { label: `🐾 ${p.nome} (${p.raca})`, value: p.id };
  });
  const hoje = new Date().toISOString().split('T')[0];

  //Atualiza valor total e vagas sempre que datas ou acomodação mudam
  useEffect(() => {
    if (dataEntrada && dataSaida) {
      const entrada = new Date(dataEntrada);
      const saida = new Date(dataSaida);
      
      if (saida > entrada) {
        const diffTempo = Math.ceil((saida.getTime() - entrada.getTime()) / 86400000);
        setDias(diffTempo);
        setValorTotal(calcularValorHospedagem(dataEntrada, dataSaida, acomodacao));
        setVagas(obterVagasDisponiveis(dataEntrada, dataSaida));
      } else {
        setValorTotal(0);
        setVagas(null);
        setDias(0);
      }
    }
  }, [dataEntrada, dataSaida, acomodacao]);

  // Bloqueio por Login
  
  if (!usuarioLogado) {
    return (
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed-outline" size={40} color={Colors.teal} />
        </View>
        <Text style={styles.centerTitle}>Acesso Restrito</Text>
        <Text style={styles.centerDesc}>Para reservar uma estadia, por favor, acesse sua conta ou crie uma nova.</Text>
        <View style={styles.centerBtns}>
          <Button fullWidth onPress={() => router.push('/login')}>Entrar na Conta</Button>
          <Button variant="outline" fullWidth onPress={() => router.push('/cadastro-usuario')} style={{ marginTop: 12 }}>
            Criar Cadastro
          </Button>
        </View>
      </View>
    );
  }

  // bloqueio por falta de Pets
  if (meusPets.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="paw-outline" size={64} color={Colors.orange} />
        <Text style={styles.centerTitle}>Nenhum Pet Encontrado</Text>
        {isAdmin ? (
          <Text style={styles.centerDesc}>
            Nenhum cliente possui pets cadastrados no momento. Use a aba Cadastro para adicionar um pet.
          </Text>
        ) : (
          <>
            <Text style={styles.centerDesc}>
              Identificamos que você ainda não cadastrou seu amiguinho. Vamos fazer isso agora?
            </Text>
            <Button onPress={() => router.push('/cadastro-pet')} style={{ marginTop: 16 }}>
              Cadastrar meu Pet
            </Button>
          </>
        )}
      </View>
    );
  }

  const handleSubmit = () => {
    if (!petId) { toast.error('Por favor, selecione qual pet ficará conosco.'); return; }
    if (!dataEntrada || !dataSaida) { toast.error('As datas de check-in e check-out são obrigatórias.'); return; }
    
    if (vagas !== null && vagas <= 0) {
      toast.error('Infelizmente não temos vagas para este período.'); return;
    }

    const petSelecionado = meusPets.find(p => p.id === petId);
    const donoPetId = isAdmin && petSelecionado ? petSelecionado.usuarioId : usuarioLogado.id;

    adicionarReserva({
      petId,
      usuarioId: donoPetId,
      dataEntrada,
      dataSaidaPrevista: dataSaida,
      responsavelAlimentacao: alimentacao,
      tipoAcomodacao: acomodacao,
      observacoesComida: observacoes,
      status: 'Ativa',
      valorTotal,
    });

    const pet = meusPets.find(p => p.id === petId);
    toast.success(`Reserva para ${pet?.nome} realizada com sucesso!`);
    
    // Reseta os campos do formulário para o estado inicial
    setPetId('');
    setDataEntrada('');
    setDataSaida('');
    setAlimentacao('Hotel');
    if (planos.length > 0) {
      setAcomodacao(planos[0].nome);
    }
    setObservacoes('');
    setMostrarForm(false);

    router.push('/minhas-reservas');
  };

  // Lógica de cor para o banner de vagas
  const vagaColor =
    vagas === null ? Colors.gray[400]
    : vagas === 0 ? Colors.red
    : vagas <= 3 ? Colors.orange // Mais urgente 
    : Colors.green;

  if (!mostrarForm) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Banner Hero */}
          <Card style={styles.introHeroCard}>
            <CardContent style={styles.introHeroContent}>
              <View style={styles.badgePromo}>
                <Text style={styles.badgePromoText}>Hospedagem 5 Estrelas</Text>
              </View>
              <Text style={styles.introHeroTitle}>O Segundo Lar do Seu Pet</Text>
              <Text style={styles.introHeroSubtitle}>
                Proporcione uma estadia com conforto, diversão sob medida e carinho monitorado 24 horas por dia.
              </Text>
            </CardContent>
          </Card>

          {/* Vagas rápidas status */}
          <View style={styles.quickVagasBanner}>
            <Ionicons name="sparkles" size={18} color={Colors.orange} />
            <Text style={styles.quickVagasText}>
              Quartos prontos e higienizados. Faça sua reserva instantânea!
            </Text>
          </View>

          {/* Botão de Ação Principal (CTA) */}
          <Button
            size="lg"
            fullWidth
            onPress={() => setMostrarForm(true)}
            style={styles.ctaButton}
            textStyle={styles.ctaButtonText}
          >
            <Ionicons name="calendar-outline" size={18} color={Colors.white} /> Iniciar Reserva
          </Button>

          {/* Grid de Diferenciais / Diferenciais */}
          <Text style={styles.gridTitle}>Diferenciais Exclusivos</Text>
          <View style={styles.benefitsGrid}>
            <Card style={styles.benefitCard}>
              <CardContent style={styles.benefitCardContent}>
                <View style={[styles.benefitIconWrap, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="thermometer-outline" size={20} color="#0284C7" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitCardTitle}>Climatização</Text>
                  <Text style={styles.benefitCardDesc}>Suítes com ar-condicionado e controle térmico.</Text>
                </View>
              </CardContent>
            </Card>

            <Card style={styles.benefitCard}>
              <CardContent style={styles.benefitCardContent}>
                <View style={[styles.benefitIconWrap, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="videocam-outline" size={20} color="#15803D" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitCardTitle}>Monitoramento 24h</Text>
                  <Text style={styles.benefitCardDesc}>Câmeras ativas para você ver seu pet quando quiser.</Text>
                </View>
              </CardContent>
            </Card>

            <Card style={styles.benefitCard}>
              <CardContent style={styles.benefitCardContent}>
                <View style={[styles.benefitIconWrap, { backgroundColor: '#FEF9C3' }]}>
                  <Ionicons name="basketball-outline" size={20} color="#A16207" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitCardTitle}>Recreação Diária</Text>
                  <Text style={styles.benefitCardDesc}>Brincadeiras e passeios supervisionados por cuidadores.</Text>
                </View>
              </CardContent>
            </Card>

            <Card style={styles.benefitCard}>
              <CardContent style={styles.benefitCardContent}>
                <View style={[styles.benefitIconWrap, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="heart-outline" size={20} color="#B91C1C" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitCardTitle}>Suporte Veterinário</Text>
                  <Text style={styles.benefitCardDesc}>Atendimento ágil e veterinários sempre de plantão.</Text>
                </View>
              </CardContent>
            </Card>
          </View>

        </View>
        <View style={{ height: Spacing[8] }} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card style={styles.mainCard}>
          <CardHeader>
            <View style={styles.formHeaderRow}>
              <View style={{ flex: 1 }}>
                <CardTitle>Nova Hospedagem</CardTitle>
                <Text style={styles.subtitle}>Preencha os detalhes para a estadia</Text>
              </View>
              <TouchableOpacity onPress={() => setMostrarForm(false)} style={styles.backButton}>
                <Ionicons name="arrow-back-circle-outline" size={28} color={Colors.teal} />
              </TouchableOpacity>
            </View>
          </CardHeader>
          
          <CardContent>
            <Select
              label="Quem vai se hospedar? *"
              options={petOptions}
              value={petId}
              onChange={setPetId}
              placeholder="Selecione um pet"
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <DatePicker
                  label="Check-in *"
                  value={dataEntrada}
                  onChange={setDataEntrada}
                  minimumDate={hoje}
                />
              </View>
              <View style={styles.half}>
                <DatePicker
                  label="Check-out *"
                  value={dataSaida}
                  onChange={setDataSaida}
                  minimumDate={dataEntrada || hoje}
                />
              </View>
            </View>

            {/* Banner disponibilidade  */}
            {vagas !== null && dataEntrada && dataSaida && (
              <View style={[styles.vagasBanner, { backgroundColor: `${vagaColor}15`, borderColor: vagaColor }]}>
                <Ionicons name="information-circle-outline" size={18} color={vagaColor} />
                <Text style={[styles.vagasText, { color: vagaColor }]}>
                  {vagas === 0
                    ? 'Esgotado para estas datas'
                    : `${vagas} ${vagas === 1 ? 'vaga restante' : 'vagas disponíveis'}${vagas <= 3 ? ' — Garanta já!' : ''}`}
                </Text>
              </View>
            )}

            <Select
              label="Tipo de Acomodação *"
              options={planos.map(p => ({ label: `${p.nome} — ${p.descricao} (R$ ${p.preco}/dia)`, value: p.nome }))}
              value={acomodacao}
              onChange={setAcomodacao}
              placeholder="Selecione um plano"
            />

            <Select
              label="Preferência de Alimentação *"
              options={ALIMENTACAO}
              value={alimentacao}
              onChange={v => setAlimentacao(v as any)}
            />

            <View style={styles.textareaContainer}>
              <Text style={styles.textareaLabel}>Observações e Cuidados Especiais</Text>
              <TextInput
                style={styles.textarea}
                value={observacoes}
                onChangeText={setObservacoes}
                placeholder="Ex: Alergia a frango, precisa tomar remédio às 08h..."
                placeholderTextColor={Colors.gray[400]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Resumo Financeiro */}
            {valorTotal > 0 && (
              <View style={styles.resumo}>
                <View style={styles.resumoRow}>
                  <View>
                    <Text style={styles.resumoLabel}>Duração</Text>
                    <Text style={styles.resumoValue}>{dias} {dias === 1 ? 'diária' : 'diárias'}</Text>
                  </View>
                  <View style={styles.resumoRight}>
                    <Text style={styles.resumoLabel}>Investimento</Text>
                    <Text style={styles.resumoPrice}>R$ {valorTotal.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Ionicons name="shield-checkmark-outline" size={14} color={Colors.gray[500]} />
                  <Text style={styles.resumoNote}>
                    Cancelamento gratuito até 7 dias antes do check-in.
                  </Text>
                </View>
              </View>
            )}

            <Button
              fullWidth
              disabled={vagas === 0 || !petId}
              onPress={handleSubmit}
              style={styles.finalizarBtn}
              textStyle={styles.finalizarBtnText}
            >
              Finalizar Reserva
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
  mainCard: { elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  subtitle: { fontSize: FontSizes.sm, color: Colors.gray[500], marginTop: -4, marginBottom: 10 },
  
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[8],
    backgroundColor: Colors.beige,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  centerTitle: { fontSize: FontSizes['2xl'], fontWeight: '800', color: Colors.gray[900], textAlign: 'center' },
  centerDesc: { fontSize: FontSizes.base, color: Colors.gray[600], textAlign: 'center', marginTop: Spacing[3], marginBottom: Spacing[6], lineHeight: 22 },
  centerBtns: { width: '100%' },
  
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  
  vagasBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    marginVertical: Spacing[2],
    marginBottom: Spacing[4],
  },
  vagasText: { fontSize: FontSizes.sm, fontWeight: '700', flex: 1 },
  
  textareaContainer: { marginBottom: Spacing[4] },
  textareaLabel: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray[700], marginBottom: 8 },
  textarea: {
    borderWidth: 1.5,
    borderColor: Colors.gray[200],
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    fontSize: FontSizes.base,
    color: Colors.gray[900],
    backgroundColor: '#F9FAFB',
    minHeight: 100,
  },
  
  resumo: {
    backgroundColor: '#E6FFFA', // Um teal bem clarinho para destacar
    borderLeftWidth: 5,
    borderLeftColor: Colors.teal,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[5],
  },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resumoRight: { alignItems: 'flex-end' },
  resumoLabel: { fontSize: FontSizes.xs, textTransform: 'uppercase', letterSpacing: 1, color: Colors.gray[500], marginBottom: 2 },
  resumoValue: { fontSize: FontSizes.base, fontWeight: '700', color: Colors.gray[800] },
  resumoPrice: { fontSize: FontSizes['2xl'], fontWeight: '900', color: Colors.teal },
  divider: { height: 1, backgroundColor: Colors.teal, opacity: 0.1, marginVertical: Spacing[3] },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resumoNote: { fontSize: FontSizes.xs, color: Colors.gray[600], fontStyle: 'italic' },
  
  // Apresentação
  introHeroCard: { backgroundColor: Colors.tealDark, borderBottomWidth: 4, borderBottomColor: Colors.orange, marginBottom: Spacing[2] },
  introHeroContent: { padding: Spacing[5], alignItems: 'flex-start' },
  badgePromo: { backgroundColor: Colors.orange, paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full, marginBottom: Spacing[3] },
  badgePromoText: { color: Colors.white, fontSize: FontSizes.xs, fontWeight: '700', textTransform: 'uppercase' },
  introHeroTitle: { color: Colors.white, fontSize: FontSizes.xl, fontWeight: '800', marginBottom: Spacing[2] },
  introHeroSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: FontSizes.sm, lineHeight: 20 },
  
  quickVagasBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.orangeLight, borderWidth: 1.5, borderColor: Colors.orange, padding: Spacing[3], borderRadius: BorderRadius.lg, marginVertical: Spacing[3] },
  quickVagasText: { color: Colors.orange, fontSize: FontSizes.xs, fontWeight: '700', flex: 1 },
  
  gridTitle: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.gray[900], marginBottom: Spacing[3], marginTop: Spacing[2] },
  benefitsGrid: { gap: 12, marginBottom: Spacing[5] },
  benefitCard: { marginBottom: 0, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6 },
  benefitCardContent: { flexDirection: 'row', gap: Spacing[3], alignItems: 'center', padding: Spacing[3] },
  benefitIconWrap: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  benefitCardTitle: { fontSize: FontSizes.base, fontWeight: '700', color: Colors.gray[900], marginBottom: 2 },
  benefitCardDesc: { fontSize: FontSizes.xs, color: Colors.gray[500], lineHeight: 16 },
  
  ctaButton: { 
    backgroundColor: Colors.orange, 
    marginTop: Spacing[3], 
    gap: 8,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    elevation: 3,
    shadowColor: Colors.orange,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  ctaButtonText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: FontSizes.base,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  finalizarBtn: {
    backgroundColor: Colors.orange,
    marginTop: Spacing[4],
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    elevation: 3,
    shadowColor: Colors.orange,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  finalizarBtnText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: FontSizes.base,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  formHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { padding: 4 },
});