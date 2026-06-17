import bcrypt from 'bcrypt'
import { ConflictError, ValidationError } from '../../shared/errors/appError'
import * as adminRepository from './admin.repository'
import { CreateAdminDTO, AdminResponse } from './admin.types'

export async function createAdmin(dto: CreateAdminDTO): Promise<AdminResponse> {
  if (!dto.cod_funcionario || !dto.nome || !dto.cargo || !dto.senha) {
    throw new ValidationError('Campos obrigatórios não preenchidos')
  }

  const exists = await adminRepository.findByCodFuncionario(dto.cod_funcionario)
  if (exists) throw new ConflictError('Código de funcionário já cadastrado')

  const hashedSenha = await bcrypt.hash(dto.senha, 10)
  const admin = await adminRepository.createAdmin(dto, hashedSenha)

  return {
    id: admin.id,
    cod_funcionario: admin.cod_funcionario,
    nome: admin.nome,
    cargo: admin.cargo,
  }
}
