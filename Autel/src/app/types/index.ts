// Tipos do sistema Autel

export interface Usuario {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  telefone: string;
  email: string;
  endereco: string;
  isAdmin?: boolean;
}

export interface Pet {
  id: string;
  usuarioId: string;
  nome: string;
  especie: 'cachorro' | 'gato';
  raca: string;
  idade: number;
  peso: number;
  observacoesSaude: string;
  porte: 'pequeno' | 'medio' | 'grande';
  comportamento: 'calmo' | 'agitado' | 'agressivo';
  brincadeirasFavoritas: string;
  sexo: 'macho' | 'femea';
  naturalidade: string;
  castrado: boolean;
}

export interface Reserva {
  id: string;
  petId: string;
  usuarioId: string;
  dataEntrada: string;
  dataPrevistaSaida: string;
  dataSaida?: string;
  responsavelAlimentacao: 'tutor' | 'hotel';
  tipoAcomodacao: 'standard' | 'premium' | 'luxo';
  observacoesComida: string;
  valorTotal: number;
  status: 'ativa' | 'finalizada' | 'cancelada';
  canceladaEm?: string;
  multa?: number;
}

export interface Vaga {
  data: string;
  standard: number;
  premium: number;
  luxo: number;
}
