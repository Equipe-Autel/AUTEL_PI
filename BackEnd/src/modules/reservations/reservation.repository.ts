import { prisma } from '../../shared/prisma'

export class ReservationRepository {
  async findById(id: bigint) {
    return prisma.reserva.findUnique({
      where: { id },
      include: { plano: true, pet: true, usuario: true },
    })
  }

  async findByUserId(usuario_id: bigint) {
    return prisma.reserva.findMany({
      where: { usuario_id },
      include: { plano: true, pet: true },
      orderBy: { data_reserva: 'desc' },
    })
  }

  async findAll() {
    return prisma.reserva.findMany({
      include: { plano: true, pet: true, usuario: true },
      orderBy: { data_reserva: 'desc' },
    })
  }

  async create(data: {
    cod_reserva: string
    checkin: Date
    checkout: Date
    status_reserva: string
    status_pagamento: string
    observacoes?: string
    alimentacao: string
    plano_id: number
    usuario_id: bigint
    pet_id: bigint
  }) {
    return prisma.reserva.create({
      data,
      include: { plano: true, pet: true },
    })
  }

  async update(
    id: bigint,
    data: {
      checkin?: Date
      checkout?: Date
      observacoes?: string
      alimentacao?: string
      plano_id?: number
      status_reserva?: string
      status_pagamento?: string
    }
  ) {
    return prisma.reserva.update({
      where: { id },
      data,
      include: { plano: true, pet: true },
    })
  }
}
