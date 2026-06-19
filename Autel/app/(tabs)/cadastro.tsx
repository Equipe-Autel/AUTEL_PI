import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardHeader, CardTitle, CardContent } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useApp } from '../../src/context/AppContext';
import { useToast } from '../../src/components/ui/Toast';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../src/constants/theme';
import { apiCreateAdmin } from '../../src/services/auth';
import { getItem } from '../../src/utils/storage';

function gerarSenha(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const FORM_INITIAL = { nome: '', cod_funcionario: '', cargo: '' };

export default function Cadastro() {
  const { usuarioLogado } = useApp();
  const { toast } = useToast();
  const [form, setForm] = useState(FORM_INITIAL);
  const [loading, setLoading] = useState(false);
  const [criado, setCriado] = useState<{ cod_funcionario: string; nome: string; senha: string } | null>(null);

  const set = (key: keyof typeof FORM_INITIAL) => (val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  if (!usuarioLogado?.isAdmin) return null;

  const handleSubmit = async () => {
    if (!form.nome.trim() || !form.cod_funcionario.trim() || !form.cargo.trim()) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const codFormatado = form.cod_funcionario.trim().toUpperCase();
    if (!codFormatado.startsWith('ADM')) {
      toast.error('Código do funcionário deve começar com ADM (ex: ADM002).');
      return;
    }

    const senhaGerada = gerarSenha();
    setLoading(true);
    try {
      const token = await getItem<string>('auth_token');
      if (!token) throw new Error('Token não encontrado.');

      await apiCreateAdmin(
        { cod_funcionario: codFormatado, nome: form.nome.trim(), cargo: form.cargo.trim(), senha: senhaGerada },
        token
      );

      setCriado({ cod_funcionario: codFormatado, nome: form.nome.trim(), senha: senhaGerada });
      setForm(FORM_INITIAL);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar administrador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>

        {/* Card de sucesso com credenciais */}
        {criado && (
          <Card style={styles.successCard}>
            <CardContent>
              <View style={styles.successHeader}>
                <Ionicons name="checkmark-circle" size={28} color={Colors.green} />
                <Text style={styles.successTitle}>Administrador criado!</Text>
              </View>

              <View style={styles.credRow}>
                <Text style={styles.credLabel}>Código:</Text>
                <Text style={styles.credValue}>{criado.cod_funcionario}</Text>
              </View>
              <View style={styles.credRow}>
                <Text style={styles.credLabel}>Nome:</Text>
                <Text style={styles.credValue}>{criado.nome}</Text>
              </View>
              <View style={styles.credRow}>
                <Text style={styles.credLabel}>Senha temporária:</Text>
                <Text style={[styles.credValue, styles.senha]}>{criado.senha}</Text>
              </View>

              <View style={styles.aviso}>
                <Ionicons name="warning-outline" size={18} color={Colors.orange} />
                <Text style={styles.avisoText}>
                  Repasse estas credenciais de forma segura. Esta é uma senha temporária — o novo administrador deve alterá-la no próximo acesso.
                </Text>
              </View>

              <Button
                variant="outline"
                fullWidth
                onPress={() => setCriado(null)}
                style={{ marginTop: Spacing[3] }}
              >
                Criar outro administrador
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Formulário */}
        {!criado && (
          <Card>
            <CardHeader style={styles.header}>
              <View style={styles.iconWrap}>
                <Ionicons name="shield-checkmark-outline" size={32} color={Colors.teal} />
              </View>
              <CardTitle style={styles.title}>Criar Administrador</CardTitle>
              <Text style={styles.subtitle}>A senha será gerada automaticamente</Text>
            </CardHeader>

            <CardContent>
              <Input
                label="Nome completo *"
                value={form.nome}
                onChangeText={set('nome')}
                placeholder="Nome do administrador"
                autoCapitalize="words"
              />

              <Input
                label="Código do funcionário *"
                value={form.cod_funcionario}
                onChangeText={v => set('cod_funcionario')(v.toUpperCase())}
                placeholder="ADM002"
                autoCapitalize="characters"
              />
              <Text style={styles.hint}>Deve começar com ADM (ex: ADM002, ADM003)</Text>

              <Input
                label="Cargo *"
                value={form.cargo}
                onChangeText={set('cargo')}
                placeholder="Ex: Gerente, Veterinário..."
                autoCapitalize="words"
              />

              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={18} color={Colors.teal} />
                <Text style={styles.infoText}>
                  Uma senha segura será gerada automaticamente. Anote e repasse ao novo administrador.
                </Text>
              </View>

              <Button
                fullWidth
                onPress={handleSubmit}
                disabled={loading}
                style={styles.submitBtn}
              >
                {loading ? 'Criando...' : 'Criar Administrador'}
              </Button>

              <Button variant="outline" fullWidth onPress={() => setForm(FORM_INITIAL)}>
                Limpar
              </Button>
            </CardContent>
          </Card>
        )}
      </View>
      <View style={{ height: Spacing[8] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.beige },
  content: { padding: Spacing[4] },

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
  subtitle: { fontSize: FontSizes.sm, color: Colors.gray[500], textAlign: 'center', marginTop: 4 },

  hint: {
    fontSize: FontSizes.xs,
    color: Colors.gray[400],
    marginTop: -8,
    marginBottom: Spacing[3],
    marginLeft: 2,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.tealLight,
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
    marginVertical: Spacing[3],
  },
  infoText: { flex: 1, fontSize: FontSizes.sm, color: Colors.teal, lineHeight: 18 },

  submitBtn: { marginTop: Spacing[2], marginBottom: Spacing[3] },

  successCard: { borderWidth: 1.5, borderColor: Colors.green },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing[4],
  },
  successTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.green },

  credRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing[2],
  },
  credLabel: { fontSize: FontSizes.sm, color: Colors.gray[500], width: 130 },
  credValue: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.gray[900], flex: 1 },
  senha: { color: Colors.teal, fontSize: FontSizes.base, letterSpacing: 1 },

  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.orangeLight,
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
    marginTop: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.orange,
  },
  avisoText: { flex: 1, fontSize: FontSizes.sm, color: Colors.orange, lineHeight: 18 },
});
