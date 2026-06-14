export interface CreateUserDTO {
  nome: string
  sobrenome: string
  cpf: string
  telefone: string
  email: string
  senha: string
  contato_emergencia?: string
  telefone_emergencia?: string
  endereco: {
    logradouro: string
    bairro: string
    cidade: string
    estado: string
    numero?: string
    complemento?: string
  }
}

export interface UpdateUserDTO {
  nome?: string
  sobrenome?: string
  telefone?: string
  contato_emergencia?: string
  telefone_emergencia?: string
  endereco?: {
    logradouro?: string
    bairro?: string
    cidade?: string
    estado?: string
    numero?: string
    complemento?: string
  }
}

export interface UserResponse {
  id: string
  nome: string
  sobrenome: string
  email: string
  cpf: string
  telefone: string
  contato_emergencia: string | null
  telefone_emergencia: string | null
  endereco: {
    id: number
    logradouro: string
    bairro: string
    cidade: string
    estado: string
    numero: string | null
    complemento: string | null
  }
}
