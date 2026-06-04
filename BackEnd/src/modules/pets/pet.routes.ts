import { Router } from 'express'
import { PetController } from './pet.controller'
import { authenticate } from '../../shared/middlewares/authMiddleware'

const petRoutes = Router()
const petController = new PetController()

petRoutes.use(authenticate)

petRoutes.post('/', petController.create)
petRoutes.get('/', petController.listMyPets)
petRoutes.get('/:id', petController.show)
petRoutes.put('/:id', petController.update)
petRoutes.delete('/:id', petController.delete)

export { petRoutes }