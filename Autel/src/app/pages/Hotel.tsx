import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Calendar, DollarSign, Home, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../components/ui/alert';

export const Hotel: React.FC = () => {
  const { usuarioLogado, pets, adicionarReserva, calcularValorHospedagem, obterVagasDisponiveis } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    petId: '',
    dataEntrada: '',
    dataSaidaPrevista: '',
    responsavelAlimentacao: 'Hotel' as 'Tutor' | 'Hotel',
    tipoAcomodacao: 'Standard' as 'Standard' | 'Premium' | 'Luxo',
    observacoesComida: ''
  });

  const [valorTotal, setValorTotal] = useState(0);
  const [vagasDisponiveis, setVagasDisponiveis] = useState<number | null>(null);
  const [diasHospedagem, setDiasHospedagem] = useState(0);

  const meusPets = usuarioLogado ? pets.filter(p => p.usuarioId === usuarioLogado.id) : [];

  useEffect(() => {
    if (formData.dataEntrada && formData.dataSaidaPrevista) {
      const entrada = new Date(formData.dataEntrada);
      const saida = new Date(formData.dataSaidaPrevista);
      
      if (saida > entrada) {
        const valor = calcularValorHospedagem(formData.dataEntrada, formData.dataSaidaPrevista, formData.tipoAcomodacao);
        setValorTotal(valor);
        
        const dias = Math.ceil((saida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24));
        setDiasHospedagem(dias);

        const vagas = obterVagasDisponiveis(formData.dataEntrada, formData.dataSaidaPrevista);
        setVagasDisponiveis(vagas);
      }
    }
  }, [formData.dataEntrada, formData.dataSaidaPrevista, formData.tipoAcomodacao]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuarioLogado) {
      toast.error('Você precisa estar logado para fazer uma reserva.');
      navigate('/login');
      return;
    }

    if (!formData.petId) {
      toast.error('Selecione um pet para a reserva.');
      return;
    }

    if (vagasDisponiveis !== null && vagasDisponiveis <= 0) {
      toast.error('Não há vagas disponíveis para o período selecionado.');
      return;
    }

    const dataEntrada = new Date(formData.dataEntrada);
    const dataSaida = new Date(formData.dataSaidaPrevista);
    
    if (dataSaida <= dataEntrada) {
      toast.error('A data de saída deve ser posterior à data de entrada.');
      return;
    }

    adicionarReserva({
      ...formData,
      usuarioId: usuarioLogado.id,
      status: 'Ativa',
      valorTotal
    });

    const pet = pets.find(p => p.id === formData.petId);
    toast.success(`Reserva confirmada para ${pet?.nome}!`);
    navigate('/minhas-reservas');
  };

  if (!usuarioLogado) {
    return (
      <div className="min-h-[60vh] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="pt-6 pb-6">
              <Home className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--autel-teal)' }} />
              <h2 className="text-xl font-bold mb-3">Faça Login para Reservar</h2>
              <p className="text-sm text-gray-600 mb-6">
                Para fazer uma reserva, você precisa estar logado no sistema.
              </p>
              <div className="flex gap-3">
                <Link to="/login" className="flex-1">
                  <Button className="w-full" style={{ backgroundColor: 'var(--autel-teal)', color: 'white' }}>Fazer Login</Button>
                </Link>
                <Link to="/cadastro-usuario" className="flex-1">
                  <Button variant="outline" className="w-full">Cadastrar</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (meusPets.length === 0) {
    return (
      <div className="min-h-[60vh] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="pt-6 pb-6">
              <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--autel-orange)' }} />
              <h2 className="text-xl font-bold mb-3">Cadastre um Pet Primeiro</h2>
              <p className="text-sm text-gray-600 mb-6">
                Você precisa cadastrar pelo menos um pet antes de fazer uma reserva.
              </p>
              <Link to="/cadastro-pet">
                <Button style={{ backgroundColor: 'var(--autel-teal)', color: 'white' }}>Cadastrar Pet</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 pb-4">
      <div className="max-w-4xl mx-auto">
        {/* Header - Compacto */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Reserve a Hospedagem</h1>
          <p className="text-sm text-gray-600">
            Escolha as datas e o tipo de acomodação
          </p>
        </div>

        <div className="space-y-4">
          {/* Formulário - Compacto */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Dados da Reserva</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Seleção de Pet */}
                <div>
                  <Label htmlFor="petId" className="text-sm">Selecione o Pet *</Label>
                  <Select value={formData.petId} onValueChange={(value) => handleSelectChange('petId', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Escolha um pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {meusPets.map(pet => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.nome} - {pet.especie} ({pet.raca})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Datas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="dataEntrada" className="text-sm">Entrada *</Label>
                    <Input
                      id="dataEntrada"
                      name="dataEntrada"
                      type="date"
                      value={formData.dataEntrada}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dataSaidaPrevista" className="text-sm">Saída *</Label>
                    <Input
                      id="dataSaidaPrevista"
                      name="dataSaidaPrevista"
                      type="date"
                      value={formData.dataSaidaPrevista}
                      onChange={handleChange}
                      required
                      min={formData.dataEntrada || new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Vagas Disponíveis - Compacto */}
                {vagasDisponiveis !== null && formData.dataEntrada && formData.dataSaidaPrevista && (
                  <Alert className={`py-3 ${vagasDisponiveis > 5 ? "border-green-200 bg-green-50" : vagasDisponiveis > 0 ? "border-yellow-200 bg-yellow-50" : "border-red-200 bg-red-50"}`}>
                    <Calendar className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>{vagasDisponiveis}</strong> vagas disponíveis
                      {vagasDisponiveis <= 5 && vagasDisponiveis > 0 && " - Reserve logo!"}
                      {vagasDisponiveis === 0 && " - Sem vagas"}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Tipo de Acomodação */}
                <div>
                  <Label htmlFor="tipoAcomodacao" className="text-sm">Tipo de Acomodação *</Label>
                  <Select value={formData.tipoAcomodacao} onValueChange={(value) => handleSelectChange('tipoAcomodacao', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard - R$ 80/dia</SelectItem>
                      <SelectItem value="Premium">Premium - R$ 150/dia</SelectItem>
                      <SelectItem value="Luxo">Luxo - R$ 250/dia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Alimentação */}
                <div>
                  <Label htmlFor="responsavelAlimentacao" className="text-sm">Responsável pela Alimentação *</Label>
                  <Select value={formData.responsavelAlimentacao} onValueChange={(value) => handleSelectChange('responsavelAlimentacao', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hotel">Hotel (cardápio padrão)</SelectItem>
                      <SelectItem value="Tutor">Tutor (trarei a ração)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Observações */}
                <div>
                  <Label htmlFor="observacoesComida" className="text-sm">Observações</Label>
                  <Textarea
                    id="observacoesComida"
                    name="observacoesComida"
                    value={formData.observacoesComida}
                    onChange={handleChange}
                    placeholder="Alergias, preferências alimentares, medicações..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* Resumo do Valor - Inline */}
                {valorTotal > 0 && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(45, 122, 123, 0.05)', borderLeft: '4px solid var(--autel-teal)' }}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-sm text-gray-600">Período de Hospedagem</p>
                        <p className="font-semibold">{diasHospedagem} {diasHospedagem === 1 ? 'dia' : 'dias'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Valor Total</p>
                        <p className="text-2xl font-bold" style={{ color: 'var(--autel-teal)' }}>
                          R$ {valorTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
                      * Cancelamentos com menos de 7 dias terão multa de 30%
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={vagasDisponiveis === 0}
                  style={{ backgroundColor: 'var(--autel-teal)', color: 'white' }}
                >
                  Confirmar Reserva
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};