import { Request, Response, NextFunction } from 'express'
import { ReservationService } from './reservation.service'

export class ReservationController {
  private reservationService: ReservationService

  constructor() {
    this.reservationService = new ReservationService()
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reserva = await this.reservationService.createReservation(req.body, req.user!.id)
      return res.status(201).json(reserva)
    } catch (error) {
      next(error)
    }
  }

  listMy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reservas = await this.reservationService.getMyReservations(req.user!.id)
      return res.status(200).json(reservas)
    } catch (error) {
      next(error)
    }
  }

  listAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reservas = await this.reservationService.getAllReservations()
      return res.status(200).json(reservas)
    } catch (error) {
      next(error)
    }
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reserva = await this.reservationService.getReservationById(
        req.params.id,
        req.user!.id,
        req.user!.role
      )
      return res.status(200).json(reserva)
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reserva = await this.reservationService.updateReservation(
        req.params.id,
        req.body,
        req.user!.id
      )
      return res.status(200).json(reserva)
    } catch (error) {
      next(error)
    }
  }

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reserva = await this.reservationService.cancelReservation(req.params.id, req.user!.id)
      return res.status(200).json(reserva)
    } catch (error) {
      next(error)
    }
  }
}
