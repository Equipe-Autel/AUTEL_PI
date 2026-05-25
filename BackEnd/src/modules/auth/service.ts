import { prisma } from '../../shared/prisma'
import bcrypt from 'bcrypt'
import { jwtEncode } from '../../shared/jwtService';
import { UnauthorizedError, ValidationError } from '../../shared/errors/appError'

// Lógica de Login para User
export async function userLogin(email: string, senha: string) {
  if (!email || !senha) throw new ValidationError('Email e senha são obrigatórios')

  const usuario = await prisma.usuario.findUnique({ where: { email } })
  if (!usuario) throw new UnauthorizedError('Credenciais inválidas')

  const match = await bcrypt.compare(senha, usuario.senha)
  if (!match) throw new UnauthorizedError('Credenciais inválidas')

  const { token, id, role } = jwtEncode({ id: String(usuario.id), role: 'USUARIO' })

  return { token, id, role, email: usuario.email }
}

// Lógica de login para Admin
export async function adminLogin(codFunc: string, senha: string) {
  if (!codFunc || !senha) throw new ValidationError('Código do funcionário e senha são obrigatórios')

  const admin = await prisma.funcionario.findUnique({ where: { cod_funcionario: codFunc } })
  if (!admin) throw new UnauthorizedError('Credenciais inválidas')

  const match = await bcrypt.compare(senha, admin.senha)
  if (!match) throw new UnauthorizedError('Credenciais inválidas')

  const { token, id, role } = jwtEncode({ id: String(admin.id), role: 'ADMIN' })

  return { token, id, role, codFunc: admin.cod_funcionario }
}

