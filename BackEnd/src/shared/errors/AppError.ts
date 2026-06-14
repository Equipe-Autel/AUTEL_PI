export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400,
    public readonly code?: string,
    public readonly isOperational = true
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
 
export class BadRequestError extends AppError {
  constructor(message = 'Requisição inválida') {
    super(message, 400, 'BAD_REQUEST')
  }
}
 
export class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado') {
    super(message, 401, 'UNAUTHORIZED')
  }
}
 
export class ForbiddenError extends AppError {
  constructor(message = 'Sem permissão para esta ação') {
    super(message, 403, 'FORBIDDEN')
  }
}
 
export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404, 'NOT_FOUND')
  }
}
 
export class ConflictError extends AppError {
  constructor(message = 'Conflito de recurso') {
    super(message, 409, 'CONFLICT')
  }
}
 
export class ValidationError extends AppError {
  constructor(
    message = 'Dados inválidos',
    public readonly fields?: Record<string, string>
  ) {
    super(message, 422, 'VALIDATION_ERROR')
  }
}