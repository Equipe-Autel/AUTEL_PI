import { prisma } from '../../shared/prisma'
import { ReservationRepository } from './reservation.repository'
import { CreateReservationDTO, UpdateReservationDTO, ReservationResponse } from './reservation.types'
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
  BadRequestError,
} from '../../shared/errors/AppError'

function generateCodReserva(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `RES-${timestamp}-${random}`
}

function calcDays(checkin: Date, checkout: Date): number {
  const ms = checkout.getTime() - checkin.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export class ReservationService {
  private reservationRepository: ReservationRepository

  constructor() {
    this.reservationRepository = new ReservationRepository()
  }

  private serialize(reserva: any): ReservationResponse {
    const days = calcDays(new Date(reserva.checkin), new Date(reserva.checkout))
    const valor_diaria = reserva.plano ? Number(reserva.plano.valor_diaria) : 0

    return {
      id: reserva.id.toString(),
      cod_reserva: reserva.cod_reserva,
      data_reserva: reserva.data_reserva,
      checkin: reserva.checkin,
      checkout: reserva.checkout,
      data_horario_entrada: reserva.data_horario_entrada,
      data_horario_saida: reserva.data_horario_saida,
      status_reserva: reserva.status_reserva,
      status_pagamento: reserva.status_pagamento,
      observacoes: reserva.observacoes,
      alimentacao: reserva.alimentacao,
      plano_id: reserva.plano_id,
      usuario_id: reserva.usuario_id.toString(),
      pet_id: reserva.pet_id.toString(),
      funcionario_id: reserva.funcionario_id,
      valor_total: valor_diaria * days,
    }
  }

  async createReservation(data: CreateReservationDTO, usuarioId: string): Promise<ReservationResponse> {
    const checkin = new Date(data.checkin)
    const checkout = new Date(data.checkout)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    if (checkin < hoje) throw new ValidationError('Data de check-in não pode ser no passado')
    if (checkout <= checkin) throw new ValidationError('Data de checkout deve ser após o check-in')

    const pet = await prisma.pet.findUnique({ where: { id: BigInt(data.pet_id) } })
    if (!pet) throw new NotFoundError('Pet não encontrado')
    if (pet.usuario_id.toString() !== usuarioId) throw new ForbiddenError('Este pet não pertence a você')

    const plano = await prisma.plano.findUnique({ where: { id: data.plano_id } })
    if (!plano) throw new NotFoundError('Plano não encontrado')

    const reserva = await this.reservationRepository.create({
      cod_reserva: generateCodReserva(),
      checkin,
      checkout,
      status_reserva: 'ATIVA',
      status_pagamento: 'PENDENTE',
      observacoes: data.observacoes,
      alimentacao: data.alimentacao,
      plano_id: data.plano_id,
      usuario_id: BigInt(usuarioId),
      pet_id: BigInt(data.pet_id),
    })

    return this.serialize(reserva)
  }

  async getReservationById(id: string, usuarioId: string, role: string): Promise<ReservationResponse> {
    const reserva = await this.reservationRepository.findById(BigInt(id))
    if (!reserva) throw new NotFoundError('Reserva não encontrada')
    if (role !== 'ADMIN' && reserva.usuario_id.toString() !== usuarioId) throw new ForbiddenError()
    return this.serialize(reserva)
  }

  async getMyReservations(usuarioId: string): Promise<ReservationResponse[]> {
    const reservas = await this.reservationRepository.findByUserId(BigInt(usuarioId))
    return reservas.map((r) => this.serialize(r))
  }

  async getAllReservations(): Promise<ReservationResponse[]> {
    const reservas = await this.reservationRepository.findAll()
    return reservas.map((r) => this.serialize(r))
  }

  async updateReservation(id: string, data: UpdateReservationDTO, usuarioId: string): Promise<ReservationResponse> {
    const reserva = await this.reservationRepository.findById(BigInt(id))
    if (!reserva) throw new NotFoundError('Reserva não encontrada')
    if (reserva.usuario_id.toString() !== usuarioId) throw new ForbiddenError()
    if (reserva.status_reserva === 'CANCELADA') throw new BadRequestError('Não é possível alterar uma reserva cancelada')

    if (data.plano_id) {
      const plano = await prisma.plano.findUnique({ where: { id: data.plano_id } })
      if (!plano) throw new NotFoundError('Plano não encontrado')
    }

    const checkin = data.checkin ? new Date(data.checkin) : reserva.checkin
    const checkout = data.checkout ? new Date(data.checkout) : reserva.checkout
    if (checkout <= checkin) throw new ValidationError('Data de checkout deve ser após o check-in')

    const updated = await this.reservationRepository.update(BigInt(id), {
      checkin: data.checkin ? new Date(data.checkin) : undefined,
      checkout: data.checkout ? new Date(data.checkout) : undefined,
      observacoes: data.observacoes,
      alimentacao: data.alimentacao,
      plano_id: data.plano_id,
    })

    return this.serialize(updated)
  }

  async cancelReservation(id: string, usuarioId: string): Promise<ReservationResponse & { multa: boolean }> {
    const reserva = await this.reservationRepository.findById(BigInt(id))
    if (!reserva) throw new NotFoundError('Reserva não encontrada')
    if (reserva.usuario_id.toString() !== usuarioId) throw new ForbiddenError()
    if (reserva.status_reserva === 'CANCELADA') throw new BadRequestError('Reserva já cancelada')

    const diasAteCheckin = Math.ceil(
      (reserva.checkin.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    const temMulta = diasAteCheckin < 7

    const updated = await this.reservationRepository.update(BigInt(id), {
      status_reserva: 'CANCELADA',
      status_pagamento: temMulta ? 'REEMBOLSO_PARCIAL' : 'REEMBOLSADO',
    })

    return { ...this.serialize(updated), multa: temMulta }
  }
}
