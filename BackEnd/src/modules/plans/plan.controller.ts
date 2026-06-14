import { Request, Response, NextFunction } from 'express'
import { PlanService } from './plan.service'

export class PlanController {
  private planService: PlanService

  constructor() {
    this.planService = new PlanService()
  }

  listAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plans = await this.planService.getAllPlans()
      return res.status(200).json(plans)
    } catch (error) {
      next(error)
    }
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plan = await this.planService.getPlanById(Number(req.params.id))
      return res.status(200).json(plan)
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plan = await this.planService.createPlan(req.body)
      return res.status(201).json(plan)
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plan = await this.planService.updatePlan(Number(req.params.id), req.body)
      return res.status(200).json(plan)
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.planService.deletePlan(Number(req.params.id))
      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
