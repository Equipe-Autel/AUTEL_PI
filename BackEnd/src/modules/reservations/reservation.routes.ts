import { Router } from 'express'
import { ReservationController } from './reservation.controller'
import { authenticate } from '../../shared/middlewares/authMiddleware'

const reservationRoutes = Router()
const reservationController = new ReservationController()

reservationRoutes.use(authenticate)

reservationRoutes.post('/', reservationController.create)
reservationRoutes.get('/minhas', reservationController.listMy)
reservationRoutes.get('/todas', reservationController.listAll)
reservationRoutes.get('/:id', reservationController.show)
reservationRoutes.put('/:id', reservationController.update)
reservationRoutes.patch('/:id/cancelar', reservationController.cancel)

export { reservationRoutes }
