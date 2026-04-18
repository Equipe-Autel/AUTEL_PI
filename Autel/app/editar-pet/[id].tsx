import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Select } from '../../src/components/ui/Select';
import { useApp } from '../../src/context/AppContext';
import { useToast } from '../../src/components/ui/Toast';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../src/constants/theme';

export default function EditarPet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuarioLogado, pets, atualizarPet } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  const pet = pets.find(p => p.id === id);

  const [form, setForm] = useState({
    nome: pet?.nome ?? '',
    especie: (pet?.especie ?? 'Cachorro') as 'Cachorro' | 'Gato',
    raca: pet?.raca ?? '',
    idade: String(pet?.idade ?? ''),
    peso: String(pet?.peso ?? ''),
    observacoesSaude: pet?.observacoesSaude ?? '',
    porte: (pet?.porte ?? 'Médio') as 'Pequeno' | 'Médio' | 'Grande',
    comportamento: (pet?.comportamento ?? 'Calmo') as 'Calmo' | 'Agitado' | 'Agressivo',
    brincadeirasFavoritas: pet?.brincadeirasFavoritas ?? '',
    sexo: (pet?.sexo ?? 'Macho') as 'Macho' | 'Fêmea',
    naturalidade: pet?.naturalidade ?? '',
    castrado: pet?.castrado ?? false,
  });

  const set = (key: keyof typeof form) => (val: any) =>
    setForm(prev => ({ ...prev, [key]: val }));

  if (!usuarioLogado || !pet) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>Pet não encontrado.</Text>
        <Button onPress={() => router.back()} style={{ marginTop: Spacing[4] }}>
          Voltar
        </Button>
      </View>
    );
  }

  const handleSubmit = () => {
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

    atualizarPet(pet.id, { ...form, idade: idadeNum, peso: pesoNum });
    toast.success(`${form.nome} atualizado com sucesso!`);
    router.back();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Card>
          <CardHeader style={styles.header}>
            <View style={styles.iconWrap}>
              <Ionicons name="create-outline" size={32} color={Colors.teal} />
            </View>
            <CardTitle style={styles.title}>Editar Pet</CardTitle>
            <CardDescription style={styles.desc}>
              Atualize as informações de {pet.nome}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              Salvar Alterações
            </Button>

            <Button variant="outline" fullWidth onPress={() => router.back()}>
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
