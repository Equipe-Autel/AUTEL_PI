import jwt from 'jsonwebtoken'
import { BadRequestError, UnauthorizedError } from './errors/AppError'

const roles = ['USUARIO', 'ADMIN'] as const
type RolesENUM = typeof roles[number]

interface JwtPayload {
  id: string
  role: RolesENUM
}

const SECRET = process.env.JWT_SECRET
if (!SECRET) throw new Error('JWT_SECRET não definido no .env')

const VALID_SECRET = SECRET as string

export function jwtEncode(payload: JwtPayload) {
  if (!payload?.id || !payload?.role) throw new BadRequestError('Payload deve conter id e role')
  if (!roles.includes(payload.role)) throw new BadRequestError('Role inválida')

  const token = jwt.sign(payload, VALID_SECRET, { expiresIn: '1h' })
  return { token, id: payload.id, role: payload.role }
}

export function jwtDecode(token: string): JwtPayload {
  if (!token) throw new UnauthorizedError('Token não fornecido')

  try {
    return jwt.verify(token, VALID_SECRET) as JwtPayload
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw new UnauthorizedError('Token expirado')
    throw new UnauthorizedError('Token inválido')
  }
}
