import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { PawPrint } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export const CadastroPet: React.FC = () => {
  const { usuarioLogado, adicionarPet } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    especie: 'Cachorro' as 'Cachorro' | 'Gato',
    raca: '',
    idade: 0,
    peso: 0,
    observacoesSaude: '',
    porte: 'Médio' as 'Pequeno' | 'Médio' | 'Grande',
    comportamento: 'Calmo' as 'Calmo' | 'Agitado' | 'Agressivo',
    brincadeirasFavoritas: '',
    sexo: 'Macho' as 'Macho' | 'Fêmea',
    naturalidade: '',
    castrado: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
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
      toast.error('Você precisa estar logado para cadastrar um pet.');
      navigate('/login');
      return;
    }

    adicionarPet({
      ...formData,
      usuarioId: usuarioLogado.id
    });

    toast.success(`${formData.nome} cadastrado com sucesso!`);
    navigate('/hotel');
  };

  if (!usuarioLogado) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="mb-4">Você precisa estar logado para cadastrar um pet.</p>
            <Link to="/login">
              <Button>Fazer Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PawPrint className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl">Cadastro de Pet</CardTitle>
            <CardDescription>
              Preencha as informações do seu pet para hospedagem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Informações Básicas</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="nome">Nome do Pet *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      placeholder="Nome do seu pet"
                    />
                  </div>

                  <div>
                    <Label htmlFor="especie">Espécie *</Label>
                    <Select value={formData.especie} onValueChange={(value) => handleSelectChange('especie', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cachorro">Cachorro</SelectItem>
                        <SelectItem value="Gato">Gato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="raca">Raça *</Label>
                    <Input
                      id="raca"
                      name="raca"
                      value={formData.raca}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Labrador, Persa"
                    />
                  </div>

                  <div>
                    <Label htmlFor="idade">Idade (anos) *</Label>
                    <Input
                      id="idade"
                      name="idade"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.idade}
                      onChange={handleChange}
                      required
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="peso">Peso (kg) *</Label>
                    <Input
                      id="peso"
                      name="peso"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.peso}
                      onChange={handleChange}
                      required
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              {/* Características Físicas */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Características</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="porte">Porte *</Label>
                    <Select value={formData.porte} onValueChange={(value) => handleSelectChange('porte', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pequeno">Pequeno</SelectItem>
                        <SelectItem value="Médio">Médio</SelectItem>
                        <SelectItem value="Grande">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sexo">Sexo *</Label>
                    <Select value={formData.sexo} onValueChange={(value) => handleSelectChange('sexo', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Macho">Macho</SelectItem>
                        <SelectItem value="Fêmea">Fêmea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="comportamento">Comportamento *</Label>
                    <Select value={formData.comportamento} onValueChange={(value) => handleSelectChange('comportamento', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Calmo">Calmo</SelectItem>
                        <SelectItem value="Agitado">Agitado</SelectItem>
                        <SelectItem value="Agressivo">Agressivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="naturalidade">Naturalidade</Label>
                    <Input
                      id="naturalidade"
                      name="naturalidade"
                      value={formData.naturalidade}
                      onChange={handleChange}
                      placeholder="Cidade/Estado"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="brincadeirasFavoritas">Brincadeiras Favoritas</Label>
                    <Input
                      id="brincadeirasFavoritas"
                      name="brincadeirasFavoritas"
                      value={formData.brincadeirasFavoritas}
                      onChange={handleChange}
                      placeholder="Ex: Buscar bolinha, brincar com laser"
                    />
                  </div>
                </div>
              </div>

              {/* Informações de Saúde */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Informações de Saúde</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="observacoesSaude">Observações de Saúde</Label>
                    <Textarea
                      id="observacoesSaude"
                      name="observacoesSaude"
                      value={formData.observacoesSaude}
                      onChange={handleChange}
                      placeholder="Alergias, medicações, condições especiais..."
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="castrado"
                      checked={formData.castrado}
                      onChange={(e) => setFormData(prev => ({ ...prev, castrado: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="castrado" className="cursor-pointer">
                      Pet castrado(a)
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Cadastrar Pet
                </Button>
                <Link to="/" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
