export interface CreatePlanDTO {
  nome: string
  valor_diaria: number
  descricao: string
}

export interface UpdatePlanDTO {
  nome?: string
  valor_diaria?: number
  descricao?: string
}

export interface PlanResponse {
  id: number
  nome: string
  valor_diaria: number
  descricao: string
}
