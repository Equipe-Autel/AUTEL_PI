export interface Usuario {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  telefone: string;
  email: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  contatoEmergencia: string;
  telefoneEmergencia: string;
  isAdmin?: boolean;
}

export interface Pet {
  id: string;
  usuarioId: string;
  nome: string;
  especie: 'Cachorro' | 'Gato';
  raca: string;
  idade: number;
  peso: number;
  observacoesSaude: string;
  porte: 'Pequeno' | 'Médio' | 'Grande';
  comportamento: 'Calmo' | 'Agitado' | 'Agressivo';
  brincadeirasFavoritas: string;
  sexo: 'Macho' | 'Fêmea';
  naturalidade: string;
  castrado: boolean;
}

export interface Reserva {
  id: string;
  petId: string;
  usuarioId: string;
  dataEntrada: string;
  dataSaidaPrevista: string;
  dataSaida?: string;
  responsavelAlimentacao: 'Tutor' | 'Hotel';
  tipoAcomodacao: string;
  observacoesComida: string;
  status: 'Ativa' | 'Cancelada' | 'Finalizada';
  valorTotal: number;
  dataCadastro: string;
}

export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
}
