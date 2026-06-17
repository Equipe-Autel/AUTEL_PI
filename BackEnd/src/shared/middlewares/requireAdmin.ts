import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '../errors/appError'

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    throw new ForbiddenError('Acesso restrito a administradores')
  }
  next()
}
