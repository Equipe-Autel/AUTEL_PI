import { prisma } from '../../shared/prisma'
import { CreatePlanDTO, UpdatePlanDTO } from './plan.types'

export class PlanRepository {
  async findAll() {
    return prisma.plano.findMany()
  }

  async findById(id: number) {
    return prisma.plano.findUnique({ where: { id } })
  }

  async create(data: CreatePlanDTO) {
    return prisma.plano.create({ data })
  }

  async update(id: number, data: UpdatePlanDTO) {
    return prisma.plano.update({ where: { id }, data })
  }

  async delete(id: number) {
    return prisma.plano.delete({ where: { id } })
  }
}
