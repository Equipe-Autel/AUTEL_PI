import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Calendar, Edit, Trash2, DollarSign, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export const MinhasReservas: React.FC = () => {
  const { usuarioLogado, reservas, pets, cancelarReserva, atualizarReserva, calcularValorHospedagem } = useApp();
  const navigate = useNavigate();
  
  const [reservaParaCancelar, setReservaParaCancelar] = useState<string | null>(null);
  const [reservaParaEditar, setReservaParaEditar] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    dataSaidaPrevista: '',
    tipoAcomodacao: 'Standard' as 'Standard' | 'Premium' | 'Luxo'
  });

  if (!usuarioLogado) {
    navigate('/login');
    return null;
  }

  const minhasReservas = reservas.filter(r => r.usuarioId === usuarioLogado.id);

  const getPetNome = (petId: string) => {
    return pets.find(p => p.id === petId)?.nome || 'Pet não encontrado';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Ativa': 'default',
      'Cancelada': 'destructive',
      'Finalizada': 'secondary'
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
  };

  const handleCancelarClick = (reservaId: string) => {
    setReservaParaCancelar(reservaId);
  };

  const confirmarCancelamento = () => {
    if (!reservaParaCancelar) return;
    
    const resultado = cancelarReserva(reservaParaCancelar);
    
    if (resultado.sucesso) {
      if (resultado.multa > 0) {
        toast.warning(`Reserva cancelada. Multa de R$ ${resultado.multa.toFixed(2)} será aplicada.`);
      } else {
        toast.success('Reserva cancelada sem multa!');
      }
    } else {
      toast.error('Erro ao cancelar reserva.');
    }
    
    setReservaParaCancelar(null);
  };

  const handleEditarClick = (reserva: any) => {
    setReservaParaEditar(reserva.id);
    setEditForm({
      dataSaidaPrevista: reserva.dataSaidaPrevista,
      tipoAcomodacao: reserva.tipoAcomodacao
    });
  };

  const confirmarEdicao = () => {
    if (!reservaParaEditar) return;
    
    const reserva = reservas.find(r => r.id === reservaParaEditar);
    if (!reserva) return;

    const novoValor = calcularValorHospedagem(
      reserva.dataEntrada,
      editForm.dataSaidaPrevista,
      editForm.tipoAcomodacao
    );

    atualizarReserva(reservaParaEditar, {
      dataSaidaPrevista: editForm.dataSaidaPrevista,
      tipoAcomodacao: editForm.tipoAcomodacao,
      valorTotal: novoValor
    });

    toast.success('Reserva atualizada com sucesso!');
    setReservaParaEditar(null);
  };

  const reservasAtivas = minhasReservas.filter(r => r.status === 'Ativa');
  const reservasHistorico = minhasReservas.filter(r => r.status !== 'Ativa');

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Minhas Reservas</h1>
          <p className="text-gray-600">Gerencie suas reservas de hospedagem</p>
        </div>

        {minhasReservas.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma reserva encontrada</h3>
              <p className="text-gray-600 mb-6">Faça sua primeira reserva agora!</p>
              <Link to="/hotel">
                <Button>Nova Reserva</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Reservas Ativas */}
            {reservasAtivas.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Reservas Ativas</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {reservasAtivas.map(reserva => {
                    const pet = pets.find(p => p.id === reserva.petId);
                    const diasRestantes = Math.ceil((new Date(reserva.dataEntrada).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <Card key={reserva.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{getPetNome(reserva.petId)}</CardTitle>
                              <p className="text-sm text-gray-600">{pet?.especie} - {pet?.raca}</p>
                            </div>
                            {getStatusBadge(reserva.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Check-in</p>
                              <p className="font-semibold">{new Date(reserva.dataEntrada).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Check-out</p>
                              <p className="font-semibold">{new Date(reserva.dataSaidaPrevista).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>

                          {diasRestantes > 0 && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Faltam {diasRestantes} {diasRestantes === 1 ? 'dia' : 'dias'} para o check-in
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Acomodação</p>
                              <p className="font-semibold">{reserva.tipoAcomodacao}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Alimentação</p>
                              <p className="font-semibold">{reserva.responsavelAlimentacao}</p>
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-gray-600">Valor Total</span>
                              <span className="text-2xl font-bold text-green-600">
                                R$ {reserva.valorTotal.toFixed(2)}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleEditarClick(reserva)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleCancelarClick(reserva.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Histórico */}
            {reservasHistorico.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Histórico</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {reservasHistorico.map(reserva => (
                    <Card key={reserva.id} className="opacity-75">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{getPetNome(reserva.petId)}</CardTitle>
                          {getStatusBadge(reserva.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Check-in</p>
                            <p className="font-semibold">{new Date(reserva.dataEntrada).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Check-out</p>
                            <p className="font-semibold">{new Date(reserva.dataSaidaPrevista).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Valor</span>
                            <span className="font-bold">R$ {reserva.valorTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Dialog de Cancelamento */}
        <Dialog open={!!reservaParaCancelar} onOpenChange={() => setReservaParaCancelar(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Cancelamento</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja cancelar esta reserva?
              </DialogDescription>
            </DialogHeader>
            
            {reservaParaCancelar && (() => {
              const reserva = reservas.find(r => r.id === reservaParaCancelar);
              if (!reserva) return null;
              
              const diasAteEntrada = Math.ceil((new Date(reserva.dataEntrada).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const temMulta = diasAteEntrada < 7;
              const valorMulta = temMulta ? reserva.valorTotal * 0.3 : 0;

              return (
                <div className="py-4">
                  {temMulta ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-yellow-800 mb-1">Atenção: Multa por Cancelamento</p>
                          <p className="text-sm text-yellow-700">
                            Como faltam menos de 7 dias para a data de entrada, será cobrada uma multa de 30% do valor total.
                          </p>
                          <p className="text-lg font-bold text-yellow-800 mt-2">
                            Valor da multa: R$ {valorMulta.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800">
                        ✓ Cancelamento sem multa (mais de 7 dias de antecedência)
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            <DialogFooter>
              <Button variant="outline" onClick={() => setReservaParaCancelar(null)}>
                Voltar
              </Button>
              <Button variant="destructive" onClick={confirmarCancelamento}>
                Confirmar Cancelamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Edição */}
        <Dialog open={!!reservaParaEditar} onOpenChange={() => setReservaParaEditar(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Reserva</DialogTitle>
              <DialogDescription>
                Atualize os dados da sua reserva
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-dataSaida">Data de Saída</Label>
                <Input
                  id="edit-dataSaida"
                  type="date"
                  value={editForm.dataSaidaPrevista}
                  onChange={(e) => setEditForm(prev => ({ ...prev, dataSaidaPrevista: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="edit-acomodacao">Tipo de Acomodação</Label>
                <Select 
                  value={editForm.tipoAcomodacao} 
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, tipoAcomodacao: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard - R$ 80/dia</SelectItem>
                    <SelectItem value="Premium">Premium - R$ 150/dia</SelectItem>
                    <SelectItem value="Luxo">Luxo - R$ 250/dia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reservaParaEditar && (() => {
                const reserva = reservas.find(r => r.id === reservaParaEditar);
                if (!reserva || !editForm.dataSaidaPrevista) return null;

                const novoValor = calcularValorHospedagem(
                  reserva.dataEntrada,
                  editForm.dataSaidaPrevista,
                  editForm.tipoAcomodacao
                );

                return (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Novo valor total:</span>
                      <span className="text-xl font-bold text-blue-600">
                        R$ {novoValor.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReservaParaEditar(null)}>
                Cancelar
              </Button>
              <Button onClick={confirmarEdicao}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
