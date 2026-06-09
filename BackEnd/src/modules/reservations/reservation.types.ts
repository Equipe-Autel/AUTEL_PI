export interface CreateReservationDTO {
  checkin: string | Date
  checkout: string | Date
  observacoes?: string
  alimentacao: string
  plano_id: number
  pet_id: string
}

export interface UpdateReservationDTO {
  checkin?: string | Date
  checkout?: string | Date
  observacoes?: string
  alimentacao?: string
  plano_id?: number
}

export interface ReservationResponse {
  id: string
  cod_reserva: string
  data_reserva: Date
  checkin: Date
  checkout: Date
  data_horario_entrada: Date | null
  data_horario_saida: Date | null
  status_reserva: string
  status_pagamento: string
  observacoes: string | null
  alimentacao: string
  plano_id: number
  usuario_id: string
  pet_id: string
  funcionario_id: number | null
  valor_total: number
}
