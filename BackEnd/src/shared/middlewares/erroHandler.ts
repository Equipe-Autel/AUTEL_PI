import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError'
import { ZodError } from 'zod'

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
){
  // Erros provenientes do AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    })
    return
  }

  // Tratamento de erros genéricos
  console.error('[ERRO INESPERADO]', err)
  res.status(500).json({
    error: {
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
    },
  })
}