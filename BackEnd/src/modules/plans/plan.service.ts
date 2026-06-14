import { PlanRepository } from './plan.repository'
import { CreatePlanDTO, UpdatePlanDTO, PlanResponse } from './plan.types'
import { NotFoundError, ValidationError } from '../../shared/errors/appError'

export class PlanService {
  private planRepository: PlanRepository

  constructor() {
    this.planRepository = new PlanRepository()
  }

  private serialize(plan: any): PlanResponse {
    return {
      id: plan.id,
      nome: plan.nome,
      valor_diaria: Number(plan.valor_diaria),
      descricao: plan.descricao,
    }
  }

  async getAllPlans(): Promise<PlanResponse[]> {
    const plans = await this.planRepository.findAll()
    return plans.map((p) => this.serialize(p))
  }

  async getPlanById(id: number): Promise<PlanResponse> {
    const plan = await this.planRepository.findById(id)
    if (!plan) throw new NotFoundError('Plano não encontrado')
    return this.serialize(plan)
  }

  async createPlan(data: CreatePlanDTO): Promise<PlanResponse> {
    if (!data.nome || !data.valor_diaria || !data.descricao) {
      throw new ValidationError('Campos obrigatórios não preenchidos')
    }
    const plan = await this.planRepository.create(data)
    return this.serialize(plan)
  }

  async updatePlan(id: number, data: UpdatePlanDTO): Promise<PlanResponse> {
    const exists = await this.planRepository.findById(id)
    if (!exists) throw new NotFoundError('Plano não encontrado')
    const plan = await this.planRepository.update(id, data)
    return this.serialize(plan)
  }

  async deletePlan(id: number): Promise<void> {
    const exists = await this.planRepository.findById(id)
    if (!exists) throw new NotFoundError('Plano não encontrado')
    await this.planRepository.delete(id)
  }
}
