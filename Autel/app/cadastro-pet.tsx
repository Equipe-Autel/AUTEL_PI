import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../src/components/ui/Card';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Select } from '../src/components/ui/Select';
import { useApp } from '../src/context/AppContext';
import { useToast } from '../src/components/ui/Toast';
import { Colors, FontSizes, Spacing, BorderRadius } from '../src/constants/theme';

export default function CadastroPet() {
  const { usuarioLogado, usuarios, adicionarPet } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  const [clienteId, setClienteId] = useState('');
  const [form, setForm] = useState({
    nome: '',
    especie: 'Cachorro' as 'Cachorro' | 'Gato',
    raca: '',
    idade: '',
    peso: '',
    observacoesSaude: '',
    porte: 'Médio' as 'Pequeno' | 'Médio' | 'Grande',
    comportamento: 'Calmo' as 'Calmo' | 'Agitado' | 'Agressivo',
    brincadeirasFavoritas: '',
    sexo: 'Macho' as 'Macho' | 'Fêmea',
    naturalidade: '',
    castrado: false,
  });

  const set = (key: keyof typeof form) => (val: any) =>
    setForm(prev => ({ ...prev, [key]: val }));

  if (!usuarioLogado) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>Você precisa estar logado para cadastrar um pet.</Text>
        <Button onPress={() => router.push('/login')} style={{ marginTop: Spacing[4] }}>
          Fazer Login
        </Button>
      </View>
    );
  }

  const isAdmin = usuarioLogado.isAdmin;
  const clientesOptions = usuarios
    .filter(u => !u.isAdmin)
    .map(u => ({ label: `${u.nome} — ${u.email}`, value: u.id }));

  const handleSubmit = () => {
    if (isAdmin && !clienteId) {
      toast.error('Selecione o cliente dono do pet.');
      return;
    }
    if (!form.nome || !form.raca || !form.idade || !form.peso) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }

    const idadeNum = parseFloat(form.idade);
    const pesoNum = parseFloat(form.peso);

    if (isNaN(idadeNum) || idadeNum < 0 || idadeNum > 30) {
      toast.error('Idade deve ser entre 0 e 30 anos.');
      return;
    }
    if (isNaN(pesoNum) || pesoNum <= 0 || pesoNum > 200) {
      toast.error('Peso deve ser entre 0 e 200 kg.');
      return;
    }

    adicionarPet({
      ...form,
      idade: idadeNum,
      peso: pesoNum,
      usuarioId: isAdmin ? clienteId : usuarioLogado.id,
    });

    toast.success(`${form.nome} cadastrado com sucesso!`);
    router.back();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card>
          <CardHeader style={styles.header}>
            <View style={styles.iconWrap}>
              <Ionicons name="paw-outline" size={32} color={Colors.teal} />
            </View>
            <CardTitle style={styles.title}>Cadastro de Pet</CardTitle>
            <CardDescription style={styles.desc}>
              Preencha as informações do seu pet para hospedagem
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Seletor de cliente — somente admin */}
            {isAdmin && (
              <>
                <Text style={styles.sectionLabel}>Atribuir ao Cliente</Text>
                <Select
                  label="Cliente *"
                  options={clientesOptions}
                  value={clienteId}
                  onChange={setClienteId}
                  placeholder="Selecione o cliente"
                />
              </>
            )}

            {/* Informações Básicas */}
            <Text style={styles.sectionLabel}>Informações Básicas</Text>

            <Input
              label="Nome do Pet *"
              value={form.nome}
              onChangeText={set('nome')}
              placeholder="Nome do seu pet"
            />
            <View style={styles.row}>
              <Select
                label="Espécie *"
                options={[{ label: 'Cachorro', value: 'Cachorro' }, { label: 'Gato', value: 'Gato' }]}
                value={form.especie}
                onChange={set('especie')}
                containerStyle={styles.half}
              />
              <Input
                label="Raça *"
                value={form.raca}
                onChangeText={set('raca')}
                placeholder="Ex: Labrador"
                containerStyle={styles.half}
              />
            </View>
            <View style={styles.row}>
              <Input
                label="Idade (anos) *"
                value={form.idade}
                onChangeText={set('idade')}
                placeholder="0"
                keyboardType="decimal-pad"
                containerStyle={styles.half}
              />
              <Input
                label="Peso (kg) *"
                value={form.peso}
                onChangeText={set('peso')}
                placeholder="0.0"
                keyboardType="decimal-pad"
                containerStyle={styles.half}
              />
            </View>

            {/* Características */}
            <Text style={[styles.sectionLabel, { marginTop: Spacing[2] }]}>Características</Text>

            <View style={styles.row}>
              <Select
                label="Porte *"
                options={[
                  { label: 'Pequeno', value: 'Pequeno' },
                  { label: 'Médio', value: 'Médio' },
                  { label: 'Grande', value: 'Grande' },
                ]}
                value={form.porte}
                onChange={set('porte')}
                containerStyle={styles.half}
              />
              <Select
                label="Sexo *"
                options={[
                  { label: 'Macho', value: 'Macho' },
                  { label: 'Fêmea', value: 'Fêmea' },
                ]}
                value={form.sexo}
                onChange={set('sexo')}
                containerStyle={styles.half}
              />
            </View>

            <Select
              label="Comportamento *"
              options={[
                { label: 'Calmo', value: 'Calmo' },
                { label: 'Agitado', value: 'Agitado' },
                { label: 'Agressivo', value: 'Agressivo' },
              ]}
              value={form.comportamento}
              onChange={set('comportamento')}
            />

            <Input
              label="Naturalidade"
              value={form.naturalidade}
              onChangeText={set('naturalidade')}
              placeholder="Cidade/Estado"
            />

            <Input
              label="Brincadeiras Favoritas"
              value={form.brincadeirasFavoritas}
              onChangeText={set('brincadeirasFavoritas')}
              placeholder="Ex: Buscar bolinha, brincar com laser"
            />

            {/* Saúde */}
            <Text style={[styles.sectionLabel, { marginTop: Spacing[2] }]}>Informações de Saúde</Text>

            <View style={styles.textareaWrap}>
              <Text style={styles.textareaLabel}>Observações de Saúde</Text>
              <TextInput
                style={styles.textarea}
                value={form.observacoesSaude}
                onChangeText={set('observacoesSaude')}
                placeholder="Alergias, medicações, condições especiais..."
                placeholderTextColor={Colors.gray[400]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Pet castrado(a)</Text>
              <Switch
                value={form.castrado}
                onValueChange={set('castrado')}
                trackColor={{ false: Colors.gray[300], true: Colors.teal }}
                thumbColor={Colors.white}
              />
            </View>

            <Button fullWidth onPress={handleSubmit} style={styles.submitBtn}>
              Cadastrar Pet
            </Button>

            <Button
              variant="outline"
              fullWidth
              onPress={() => router.push('/')}
            >
              Cancelar
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing[6] },
  centerText: { fontSize: FontSizes.base, color: Colors.gray[700], textAlign: 'center' },
  header: { alignItems: 'center' },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
  },
  title: { textAlign: 'center' },
  desc: { textAlign: 'center' },
  sectionLabel: {
    fontSize: FontSizes.base,
    fontWeight: '700',
    color: Colors.gray[800],
    marginBottom: Spacing[3],
    paddingBottom: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  textareaWrap: { marginBottom: Spacing[3] },
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[3],
    marginBottom: Spacing[3],
  },
  switchLabel: { fontSize: FontSizes.base, color: Colors.gray[800], fontWeight: '500' },
  submitBtn: { marginBottom: Spacing[3] },
});
