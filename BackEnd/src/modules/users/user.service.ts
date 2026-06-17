import bcrypt from 'bcrypt'
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from '../../shared/errors/appError'
import * as userRepository from './user.repository'
import { CreateUserDTO, UpdateUserDTO, UserResponse, CreateAdminDTO, AdminResponse } from './user.types'

function toResponse(user: Awaited<ReturnType<typeof userRepository.findById>>): UserResponse {
  return {
    id: String(user!.id),
    nome: user!.nome,
    sobrenome: user!.sobrenome,
    email: user!.email,
    cpf: user!.cpf,
    telefone: user!.telefone,
    contato_emergencia: user!.contato_emergencia ?? null,
    telefone_emergencia: user!.telefone_emergencia ?? null,
    endereco: user!.endereco,
  }
}

export async function createUser(dto: CreateUserDTO): Promise<UserResponse> {
  if (!dto.nome || !dto.sobrenome || !dto.cpf || !dto.telefone || !dto.email || !dto.senha) {
    throw new ValidationError('Campos obrigatórios não preenchidos')
  }

  if (!dto.endereco?.logradouro || !dto.endereco?.bairro || !dto.endereco?.cidade || !dto.endereco?.estado) {
    throw new ValidationError('Endereço incompleto')
  }

  const [emailExiste, cpfExiste] = await Promise.all([
    userRepository.findByEmail(dto.email),
    userRepository.findByCpf(dto.cpf),
  ])

  if (emailExiste) throw new ConflictError('Email já cadastrado')
  if (cpfExiste) throw new ConflictError('CPF já cadastrado')

  const hashedSenha = await bcrypt.hash(dto.senha, 10)
  const user = await userRepository.createUser(dto, hashedSenha)

  return toResponse(user)
}

export async function getUserById(id: string, requesterId: string, requesterRole: string): Promise<UserResponse> {
  if (requesterRole !== 'ADMIN' && id !== requesterId) {
    throw new ForbiddenError()
  }

  const user = await userRepository.findById(BigInt(id))
  if (!user) throw new NotFoundError('Usuário não encontrado')

  return toResponse(user)
}

export async function updateUser(id: string, dto: UpdateUserDTO, requesterId: string): Promise<UserResponse> {
  if (id !== requesterId) throw new ForbiddenError()

  const exists = await userRepository.findById(BigInt(id))
  if (!exists) throw new NotFoundError('Usuário não encontrado')

  const user = await userRepository.updateUser(BigInt(id), dto)
  return toResponse(user)
}

export async function deleteUser(id: string, requesterId: string, requesterRole: string): Promise<void> {
  if (requesterRole !== 'ADMIN' && id !== requesterId) {
    throw new ForbiddenError()
  }

  const exists = await userRepository.findById(BigInt(id))
  if (!exists) throw new NotFoundError('Usuário não encontrado')

  await userRepository.deleteUser(BigInt(id))
}

export async function createAdmin(dto: CreateAdminDTO, requesterRole: string): Promise<AdminResponse> {
  if (requesterRole !== 'ADMIN') {
    throw new ForbiddenError('Apenas administradores podem criar outros administradores')
  }

  if (!dto.cod_funcionario || !dto.senha || !dto.nome || !dto.cargo) {
    throw new ValidationError('Campos obrigatórios não preenchidos')
  }

  const codExiste = await userRepository.findFuncionarioByCod(dto.cod_funcionario)
  if (codExiste) throw new ConflictError('Código de funcionário já cadastrado')

  const hashedSenha = await bcrypt.hash(dto.senha, 10)
  const admin = await userRepository.createFuncionario(dto, hashedSenha)

  return {
    id: String(admin.id),
    cod_funcionario: admin.cod_funcionario,
    nome: admin.nome,
    cargo: admin.cargo,
  }
}
