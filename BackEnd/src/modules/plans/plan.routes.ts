import { Router } from 'express'
import { PlanController } from './plan.controller'
import { authenticate } from '../../shared/middlewares/authMiddleware'

const planRoutes = Router()
const planController = new PlanController()

planRoutes.get('/', planController.listAll)
planRoutes.get('/:id', planController.show)

planRoutes.post('/', authenticate, planController.create)
planRoutes.put('/:id', authenticate, planController.update)
planRoutes.delete('/:id', authenticate, planController.delete)

export { planRoutes }
