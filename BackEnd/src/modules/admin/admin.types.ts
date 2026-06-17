export interface CreateAdminDTO {
  cod_funcionario: string
  nome: string
  cargo: string
  senha: string
}

export interface AdminResponse {
  id: number
  cod_funcionario: string
  nome: string
  cargo: string
}
