import { Request, Response, NextFunction } from 'express'
import { jwtDecode } from '../jwtService'
import { UnauthorizedError } from '../errors/AppError'

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token não fornecido')
  }

  const token = authHeader.split(' ')[1]

  const payload = jwtDecode(token)

  req.user = payload

  next()
}