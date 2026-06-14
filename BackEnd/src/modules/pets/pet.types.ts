import { UserResponse } from '../users/user.types'

export interface CreatePetDTO {
  nome: string
  especie: string
  raca: string
  data_nascimento: string | Date
  peso: number
  porte: string // 'P', 'M', 'G'
  sexo: string // 'M', 'F'
  naturalidade: string
  comportamento: string
  brincadeiras_favoritas?: string
  obs_saude: string
  castrado: string // 'S', 'N'
  usuario_id: string // Recebemos como string da rota
}

export interface UpdatePetDTO {
  nome?: string
  especie?: string
  raca?: string
  data_nascimento?: string | Date
  peso?: number
  porte?: string
  sexo?: string
  naturalidade?: string
  comportamento?: string
  brincadeiras_favoritas?: string
  obs_saude?: string
  castrado?: string
}

export interface PetResponse {
  id: string
  nome: string
  especie: string
  raca: string
  data_nascimento: Date
  peso: number
  porte: string
  sexo: string
  naturalidade: string
  comportamento: string
  brincadeiras_favoritas: string | null
  obs_saude: string
  castrado: string
  usuario_id: string
  usuario?: UserResponse
}