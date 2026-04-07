import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Users, PawPrint, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';

export const Admin: React.FC = () => {
  const { usuarioLogado, usuarios, pets, reservas } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuarioLogado?.isAdmin) {
      navigate('/');
    }
  }, [usuarioLogado, navigate]);

  if (!usuarioLogado?.isAdmin) {
    return null;
  }

  const getPetNome = (petId: string) => {
    return pets.find(p => p.id === petId)?.nome || 'Pet não encontrado';
  };

  const getUsuarioNome = (usuarioId: string) => {
    return usuarios.find(u => u.id === usuarioId)?.nome || 'Usuário não encontrado';
  };

  const reservasAtivas = reservas.filter(r => r.status === 'Ativa');
  const reservasCanceladas = reservas.filter(r => r.status === 'Cancelada');
  const reservasFinalizadas = reservas.filter(r => r.status === 'Finalizada');

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold">Painel Administrativo</h1>
          </div>
          <p className="text-gray-600">Gerencie usuários, pets e reservas do sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total de Usuários</p>
                  <p className="text-3xl font-bold">{usuarios.length}</p>
                </div>
                <Users className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pets Cadastrados</p>
                  <p className="text-3xl font-bold">{pets.length}</p>
                </div>
                <PawPrint className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reservas Ativas</p>
                  <p className="text-3xl font-bold">{reservasAtivas.length}</p>
                </div>
                <Calendar className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total de Reservas</p>
                  <p className="text-3xl font-bold">{reservas.length}</p>
                </div>
                <Calendar className="w-12 h-12 text-gray-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="usuarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="pets">Pets</TabsTrigger>
            <TabsTrigger value="reservas">Reservas</TabsTrigger>
          </TabsList>

          {/* Usuários */}
          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <CardTitle>Usuários Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map(usuario => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{usuario.cpf}</TableCell>
                        <TableCell>{usuario.telefone}</TableCell>
                        <TableCell>
                          {usuario.isAdmin ? (
                            <Badge variant="default">Admin</Badge>
                          ) : (
                            <Badge variant="secondary">Cliente</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pets */}
          <TabsContent value="pets">
            <Card>
              <CardHeader>
                <CardTitle>Pets Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Espécie</TableHead>
                      <TableHead>Raça</TableHead>
                      <TableHead>Porte</TableHead>
                      <TableHead>Idade</TableHead>
                      <TableHead>Tutor</TableHead>
                      <TableHead>Comportamento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pets.map(pet => (
                      <TableRow key={pet.id}>
                        <TableCell className="font-medium">{pet.nome}</TableCell>
                        <TableCell>{pet.especie}</TableCell>
                        <TableCell>{pet.raca}</TableCell>
                        <TableCell>{pet.porte}</TableCell>
                        <TableCell>{pet.idade} anos</TableCell>
                        <TableCell>{getUsuarioNome(pet.usuarioId)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            pet.comportamento === 'Calmo' ? 'default' :
                            pet.comportamento === 'Agitado' ? 'secondary' :
                            'destructive'
                          }>
                            {pet.comportamento}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservas */}
          <TabsContent value="reservas">
            <div className="space-y-6">
              {/* Reservas Ativas */}
              <Card>
                <CardHeader>
                  <CardTitle>Reservas Ativas ({reservasAtivas.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pet</TableHead>
                        <TableHead>Tutor</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Acomodação</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservasAtivas.map(reserva => (
                        <TableRow key={reserva.id}>
                          <TableCell className="font-medium">{getPetNome(reserva.petId)}</TableCell>
                          <TableCell>{getUsuarioNome(reserva.usuarioId)}</TableCell>
                          <TableCell>{new Date(reserva.dataEntrada).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{new Date(reserva.dataSaidaPrevista).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{reserva.tipoAcomodacao}</TableCell>
                          <TableCell>R$ {reserva.valorTotal.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="default">{reserva.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {reservasAtivas.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                            Nenhuma reserva ativa no momento
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Todas as Reservas */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Reservas</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pet</TableHead>
                        <TableHead>Tutor</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Cadastro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...reservas]
                        .sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime())
                        .map(reserva => (
                        <TableRow key={reserva.id}>
                          <TableCell className="font-medium">{getPetNome(reserva.petId)}</TableCell>
                          <TableCell>{getUsuarioNome(reserva.usuarioId)}</TableCell>
                          <TableCell>{new Date(reserva.dataEntrada).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{new Date(reserva.dataSaidaPrevista).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>R$ {reserva.valorTotal.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              reserva.status === 'Ativa' ? 'default' :
                              reserva.status === 'Cancelada' ? 'destructive' :
                              'secondary'
                            }>
                              {reserva.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(reserva.dataCadastro).toLocaleDateString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Estatísticas de Reservas */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-1">Reservas Canceladas</p>
                    <p className="text-3xl font-bold text-red-600">{reservasCanceladas.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-1">Reservas Finalizadas</p>
                    <p className="text-3xl font-bold text-blue-600">{reservasFinalizadas.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-1">Receita Total</p>
                    <p className="text-3xl font-bold text-green-600">
                      R$ {reservas.filter(r => r.status !== 'Cancelada').reduce((sum, r) => sum + r.valorTotal, 0).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};